/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import React, {useContext, useState, useEffect} from 'react';
import {PaymentsContext, StoreContext, OrderContext, ContainerContext} from '@oracle-cx-commerce/react-ui/contexts';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {
  getCurrentOrder,
  getProfile,
  getSessionContext,
  getOrders,
  getProfileRepository
} from '@oracle-cx-commerce/commerce-utils/selector';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {isEmptyObject, noop, formatDate} from '@oracle-cx-commerce/utils/generic';
import {
  deleteAppliedPaymentsByTypes,
  deleteAppliedPaymentsByIds,
  getAmountRemainingPaymentGroup,
  isPaymentDetailsComplete,
  isZeroValueOrder
} from '@oracle-cx-commerce/react-components/utils/payment';
import {
  PAYMENT_STATE_INITIAL,
  PAYMENT_TYPE_PAY_IN_STORE,
  PAYMENT_TYPE_STORECREDIT,
  PAYMENT_TYPE_GIFTCARD,
  PAYMENT_TYPE_LOYALTYPOINTS,
  PAYMENT_TYPE_PAY_LATER,
  PAYMENT_METHOD_TOKENIZED_CREDIT_CARD,
  PAYMENT_METHOD_CREDIT_CARD,
  PAYMENT_METHOD_INVOICE_REQUEST,
  PAYMENT_METHOD_ONLINE_PAYMENT_GROUP,
  PAYMENT_TYPE_INVOICE,
  PAYMENT_TYPE_CARD,
  PAGE_CHECKOUT_PAYMENT_AND_REVIEW_ORDER_LINK,
  PAGE_CHECKOUT_PAYMENT_LINK,
  PAGE_CHECKOUT_QUOTE_SHIPPING_LINK,
  PAGE_CHECKOUT_REVIEW_ORDER_LINK,
  PAGE_CHECKOUT_SHIPPING_LINK
} from '@oracle-cx-commerce/commerce-utils/constants';
import PropTypes from 'prop-types';
import {
  handleOrderSubmitSuccess,
  handleOrderSubmitFailure
} from '@oracle-cx-commerce/react-widgets/checkout/checkout-place-order-button/utils';
import css from './styles.css';
import {getShopperSubscription, getShopperProfile} from '../../../selectors/shopper-profile-selector';
import {setSelectedPaymentInfo} from '../helpers/payment-info-data';
import {getComponentData} from './selectors';
import LocalStorageService from '../../utils/localStorageService ';
import {getShippingAddress} from '../../ghw-paypal-button/utils/update-shipping-address';

const ERROR = 'error';

/**
 * Widget for Continue To Review Order button, navigates to review order page on click after applying selected payment.
 * @param props
 */
