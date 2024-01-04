import React, {useContext, useEffect, useState, useRef} from 'react';
import {StoreContext, PaymentsContext} from '@oracle-cx-commerce/react-ui/contexts';
import {connect, useSelector} from '@oracle-cx-commerce/react-components/provider';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {
  PAYMENT_TYPE_GENERIC,
  PAYMENT_STATE_INITIAL,
  PAGE_PRODUCT_LINK
} from '@oracle-cx-commerce/commerce-utils/constants';
import {deleteAppliedPaymentsByIds} from '@oracle-cx-commerce/react-components/utils/payment';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import SpinnerContent from '@oracle-cx-commerce/react-components/page-loader/spinner-content';
import {
  getPage,
  getCurrentOrder,
  isAuthenticated,
  getCurrentProfileId,
  getCurrencyCode
} from '@oracle-cx-commerce/commerce-utils/selector';
import Checkbox from '@oracle-cx-commerce/react-components/checkbox';
import orderRepoReader from '../helpers/order-repo-reader';
import paymentSettingsReader from '../helpers/payment-settings-reader';
import {PaymentMethodsContext} from '../payment-methods-container';
import css from './styles.css';

import {updateShippingAddress} from './utils';

import {Braintree} from '../helpers/braintree-loader';
import {useInitializeWidget} from '../../../fetchers/hooks';
import {getWidgetInfo} from '../../../selectors';
import {setSelectedPaymentInfo} from '../helpers/payment-info-data';
import PaymentSavedPaymentMethods from './components/papal-saved-payments';

const amountFormat = n => (n || 0).toFixed(2);

export const DEFAULT_PAYPAL_ID = 'paypal-button';

const hasShippingAddress = shippingAddress => !!Object.values(shippingAddress).filter(Boolean).length;

const handleCreateOrder = (paypalCheckoutInstance, paymentAmount, shippingAddress, settings) => {
  console.log('############## settings: ', settings);
  const {amount, currencyCode: currency} = paymentAmount;
  const {firstName, lastName, address1, address2, city, country, postalCode, state, phoneNumber} = shippingAddress;
  const {displayName, enableShippingAddress, intent, flow, offerCredit} = settings;
  const includeShippingAddress = hasShippingAddress(shippingAddress);

  const shippingRequest = includeShippingAddress
    ? {
        shippingAddressEditable: false,
        shippingAddressOverride: {
          recipientName: `${firstName} ${lastName}`,
          line1: address1,
          line2: address2 || '',
          city,
          countryCode: country,
          postalCode,
          state,
          phone: phoneNumber
        }
      }
    : undefined;

  return paypalCheckoutInstance.createPayment({
    flow, // Required
    offerCredit,
    amount, // Required
    currency, // Required, must match the currency passed in with loadPayPalSDK
    intent, // Must match the intent passed in with loadPayPalSDK
    displayName,
    enableShippingAddress,
    ...shippingRequest
  });
};

