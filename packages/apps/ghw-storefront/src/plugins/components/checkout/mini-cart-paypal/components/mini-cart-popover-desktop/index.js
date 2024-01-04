/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback} from 'react';
import Popover from '@oracle-cx-commerce/react-components/popover';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {MiniCartItemTable} from '@oracle-cx-commerce/react-widgets/cart/mini-cart/components/mini-cart-item-table';
import {
  MiniCartSubTotal,
  MiniCartButtons
} from '@oracle-cx-commerce/react-widgets/cart/mini-cart/components/mini-cart-components';
import {t} from '@oracle-cx-commerce/utils/generic';
import css from './styles.css';
import PayPalPaymentButton from '../../../paypal-payment-button';

const MiniCartPopover = props => {
  const {
    enableFunding,
    actionCheckout,
    actionContinueShopping,
    actionViewCart,
    closeLinkAltText,
    closeMiniCart,
    commerceItems = {},
    continueToPageAddress,
    cssOverride,
    currentPriceListGroup,
    displayCheckoutButtonOnMiniCart = true,
    headingYourCart,
    isUserLoggedIn,
    miniCartitemsBeforeScrolling = 3,
    miniCartState,
    numberOfItems = 0,
    priceInfo = {},
    setIsPayPalOpen,
    shippingGroups = {},
    showMobileElements,
    subscriptionBillingFrequency,
    subscriptionMessageBase,
    textSubtotal,
    subscriptionMessageMonthsPlural,
    subscriptionMessageSingleMonth
  } = props;

  const {showMiniCart} = miniCartState;

  const handleCreateOrder = useCallback(isCreating => setIsPayPalOpen(isCreating), [setIsPayPalOpen]);

  return (
    <Styled id="MiniCartDesktop__Popover" css={css}>
      <div className="MiniCartDesktop__Popover">
        <Popover
          cssOverride={cssOverride}
          show={showMiniCart}
          onClose={closeMiniCart}
          closeIconTitle={closeLinkAltText}
          closeArialLabel={closeLinkAltText}
          title={headingYourCart}
          onMouseLeave={closeMiniCart}
        >
          {Boolean(subscriptionBillingFrequency) && (
            <div className="MiniCartDesktop__Subscription">
              {subscriptionMessageBase}
              <span>
                {subscriptionBillingFrequency === '1'
                  ? subscriptionMessageSingleMonth
                  : t(subscriptionMessageMonthsPlural, {billingFrequency: subscriptionBillingFrequency})}
              </span>
            </div>
          )}
          <MiniCartItemTable
            miniCartState={miniCartState}
            miniCartitemsBeforeScrolling={miniCartitemsBeforeScrolling}
            shippingGroups={shippingGroups}
            commerceItems={commerceItems}
            {...props}
          />
          <MiniCartSubTotal
            textSubtotal={textSubtotal}
            subTotal={priceInfo.subTotal}
            orderPriceListGroup={currentPriceListGroup}
          />
          <MiniCartButtons
            showMobileElements={showMobileElements}
            actionContinueShopping={actionContinueShopping}
            actionViewCart={actionViewCart}
            numberOfItems={numberOfItems}
            actionCheckout={actionCheckout}
            closeMiniCart={closeMiniCart}
            displayCheckoutButtonOnMiniCart={displayCheckoutButtonOnMiniCart}
            isUserLoggedIn={isUserLoggedIn}
          />
          <PayPalPaymentButton
            onCreateOrder={handleCreateOrder}
            continueToPageAddress={continueToPageAddress}
            subscriptionBillingFrequency={subscriptionBillingFrequency}
            id="mini-cart-paypal-button"
            enableFunding={enableFunding}
          />
        </Popover>
      </div>
    </Styled>
  );
};

export default React.memo(MiniCartPopover);