const ContinueToReviewOrderButton = props => {
  const {continueToPageAddress = '/checkout-review-order', actionContinueToReviewOrder, paymentGroups = {}} = props;
  const {payments = [], selectedPaymentType, addOrUpdatePaymentToContext} = useContext(PaymentsContext) || {};
  const store = useContext(StoreContext);
  const {action, getState} = store;
  const {currentPageType, orderId} = props;
  //these payments can be combined with some other payment type like credit card, gift card etc.
  //so these payment type should not be deleted while applying new compatible payment type
  const compatiblePaymentTypes = [PAYMENT_TYPE_GIFTCARD, PAYMENT_TYPE_LOYALTYPOINTS, PAYMENT_TYPE_STORECREDIT];

  const [inProgress, setInProgress] = useState(false);

  const goToPage = useNavigator();
  const {billingFrequency} = getShopperSubscription(getState());
  const {visitorId, sessionId} = getSessionContext(getState()).recommendationsTracking || {};

  /**
   * Navigates to the review order page
   */
  const goToReviewOrderPage = () => {
    const pageAddress = continueToPageAddress.split('/');
    const pageName = pageAddress.length > 1 ? pageAddress[1] : pageAddress[0];
    goToPage(pageName);
  };

  /**
   * Invokes apply payment action on the passed in payments payload.
   * @param paymentsToApply Array The payments to be applied
   */
  let paymentGroups1;
  const applyPayments = paymentsToApply => {
    if (paymentsToApply.length > 0) {
      action('applyPayments', {items: paymentsToApply}).then(response => {
        if (response.ok) {
          const order = getCurrentOrder(getState());
          // If entered payment details is complete, navigate to the review order page
          if (isPaymentDetailsComplete(order)) {
            // goToReviewOrderPage();
            paymentGroups1 = order.paymentGroups;
            //update the order
            handlePlaceOrder();
          }
          // setInProgress(false);
        } else {
          action('notify', {level: ERROR, message: response.error.message});
          setInProgress(false);
        }
      });
    } else if (isPaymentDetailsComplete(props)) {
      // goToReviewOrderPage();
      handlePlaceOrder();
    }
  };

  /**
   * This method removes applied payment groups from order which are not applicable
   * @param payments {Array} The payments(from payment context) to be processed
   */
  const removeNotApplicablePaymentGroups = async payments => {
    let isError = false;
    if (payments.some(payment => payment.type === PAYMENT_TYPE_PAY_IN_STORE)) {
      //delete all payments as we are about to add in store payment and there is already non in store payment applied
      if (Object.values(paymentGroups).some(pGroup => pGroup.paymentMethod !== PAYMENT_TYPE_PAY_IN_STORE)) {
        const response = await deleteAppliedPaymentsByTypes(store);
        if (!response.ok) {
          action('notify', {level: ERROR, message: response.error.message});
          isError = true;
        }
      }
    } else {
      //get payment group ids to be deleted
      const paymentGroupsToRemoved = Object.values(paymentGroups)
        .filter(
          pGroup =>
            pGroup.paymentState === PAYMENT_STATE_INITIAL &&
            !compatiblePaymentTypes.includes(pGroup.paymentMethod) &&
            !payments.some(payment => payment.paymentGroupId === pGroup.paymentGroupId)
        )
        .map(pGroup => pGroup.paymentGroupId);

      if (paymentGroupsToRemoved.length) {
        const response = await deleteAppliedPaymentsByIds(action, paymentGroupsToRemoved);
        if (!response.ok) {
          action('notify', {level: ERROR, message: response.error.message});
          isError = true;
        }
      }
    }

    return isError;
  };

  /**
   * Processes the payments in the context
   * Updates the payment group if the payment in the context has an paymentGroupId
   * or calls the apply payments to apply the payment in the context.
   * @param payments Array The payments to be processed
   */
  const processPayments = async payments => {
    const paymentsToApply = [];
    let isError = false;
    isError = await removeNotApplicablePaymentGroups(payments);
    if (isError) {
      setInProgress(false);

      return;
    }
    for (const payment of payments) {
      const {paymentGroupId, ...paymentDetails} = payment;
      const existingPaymentGroup = paymentGroups[paymentGroupId];

      if (paymentGroupId && existingPaymentGroup) {
        // Remove existing applied credit card payment group and reapply if
        // a different saved card has been selected, or
        // selection has been changed from saved card to a newly entered card(not saved) or
        // selection has been changed from newly entered card(not saved) to a saved card
        if (
          (payment.savedCardId &&
            existingPaymentGroup.savedCardId &&
            payment.savedCardId !== existingPaymentGroup.savedCardId) ||
          (!existingPaymentGroup.savedCardId && payment.savedCardId) ||
          (existingPaymentGroup.savedCardId && !payment.savedCardId)
        ) {
          const response = await action('deleteAppliedPayment', {
            paymentGroupId
          });
          if (response.ok) {
            paymentsToApply.push(paymentDetails);
          } else {
            action('notify', {level: ERROR, message: response.error.message});
            isError = true;
            setInProgress(false);
            break;
          }
        } else {
          // If there is a payment group with saved card id , only the cvv can be updated
          // Type and seqNum properties are not required for updating an existing payment group
          const {savedCardId, type, seqNum, ...paymentDetailsToUpdate} = paymentDetails;
          // If there is addressType property in billingAddress it can't be patched.
          if (paymentDetailsToUpdate.billingAddress) {
            const {
              billingAddress: {addressType, ...billingAddressDetails}
            } = paymentDetailsToUpdate;
            paymentDetailsToUpdate.billingAddress = billingAddressDetails;
          }
          if (!isEmptyObject(paymentDetailsToUpdate)) {
            const paymentGroupToUpdate = {
              paymentGroupId,
              ...paymentDetailsToUpdate
            };
            const updateAppliedPaymentResponse = await action('updateAppliedPayment', paymentGroupToUpdate);
            if (!updateAppliedPaymentResponse.ok) {
              action('notify', {
                level: ERROR,
                message: updateAppliedPaymentResponse.error.message
              });
              isError = true;
              setInProgress(false);
              break;
            }
          }
        }
      } else {
        paymentsToApply.push(paymentDetails);
      }
    }
    if (!isError) {
      applyPayments(paymentsToApply);
    }
  };

  const [ipAddress, setIpAddress] = useState(null);
  const [numberOfOrders, setNumberOfOrders] = useState(0);

  const getIPAddress = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch('https://api.ipify.org?format=json', requestOptions)
      .then(response => response.text())
      .then(result => {
        setIpAddress(JSON.parse(result).ip);
      })
      .catch(error => console.log('error', error));
  };
  useEffect(() => {
    getIPAddress();
  }, []);

  const getNumberOfOrders = () => {
    action('numberOfOrders', {store}).then(response => {
      if (response.ok) {
        console.log('numberOfOrders-->response--> ', response);
        if (response.ok) {
          setNumberOfOrders(response.delta.myRepository.myTable.myProperty.numberOfOrders);
          LocalStorageService.setItem('numberOfOrders', response.delta.myRepository.myTable.myProperty.numberOfOrders);
        }
      } else {
        setNumberOfOrders(0);
        LocalStorageService.setItem('numberOfOrders', 0);
      }
    });
  };
  const getCart = () => {
    action('getCart', {store}).then(response => {
      if (response.ok) {
        console.log('get order-->response--> ', response);

        if (response.ok) {
          const billigAddr = LocalStorageService.getItem('billingAddress');
          const sameShipBill = LocalStorageService.getItem('sameAsShipping');
          let address = {};
          if (billigAddr !== null && !sameShipBill && !isEmptyObject(billigAddr)) {
            address = billigAddr;
          } else {
            const oid = Object.keys(response.delta.orderRepository.orders);
            for (const key of Object.keys(response.delta.orderRepository.orders[oid[0]].shippingGroups)) {
              const shippingGroup = response.delta.orderRepository.orders[oid[0]].shippingGroups[key] || {};
              address = shippingGroup.shippingAddress;
            }
          }
          console.log('get orderssss ', response.delta.clientRepository.context.session.order);

          action('updateCart', {
            id: response.delta.clientRepository.context.session.order,
            op: 'update',
            x_billingAddress: JSON.stringify(address)
          }).then(orderresponse => {
            console.log('orderresponse response ==> ', orderresponse);
          });
        }
      } else {
        // setNumberOfOrders(0);
      }
    });
  };

  useEffect(() => {
    getNumberOfOrders();
    getCart();
  }, []);

  const currentProfile = getProfile(getState());
  console.log('currentProfile-->', currentProfile);

  const signifydCheckout = updatedPayments => {
    console.log('updatedPayments---> ', updatedPayments);
    const order = getCurrentOrder(getState());
    const currentProfile = getProfile(getState());
    console.log('currentProfile-->', currentProfile);
    console.log('getOrders-->', getProfileRepository(getState()));
    const payload = {};
    payload.order = order;
    payload.payment = updatedPayments;
    payload.profile = currentProfile;
    payload.device = {
      sessionId
    };
    if (ipAddress !== null) {
      payload.device.clientIpAddress = ipAddress;
    }

    console.log('PAYLOAD-->', JSON.stringify(payload));

    action('signifydCheckout', payload).then(response => {
      if (response.ok) {
        console.log('signifydCheckout-->response--> ', response);
        if (response.delta?.myRepository?.myTable?.myProperty?.decision?.checkpointAction === 'ACCEPT') {
          updatedPayments[0].customProperties.checkoutId = response.delta.myRepository.myTable.myProperty.checkoutId;
          processPayments(updatedPayments);
        }
      } else {
        console.log('signifydCheckout-->error--> ', response);
        action('notify', {
          level: 'error',
          message: 'Please try again in some time, we have some issue'
        });
        //error UI part
      }
    });
  };

  /**
   * Handler for continue to review order button
   */
  const onContinueToReviewOrder = async () => {
    action('notifyClearAll');
    setInProgress(true);
    if (payments.length > 0) {
      if (payments[0].callbackPromise) {
        const {callbackPromise, ...payload} = payments[0];
        const callbackResponse = await callbackPromise();
        const payment = {
          ...payload,
          customProperties: {
            ...payload.customProperties,
            ...callbackResponse,
            billingFrequency
          }
        };
        addOrUpdatePaymentToContext(payment);
        console.log('PAYMENT', payment);
        setTimeout(() => {
          console.log(payments);
          processPayments([payment]);
        });

        return;
      }
      const updatedPayments = payments.map(payment => {
        const billigAddr = LocalStorageService.getItem('billingAddress');
        const sameShipBill = LocalStorageService.getItem('sameAsShipping');
        let flag = false;
        if (billigAddr !== null && !sameShipBill) {
          flag = true;
        }
        if (payment.cardNumber) {
          payment.customProperties = {number: payment.cardNumber};
          payment.number = payment.cardNumber;
        }
        if (payment.type === 'card') {
          setSelectedPaymentInfo({paymentType: payment.cardType});
        }
        if (payment.billingAddress !== undefined) {
          payment.billingAddress.midName = 'test';
        }
        if (payment.billingAddress === undefined && flag) {
          // const {firstName, lastName, country, postalCode, state, address1, city, phoneNumber, companyName} = billigAddr;
          payment.billingAddress = billigAddr;
        }
        // if (payment.customProperties) {
        //   return {...payment, customProperties: {...payment.customProperties, billingFrequency}};
        // }
        // if (numberOfOrders >= 0) {
        //   return {...payment, customProperties: {...payment.customProperties, numberOfOrders}};
        // }

        if (payment.customProperties) {
          payment.customProperties = {
            ...payment.customProperties,
            billingFrequency
          };
        }
        if (numberOfOrders === 0) {
          if (payment.customProperties) {
            payment.customProperties = {
              ...payment.customProperties,
              numberOfOrders
            };
          } else {
            payment.customProperties = {numberOfOrders};
          }
          payment.numberOfOrders = numberOfOrders;
        }

        return payment;
      });
      if (numberOfOrders === 0) {
        signifydCheckout(updatedPayments);
      } else {
        processPayments(updatedPayments);
      }
    } else if (isPaymentDetailsComplete(props) || selectedPaymentType === PAYMENT_TYPE_PAY_LATER) {
      // goToReviewOrderPage();
      placeOrder();
    }
  };

  const [checked, setChecked] = useState(false);

  /**
   * Returns true if Continue to review order button should be disabled
   * Disable continue to review order button, when
   * Continue to review order is in progress,
   * There are no payments in the payment context when
   * the order is not a zero value order
   * or there are no existing payment groups or there is a default payment group or appliedPaymentGroup
   */
  const isContinueToReviewOrderButtonDisabled = () => {
    return (
      inProgress ||
      !checked ||
      (!isZeroValueOrder(props) &&
        (Object.keys(paymentGroups).length === 0 || getAmountRemainingPaymentGroup(props)) &&
        selectedPaymentType !== PAYMENT_TYPE_PAY_LATER &&
        payments.length === 0)
    );
  };
  // place order
  const {authenticated, currentOrderId, isCurrentOrderScheduled = false, scheduleInfo} = getComponentData(getState());
  console.log('viru-->', authenticated, currentOrderId, isCurrentOrderScheduled, scheduleInfo);

  //locales
  const {
    buttonPlaceOrder,
    buttonPlacingOrder,
    alertOrderNotPlacedPaymentDeclined,
    alertTechnicalProblemContactUs,
    buttonScheduledOrder,
    buttonSchedulingOrder
  } = props;
  //context
  // const { shippingGroups = {}} = useContext(OrderContext);// paymentGroups = {},
  // const { setPlaceOrderInitiated = noop} = useContext(ContainerContext); //guestEmailDetails = {},
  // const {action} = useContext(StoreContext);

  //selector data
  const submitButtonName = isCurrentOrderScheduled ? buttonScheduledOrder : buttonPlaceOrder;
  const processButtonName = isCurrentOrderScheduled ? buttonSchedulingOrder : buttonPlacingOrder;
  // const [inProgress, setInProgress] = useState(false);  //handle this on think properly
  // const goToPage = useNavigator();

  /**
   * Method to invoke when current order is converted(placed) as scheduled order
   */
  const placeScheduledOrder = () => {
    const schedulePayload = {
      ...scheduleInfo,
      startDate: formatDate(scheduleInfo.startDate),
      endDate: formatDate(scheduleInfo.endDate)
    };
    const {daysInMonth, ...sceduleInfoFinal} = schedulePayload.schedule;
    if (daysInMonth && daysInMonth.length === 0) {
      schedulePayload.schedule = sceduleInfoFinal;
    }
    action('convertCartToScheduledOrder', schedulePayload).then(response => {
      setInProgress(false);
      // setPlaceOrderInitiated(false);
      if (response.ok === true) {
        const payload = {
          scheduledOrders: {
            [currentOrderId]: null
          }
        };
        try {
          action('saveComponentData', {...payload});
        } catch (error) {
          console.error(error);
        }
        const messages = {
          alertOrderNotPlacedPaymentDeclined,
          alertTechnicalProblemContactUs
        };
        handleOrderSubmitSuccess(goToPage, response, action, messages);
      } else {
        handleOrderSubmitFailure(action, goToPage, response);
      }
    });
  };

  //   useEffect(() => {
  //   console.log('bill', LocalStorageService.getItem('billingAddress'));
  //   const billigAddr = LocalStorageService.getItem('billingAddress');
  //   const sameShipBill = LocalStorageService.getItem('sameAsShipping');
  //   if (billigAddr !== null && !sameShipBill) {
  //     const {firstName, lastName, country, postalCode, state, address1, city, phoneNumber, companyName} = billigAddr;
  //     updateBillingAddress({
  //       firstName,
  //       lastName,
  //       country,
  //       postalCode,
  //       state,
  //       address1,
  //       city,
  //       phoneNumber,
  //       companyName
  //     });
  //   }
  // }, []);
  /**
   * Method to invoke the place order action
   */
  const placeOrder = () => {
    const appliedPaymentGroups = [];
    // rever upto this

    for (const index of Object.keys(paymentGroups1)) {
      const paymentGroup = paymentGroups1[index];
      //Exclude zero value payment groups or
      //Zero value with only one payment group
      if (paymentGroup.amount !== 0 || (paymentGroup.amount === 0 && Object.keys(paymentGroups1).length === 1)) {
        const {paymentGroupId, paymentMethod} = paymentGroup;
        if (paymentMethod === PAYMENT_METHOD_CREDIT_CARD || paymentMethod === PAYMENT_METHOD_TOKENIZED_CREDIT_CARD) {
          appliedPaymentGroups.push({
            type: PAYMENT_TYPE_CARD,
            paymentGroupId
          });
        } else if (paymentMethod === PAYMENT_METHOD_INVOICE_REQUEST) {
          appliedPaymentGroups.push({
            type: PAYMENT_TYPE_INVOICE,
            paymentGroupId
          });
        } else if (paymentMethod === PAYMENT_METHOD_ONLINE_PAYMENT_GROUP) {
          appliedPaymentGroups.push({
            type: paymentGroup.type,
            paymentGroupId
          });
        } else {
          appliedPaymentGroups.push({
            type: paymentMethod,
            paymentGroupId
          });
        }
      }
    }
    const payload = {
      payments: appliedPaymentGroups
    };

    
    action('checkoutCart', payload).then(response => {
      //Enable Place Order Button
      setInProgress(false);
      // setPlaceOrderInitiated(false);
      if (response.ok === true) {
        const messages = {
          alertOrderNotPlacedPaymentDeclined,
          alertTechnicalProblemContactUs
        };
        handleOrderSubmitSuccess(goToPage, response, action, messages);
      } else {
        handleOrderSubmitFailure(action, goToPage, response);
      }
    });
  };
  //To invoke specific order method if scheduled order is enabled
  const selectedPlaceOrderMethod = () => {
    if (!isCurrentOrderScheduled) placeOrder();
    else placeScheduledOrder();
  };

  /**
   * Method to update email address and invoke place order
   * This will be called only for anonymous flow
   */
  const updateEmailAddressAndPlaceOrder = () => {
    const shippingGroupsPayload = [];

    // for (const index of Object.keys(shippingGroups)) {
    //   const shippingGroup = shippingGroups[index] || {};
    //   const {shippingGroupId = ''} = shippingGroup;
    //   const shippingAddress = {
    //     email: guestEmailDetails.emailAddress
    //   };
    //   shippingGroupsPayload.push({shippingAddress, shippingGroupId});
    // }

    const payload = {
      items: shippingGroupsPayload
    };

    action('updateCartShippingGroups', payload).then(response => {
      if (response.ok) {
        //Invoke Place order method
        selectedPlaceOrderMethod();
      } else {
        action('notify', {level: 'error', message: response.error.message});
      }
    });
  };

  /**
   * Method to handle place order.
   * Based on the user logged in status decides which method to be invoked.
   */
  const handlePlaceOrder = () => {
    setInProgress(true);
    // setPlaceOrderInitiated(true);
    if (!authenticated) {
      updateEmailAddressAndPlaceOrder();
    } else {
      selectedPlaceOrderMethod();
    }
  };

  // end Place order

  const handleChange = () => {
    setChecked(!checked);
  };

  // const handleButtonClick = () => {
  //   if (currentPageType === PAGE_CHECKOUT_PAYMENT_LINK) {
  //     goToPage(PAGE_CHECKOUT_SHIPPING_LINK);
  //   } else if (currentPageType === PAGE_CHECKOUT_REVIEW_ORDER_LINK) {
  //     goToPage(PAGE_CHECKOUT_PAYMENT_LINK);
  //   } else if (currentPageType === PAGE_CHECKOUT_PAYMENT_AND_REVIEW_ORDER_LINK) {
  //     goToPage(`${PAGE_CHECKOUT_QUOTE_SHIPPING_LINK}/${orderId}`);
  //   }
  // };

  return (
    <Styled id="ContinueToReviewOrderButton" css={css}>
      <div className="ContinueToReviewOrderButton">
        <div className="checkbox">
          <input name="check" id="payment-check" className='form-check' type="checkbox" checked={checked} onChange={handleChange} />
          <label htmlFor="payment-check" className='form-label'>
            I understand and agree to terms stated above, this website’s terms and conditions, return policy and privacy
            policy, agree that my payment information be reserved for future shipments and I agree to receive
            communications from you as per the policies.
          </label>
        </div>
        <div className="ContinueToReviewOrderButton__Btn action-btn-cnr">
          <button
                  type="button"
                  className="btn btn-custom secondary-btn"
                  onClick={() => goToPage('checkout-shipping')}
                >
                  {'Back to Previous'}
                </button><button
            type="button"
            className="btn btn-custom primary-btn"
            disabled={isContinueToReviewOrderButtonDisabled()}
            onClick={onContinueToReviewOrder}
          >
            {'Place Order'}
          </button>
        </div>
      </div>
    </Styled>
  );
};

ContinueToReviewOrderButton.propTypes = {
  /**
   * The page address to redirect to on continue to review order click.
   */
  continueToPageAddress: PropTypes.string.isRequired,
  /**
   * The payment groups in the order
   */
  paymentGroups: PropTypes.objectOf(
    PropTypes.shape({
      /**
       * The payment group id
       */
      paymentGroupId: PropTypes.string.isRequired
    })
  )
};

ContinueToReviewOrderButton.defaultProps = {
  paymentGroups: {}
};

export default connect(getCurrentOrder)(ContinueToReviewOrderButton);
