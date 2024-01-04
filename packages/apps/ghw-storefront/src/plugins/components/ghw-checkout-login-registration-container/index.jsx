import {CartContext, ScheduledOrderContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import CartPlaceholder from '@oracle-cx-commerce/react-widgets/cart/cart-container/components/cart-placeholder';
import CartValidation from '@oracle-cx-commerce/react-widgets/cart/cart-container/components/cart-validations';
import PageLoader from '@oracle-cx-commerce/react-components/page-loader';
import Region from '@oracle-cx-commerce/react-components/region';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import PropTypes from 'prop-types';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import css from './ghw-checkout-login-registration-container.css';
import {getComponentData} from './selectors';
import {CheckoutShippingContext} from './context';

/**
 * Container to hold all the widgets for the Checkout Shipping Page
 * @param {Object} props The properties object
 * @memberof Components
 * @class GHWCheckoutLoginRegistrationContainer
 * @category Component-list
 * @param {Array} [regions = []] - Set of regions defined in GHWCheckoutLoginRegistrationContainer layout.
 * @param {String} [className = ''] - CSS class to override the default widget styling.
 * @param {String} headingShipping -  Locale for shipping heading
 * @param {Boolean} isB2BUser -  Boolean flag to indicate if the user is a B2B user
 * @param {Boolean} isGetCartInProgress -  Flag indicating if get cart is in progress
 * @param {String} orderId -  Order id
 * @param {Boolean} isCurrentOrder -  Boolean indicating if order is current order
 * @param {Object} currentOrder -  Current order details
 * @author Oracle
 * @since 2.10.0
 * @param props
 */
const GHWCheckoutLoginRegistrationContainer = props => {
  // container layout
  const {regions = [], className = ''} = props;

  // resources
  const {headingShipping} = props;

  const {isB2BUser, isGetCartInProgress, orderId, isCurrentOrder, currentOrder} = props;
  const store = useContext(StoreContext);
  const {action} = store;

  // Delivery address form data when there is no saved address / profile address available.
  const [deliveryAddressForm, setDeliveryAddressForm] = useState({
    address: {},
    saveAsANewProfileAddress: !isB2BUser,
    saveAsANewAccountAddress: false,
    isModified: false
  });

  // Shipping status to manage the tabs under the shipping page.
  const [shippingStatus, setShippingStatus] = useState({
    tabIndex: 0,
    showConinueToPayment: false,
    enableContinue: false,
    loadShippingMethods: false
  });

  // Cart context state to maintain the status of the cart.
  const [cartStatus, setCartStatus] = useState({
    isCartInValid: false,
    hasOutOfStockItems: false,
    hasInactiveItems: false
  });

  // Check Shipping Tab Index Values
  const [checkoutShippingTabs, setCheckoutShippingTabs] = useState({});

  // scheduleInfo to manage the schedule order under the shipping page.
  // scheduleInfo to manage the schedule order under the shipping page.
  const [createSchedulePayload, setCreateSchedulePayload] = useState({isScheduleCurrentOrder: false});
  // Scheduled info status to manage the continue payment button.
  const [scheduledInfoStatus, setScheduledInfoStatus] = useState({
    enableScheduleContinue: false
  });

  /**
   * Failure call back for the getOrder action
   */
  const onNotOk = useCallback(
    ({error: {message = ''} = {}} = {}) => {
      action('notify', {level: 'error', message});
    },
    [action]
  );

  /**
   * Get the order details for the specific order id
   */
  useEffect(() => {
    if (orderId && !isCurrentOrder && isEmptyObject(currentOrder)) {
      action('getOrder', {orderId})
        .then(response => {
          if (response.ok === false) {
            onNotOk(response);
          }
        })
        .catch(error => {
          onNotOk({error});
        });
    }
  }, [action, isCurrentOrder, onNotOk, orderId]);

  return (
    <Styled id="GHWCheckoutLoginRegistrationContainer" css={css}>
      <div className="GHWCheckoutLoginRegistrationContainer container-fixed">
       
        <CheckoutShippingContext.Provider
          value={{
            shippingStatus,
            setShippingStatus,
            deliveryAddressForm,
            setDeliveryAddressForm,
            checkoutShippingTabs,
            setCheckoutShippingTabs
          }}
        >
          <CartContext.Provider value={{cartStatus, setCartStatus}}>
            <CartValidation {...props} />
            <PageLoader show={isGetCartInProgress === 1}>
              <CartPlaceholder />
            </PageLoader>
            <ScheduledOrderContext.Provider
              value={{createSchedulePayload, setCreateSchedulePayload, scheduledInfoStatus, setScheduledInfoStatus}}
            >
              <section
                className={`checkout-lyt-cnr  CheckoutShippingContainer__Section ${className}`.trim()}
                style={{visibility: isGetCartInProgress !== 1 ? 'visible' : 'hidden'}}
              >
                {regions.map((regionId, index) => (
                  /*
               Using region ids as keys causes unnecessary DOM reconciliation.
                 
               https://reactjs.org/docs/reconciliation.html#keys
             */
                  <Region key={index} regionId={regionId} /> // eslint-disable-line react/no-array-index-key
                ))}
              </section>
            </ScheduledOrderContext.Provider>
          </CartContext.Provider>
        </CheckoutShippingContext.Provider>
      </div>
    </Styled>
  );
};

GHWCheckoutLoginRegistrationContainer.propTypes = {
  isGetCartInProgress: PropTypes.number.isRequired,
  isB2BUser: PropTypes.bool.isRequired,
  regions: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default connect(getComponentData)(GHWCheckoutLoginRegistrationContainer);