const renderPayPalWidget = ({
  paypalCheckoutInstance,
  getPaymentAmount,
  shippingAddress,
  setShowPayLaterMessage,
  settings,
  onCreateOrder,
  setShowSpinner,
  paypalButtonId,
  selectedFundingSource
}) =>
  new Promise(async (resolve, reject) => {
    const {flow, offerCredit, offerPayLater} = settings;
    const createButton = id =>
      window.paypal
        .Buttons({
          createBillingAgreement:
            flow === 'vault'
              ? () => {
                  onCreateOrder(true);

                  return handleCreateOrder(paypalCheckoutInstance, getPaymentAmount(), shippingAddress, settings);
                }
              : undefined,
          createOrder:
            flow === 'checkout'
              ? () => {
                  onCreateOrder(true);

                  return handleCreateOrder(paypalCheckoutInstance, getPaymentAmount(), shippingAddress, settings);
                }
              : undefined,
          onApprove: (data, _actions) => {
            paypalCheckoutInstance
              .tokenizePayment(data)
              .then(payload => {
                resolve(payload);
              })
              .catch(err => {
                reject(err);
              });
          },

          onCancel: data => {
            onCreateOrder(false);
            console.log('PayPal payment cancelled', JSON.stringify(data, 0, 2));
          },

          onError: err => {
            onCreateOrder(false);
            console.error('PayPal error', err);
          },

          onClick: eventData => {
            const {fundingSource} = eventData;
            selectedFundingSource.current = fundingSource;
          }
        })
        .render(`#${id}`);

    // Fix issue with multiple paypal buttons in a page
    // https://www.paypal-community.com/t5/Products-Services/Multiple-Smart-Buttons-code-in-one-Page/td-p/2236890/page/2
    const paypalButtonIds = [...document.querySelectorAll('#paypal-button-widget-container')].map(
      container => container.querySelector('[id*="paypal-button"]').id
    );
    await Promise.all([...paypalButtonIds.map(id => createButton(id))]);

    setShowSpinner(false);
    console.log('#### PayPal button loaded ####');

    // if (offerCredit) {
    //   const payCreditWidget = window.paypal.Buttons({
    //     fundingSource: window.paypal.FUNDING.CREDIT,
    //     createBillingAgreement:
    //       flow === 'vault'
    //         ? () => {
    //             return handleCreateOrder(paypalCheckoutInstance, getPaymentAmount(), shippingAddress, settings);
    //           }
    //         : undefined,
    //     createOrder:
    //       flow === 'checkout'
    //         ? () => {
    //             return handleCreateOrder(paypalCheckoutInstance, getPaymentAmount(), shippingAddress, settings);
    //           }
    //         : undefined,
    //     onApprove: data => {
    //       paypalCheckoutInstance
    //         .tokenizePayment(data)
    //         .then(payload => {
    //           resolve(payload);
    //         })
    //         .catch(err => reject(err));
    //     }
    //   });
    //   if (payCreditWidget.isEligible()) {
    //     payCreditWidget.render('#paypal-credit-button');
    //   }
    // }
    // if (offerPayLater) {
    //   const payLaterWidget = window.paypal.Buttons({
    //     fundingSource: window.paypal.FUNDING.PAYLATER,
    //     createOrder: () => {
    //       return handleCreateOrder(paypalCheckoutInstance, getPaymentAmount(), shippingAddress, settings);
    //     },
    //     onApprove: data => {
    //       paypalCheckoutInstance
    //         .tokenizePayment(data)
    //         .then(payload => {
    //           resolve(payload);
    //         })
    //         .catch(err => {
    //           reject(err);
    //         });
    //     }
    //   });
    //   if (payLaterWidget.isEligible()) {
    //     // payLaterWidget.render('#paypal-pay-later-button');
    //     setShowPayLaterMessage(true);
    //   }
    // }
  });

const setupPayPalWidget = async props => {
  const {
    clientToken,
    getPaymentAmount,
    shippingAddress,
    setShowSpinner,
    setShowPayLaterMessage,
    settings,
    standalone,
    onCreateOrder,
    paypalButtonId,
    selectedFundingSource
  } = props;

  const braintree = await Braintree({isPayPalStandalone: standalone});
  const clientInstance = await braintree.client.create({
    authorization: clientToken
  });
  const paypalCheckoutInstance = await braintree.paypalCheckout.create({
    client: clientInstance
  });
  const {currencyCode: currency, amount} = getPaymentAmount();
  const {commit, intent, vault, offerPayLater, enableFunding} = settings;
  const extractFundingSources = fundlingList => {
    const list = fundlingList.split(',');
    const enable = ['venmo', 'paylater'].filter(i => list.includes(i)).join(',');
    const disable = ['card', 'credit', 'bancontact'].filter(i => !list.includes(i)).join(',');

    return {enable, disable};
  };
  const fundingSources = extractFundingSources(enableFunding);
  let sdkAttrs = {
    currency,
    intent,
    commit,
    vault,
    'enable-funding': fundingSources.enable,
    'disable-funding': fundingSources.disable
  };
  if (offerPayLater) {
    sdkAttrs = {
      ...sdkAttrs,
      components: 'buttons,messages',
      dataAttributes: {amount: amountFormat(amount)}
    };
  }
  await paypalCheckoutInstance.loadPayPalSDK(sdkAttrs);
  const payload = await renderPayPalWidget({
    paypalCheckoutInstance,
    getPaymentAmount,
    shippingAddress,
    setShowPayLaterMessage,
    settings,
    onCreateOrder,
    setShowSpinner,
    paypalButtonId,
    selectedFundingSource
  });
  setShowSpinner(false);

  return payload;
};

