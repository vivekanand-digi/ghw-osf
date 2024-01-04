/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  ORDER_STATE_QUOTED,
  PAGE_CART_LINK,
  PAGE_CHECKOUT_PAYMENT_AND_REVIEW_ORDER_LINK,
  PAGE_CHECKOUT_PAYMENT_LINK,
  PAGE_CHECKOUT_QUOTE_SHIPPING_LINK,
  PAGE_CHECKOUT_REVIEW_ORDER_LINK,
  PAGE_CHECKOUT_SHIPPING_LINK,
  PAGE_CHECKOUT_LOGIN_LINK,
  PAGE_CHECKOUT_ORDER_CONFIRMATION_LINK
} from '@oracle-cx-commerce/commerce-utils/constants';
import React, {useCallback, useEffect, useMemo} from 'react';

import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {isPaymentDetailsComplete} from '@oracle-cx-commerce/react-components/utils/payment';
import {isShippingDetailsComplete} from '@oracle-cx-commerce/react-components/utils/shipping';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import PropTypes from 'prop-types';
import {getComponentData} from './selectors';
import css from './ghw-checkout-progress-tracker.css';

/**
 * Widget that displays the checkout progress
 * @param {props} component props
 * @memberof Components
 * @class GHWCheckoutProgressTracker
 * @category Component-list
 * @param {String} headingCheckout - Locale for checkout heading
 * @param {String} headingPayment - Locale for payment heading
 * @param {String} headingReview - Locale for review heading
 * @param {String} headingShipping - Locale for shipping heading
 * @param {String} headingPaymentReview - Locale for payment review heading
 * @param {String} checkoutShippingAddress - Checkout shipping address
 * @param {String} checkoutPaymentAddress - Checkout payment address
 * @param {String} checkoutReviewAddress - Checkout review address
 * @param {String} checkoutQuoteShippingAddress - Checkout quote shipping address
 * @param {String} checkoutPaymentAndReviewAddress - Checkout payment and review address
 * @param {String} currentOrderId - Current order id
 * @param {Object} currentOrder - Object containing current order details
 * @param {String} currentPageType - Current page type
 * @param {Boolean} isB2BUser - Boolean indicating if the user is a B2B user
 * @param {Boolean} isPlaceOrderInProgress - Boolean flag indicating if place order is in progress
 * @param {Boolean} isPayAfterApprovalSelected - Boolean flag indicating if pay after approval is selected
 * @author Oracle
 * @since 2.10.0
 */