const PayPalPaymentButton = props => {
  // Designer config
  const {
    id,
    enableFunding = 'credit,paylater,venmo',
    messagingLayout = 'text',
    messagingLogoType = 'primary',
    messagingLogoPosition = 'left',
    messagingTextColor = 'black',
    messagingTextSize = '12',
    messagingTextAlign = 'left',
    messagingColor = 'blue',
    messagingRatio = '1x1',
    messagingPlacement = 'payment',
    subscriptionBillingFrequency
  } = props;
  const {savePaymentMethodLabel = 'Save this payment method?'} = props;
  const [loading, setLoading] = useState(false);
  const [removePaypalButton, setRemovePaypalButton] = useState(false);
  const selectedFundingSource = useRef('paypal');
  const {addOrUpdatePaymentToContext, setSelectedPaymentType} = useContext(PaymentsContext) || {};
  const paymentMethodsContext = useContext(PaymentMethodsContext);
  const {
    clientToken,
    continueToPageAddress = '/checkout-review-order',
    onPaymentSuccess,
    onCreateOrder = () => {},
    paymentAmount: paymentProp
  } = props;
  const isPaymentSuccess = useRef(false);
  const store = useContext(StoreContext);
  const state = store.getState();
  const currentPage = getPage(state);
  const {numberOfItems} = useSelector(getCurrentOrder);
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);
  const shippingAddress = orderRepoReader.getShippingAddress(state) || {};
  let settings = {...paymentSettingsReader.getPaymentWidgetSettings(state)};
  if (id !== 'mini-cart-paypal-button' || !settings.enableFunding) {
    settings = {...settings, enableFunding};
  }
  const [showPayLaterMessage, setShowPayLaterMessage] = useState(settings.offerPayLater);
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  const isPaypalStandalone = !paymentMethodsContext;
  const {addMethod, setAddMethod} = paymentMethodsContext;
  useInitializeWidget(store);

  const goToPage = useNavigator();

  const goToReviewOrderPage = () => {
    if (!continueToPageAddress) {
      return;
    }
    const pageAddress = continueToPageAddress.split('/');
    const pageName = pageAddress.length > 1 ? pageAddress[1] : pageAddress[0];
    goToPage(pageName);
  };

  const getPaymentAmount = () => {
    const {priceInfo = {}} = getCurrentOrder(store.getState());
    // const currencyCode = useSelector(getCurrencyCode) || ''
    const currencyCode = 'USD';

    return paymentProp || {amount: priceInfo.total, currencyCode};
  };

  useEffect(() => {
    if (currentPage.pageType === PAGE_PRODUCT_LINK) {
      if (id === 'mini-cart-paypal-button') {
        return;
      }
      if (numberOfItems) {
        setRemovePaypalButton(true);
      }

      return;
    }
    // If there's no order in cart page, remove paypal button
    if (!numberOfItems) {
      setRemovePaypalButton(true);
    }
  }, [numberOfItems, currentPage.type]);
  const paypalButtonId = `paypal-button-${id}`;
  useEffect(() => {
    if (!clientToken) {
      return;
    }
    if (savePaymentMethod || !!subscriptionBillingFrequency) {
      settings = {...settings, flow: 'vault', vault: true};
    } else {
      settings = {...settings, flow: 'checkout', vault: false};
    }
    setLoading(true);
    setupPayPalWidget({
      ...props,
      getPaymentAmount,
      shippingAddress,
      setShowSpinner: setLoading,
      setShowPayLaterMessage,
      settings,
      standalone: isPaypalStandalone,
      onCreateOrder,
      paypalButtonId,
      selectedFundingSource
    }).then(async payload => {
      isPaymentSuccess.current = true;
      const paymentToApply = {
        customProperties: {
          nonce: payload.nonce,
          savePayment: savePaymentMethod,
          billingFrequency: subscriptionBillingFrequency
        },
        type: PAYMENT_TYPE_GENERIC
      };
      if (isPaypalStandalone) {
        if (onPaymentSuccess) {
          // Add item to cart first before anything else
          const shouldContinue = await onPaymentSuccess();
          if (!shouldContinue) {
            return;
          }
        }

        if (!hasShippingAddress(shippingAddress)) {
          await updateShippingAddress(store, payload);
        }

        const paymentGroups = orderRepoReader.getPaymentGroups(store.getState());
        store.action('notifyClearAll');

        //get payment group ids to be deleted
        if (paymentGroups) {
          const paymentGroupsToRemoved = Object.values(paymentGroups)
            .filter(pGroup => pGroup.paymentState === PAYMENT_STATE_INITIAL)
            .map(pGroup => pGroup.paymentGroupId);

          if (paymentGroupsToRemoved.length) {
            const response = await deleteAppliedPaymentsByIds(store.action, paymentGroupsToRemoved);
            if (!response.ok) {
              store.action('notify', {
                level: 'error',
                message: response.error.message
              });

              return;
            }
          }
        }

        store
          .action('applyPayments', {
            items: [{...paymentToApply, seqNum: 0}]
          })
          .then(response => {
            if (response.ok) {
              // const order = getCurrentOrder(getState());
              // // If entered payment details is complete, navigate to the review order page
              // if (isPaymentDetailsComplete(order)) {
              setSelectedPaymentInfo({
                paymentType: selectedFundingSource.current
              });
              goToReviewOrderPage();
              // }
              // setInProgress(false);
            } else {
              store.action('notify', {
                level: 'error',
                message: response.error.message
              });
            }
          });

        return;
      }
      if (settings.enableShippingAddress) {
        await updateShippingAddress(store, payload);
      }

      setSelectedPaymentType(PAYMENT_TYPE_GENERIC);
      addOrUpdatePaymentToContext(paymentToApply);
      setSelectedPaymentInfo({paymentType: selectedFundingSource.current});
    });
  }, [clientToken, savePaymentMethod, id]);

  if (removePaypalButton) {
    return null;
  }
  console.log(`########### PAYPAL BUTTON WIDGET ID: ${paypalButtonId} #############`);

  const displayStyle = {
    display: addMethod ? 'block' : 'none'
  };

  return (
    <Styled id="PayPalPaymentButton" css={css}>
      <div id="paypal-button-widget-container">
        <PaymentSavedPaymentMethods props={props} addMethod={addMethod} setAddMethod={setAddMethod} />
        <div>
          <div
            style={displayStyle}
            className={isPaypalStandalone ? 'PayPalPaymentButton--standalone' : undefined}
            id={paypalButtonId}
          >
            {loading && (
              <div className="PayPalPaymentButton__Spinner">
                <SpinnerContent />
              </div>
            )}
          </div>
          {isUserLoggedIn && addMethod && settings.enabledSavePayment && (
            <div className="PayPalPaymentButton__saveCheckbox">
              <Checkbox
                id={`PayPalPaymentButton-save-payment-option-${id}`}
                name={`PayPalPaymentButton-save-payment-option-${id}`}
                value={true}
                defaultChecked={true}
                labelText={savePaymentMethodLabel}
                disabled={isPaymentSuccess.current}
                onChange={e => {
                  setSavePaymentMethod(e.currentTarget.checked);
                }}
              ></Checkbox>
            </div>
          )}
        </div>
      </div>
      {/* <div id="paypal-credit-button"></div> */}
      {/* <div id="paypal-pay-later-button"></div> */}
      <div
        data-pp-message
        data-pp-amount={amountFormat(getPaymentAmount().amount)}
        data-pp-style-layout={messagingLayout}
        data-pp-style-logo-type={messagingLogoType}
        data-pp-style-logo-position={messagingLogoPosition}
        data-pp-style-text-color={messagingTextColor}
        data-pp-style-text-size={messagingTextSize}
        data-pp-style-text-align={messagingTextAlign}
        data-pp-style-color={messagingColor}
        data-pp-style-ratio={messagingRatio}
        data-pp-placement={messagingPlacement}
      ></div>
    </Styled>
  );
};

export default connect(getWidgetInfo)(PayPalPaymentButton);