const GHWCheckoutProgressTracker = props => {
  //resources
  const {headingCheckout, headingPayment, headingReview, headingShipping, headingPaymentReview} = props;

  // addresses for the checkout pages (from widget config)
  const {
    checkoutShippingAddress,
    checkoutPaymentAddress,
    checkoutReviewAddress,
    checkoutQuoteShippingAddress,
    checkoutPaymentAndReviewAddress
  } = props;

  const {
    currentOrderId,
    currentOrder = {},
    currentPageType,
    isB2BUser,
    isPlaceOrderInProgress,
    isPayAfterApprovalSelected
  } = props;
  const {numberOfItems = 0} = currentOrder;

  const goToPage = useNavigator();
  // progress tracker data for each page type
  let checkoutPagesData = {
    [PAGE_CHECKOUT_SHIPPING_LINK]: {index: 1, label: headingShipping, page: checkoutShippingAddress},
    [PAGE_CHECKOUT_PAYMENT_LINK]: {index: 2, label: headingPayment, page: checkoutPaymentAddress},
    [PAGE_CHECKOUT_REVIEW_ORDER_LINK]: {index: 3, label: headingReview, page: checkoutReviewAddress}
  };
  if (currentOrder.state === ORDER_STATE_QUOTED) {
    checkoutPagesData = {
      [PAGE_CHECKOUT_QUOTE_SHIPPING_LINK]: {
        index: 1,
        label: headingShipping,
        page: `${checkoutQuoteShippingAddress}/${currentOrderId}`
      },
      [PAGE_CHECKOUT_PAYMENT_AND_REVIEW_ORDER_LINK]: {
        index: 2,
        label: headingPaymentReview,
        page: `${checkoutPaymentAndReviewAddress}/${currentOrderId}`
      }
    };
  }

  // current active tab
  const currentActiveTab = checkoutPagesData[currentPageType] ? checkoutPagesData[currentPageType].index : -1;

  /**
   * @param {Sting} pageType the page type
   * @returns {boolean} true if the previous pages are valid
   */
  const isPageDisabled = pageType => {
    if (numberOfItems === 0) {
      return true;
    }
    if (pageType === PAGE_CHECKOUT_PAYMENT_LINK || pageType === PAGE_CHECKOUT_PAYMENT_AND_REVIEW_ORDER_LINK) {
      return !isShippingDetailsComplete(currentOrder, isB2BUser);
    }
    if (pageType === PAGE_CHECKOUT_REVIEW_ORDER_LINK) {
      return !(
        isShippingDetailsComplete(currentOrder, isB2BUser) &&
        (isPaymentDetailsComplete(currentOrder) || isPayAfterApprovalSelected)
      );
    }

    return false;
  };

  /**
   * Method to navigate to the appropriate page
   * If any of the the previous pages have invalid information or incomplete data,
   * then it navigates to that page
   * @param {Sting} pageType the page type for the currently loaded page
   */
  const validatePage = useCallback(
    pageType => {
      if (numberOfItems === 0) {
        // If the cart is empty, navigate to the cart page
        goToPage(PAGE_CART_LINK);
      } else if (
        (pageType === PAGE_CHECKOUT_PAYMENT_LINK || pageType === PAGE_CHECKOUT_PAYMENT_AND_REVIEW_ORDER_LINK) &&
        !isShippingDetailsComplete(currentOrder, isB2BUser)
      ) {
        // for checkout payment page, if the shipping information is not valid, then navigate to the shipping page
        currentOrder.state === ORDER_STATE_QUOTED
          ? goToPage(checkoutPagesData[PAGE_CHECKOUT_QUOTE_SHIPPING_LINK].page)
          : goToPage(checkoutPagesData[PAGE_CHECKOUT_SHIPPING_LINK].page);
      } else if (pageType === PAGE_CHECKOUT_REVIEW_ORDER_LINK) {
        if (!isShippingDetailsComplete(currentOrder, isB2BUser)) {
          // for checkout review page, if the shipping information is not valid, then navigate to the shipping page
          goToPage(checkoutPagesData[PAGE_CHECKOUT_SHIPPING_LINK].page);
        } else if (!isPaymentDetailsComplete(currentOrder) && !isPayAfterApprovalSelected) {
          // For checkout review page, if the payment information is not valid, then navigate to the payment page
          goToPage(checkoutPagesData[PAGE_CHECKOUT_PAYMENT_LINK].page);
        }
      }
    },
    [numberOfItems, currentOrder, isB2BUser, goToPage, checkoutPagesData, isPayAfterApprovalSelected]
  );

  useEffect(() => {
    // If there is no incomplete order and place order is not in progress, then navigate to the cart page
    if (!currentOrderId && !isPlaceOrderInProgress) {
      goToPage(PAGE_CART_LINK);
    }

    if (currentOrderId && !isEmptyObject(currentOrder)) {
      validatePage(currentPageType);
    }
  }, [currentOrder, currentOrderId, currentPageType, goToPage, isPlaceOrderInProgress, validatePage]);

  return (
    <Styled id="GHWCheckoutProgressTracker" css={css}>
      <div className="GHWCheckoutProgressTracker">
        {/* <h1 className="GHWCheckoutProgressTracker__heading">{headingCheckout}</h1> */}
        <ul className="GHWCheckoutProgressTracker__wrapper">
          {(Object.keys(checkoutPagesData || {}) || []).map(step => (
            <li key={step} className="GHWCheckoutProgressTracker__step">
              <div
                data-text={checkoutPagesData[step].index}
                className={`${
                  currentActiveTab >= checkoutPagesData[step].index ? 'GHWCheckoutProgressTracker__markerActive' : ''
                } GHWCheckoutProgressTracker__marker`}
              >
                <button
                  type="button"
                  className="GHWCheckoutProgressTracker__label"
                  disabled={isPageDisabled(step)}
                  onClick={() => goToPage(checkoutPagesData[step].page)}
                >
                  {checkoutPagesData[step].label}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Styled>
  );
};

GHWCheckoutProgressTracker.propTypes = {
  checkoutShippingAddress: PropTypes.string.isRequired,
  checkoutPaymentAddress: PropTypes.string.isRequired,
  checkoutReviewAddress: PropTypes.string.isRequired,
  checkoutQuoteShippingAddress: PropTypes.string.isRequired,
  checkoutPaymentAndReviewAddress: PropTypes.string.isRequired,
  currentOrderId: PropTypes.string.isRequired,
  currentOrder: PropTypes.shape({
    shippingGroups: PropTypes.objectOf(PropTypes.object),
    commerceItems: PropTypes.objectOf(PropTypes.object)
  }),
  currentPageType: PropTypes.string.isRequired,
  isB2BUser: PropTypes.bool.isRequired,
  isPlaceOrderInProgress: PropTypes.bool.isRequired,
  isPayAfterApprovalSelected: PropTypes.bool.isRequired
};

GHWCheckoutProgressTracker.defaultProps = {
  currentOrder: {}
};

export default connect(getComponentData)(GHWCheckoutProgressTracker);
