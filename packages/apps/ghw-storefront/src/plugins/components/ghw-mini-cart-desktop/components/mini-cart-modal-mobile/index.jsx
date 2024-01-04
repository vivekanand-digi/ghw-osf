/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import Modal from '@oracle-cx-commerce/react-components/modal';
import {
  MiniCartAddAlert,
  MiniCartButtons
} from '@oracle-cx-commerce/react-widgets/cart/mini-cart/components/mini-cart-components';
import {MiniCartItem} from './mini-cart-item';

/**
 * This component is for rendering the line items of mini cart
 *
 * @param props - items present in the cart, widget configuration for number of items to be displayed before scrolling
 */

const MiniCartModal = props => {
  const {
    cssOverride,
    actionCheckout,
    actionViewCart,
    closeLinkAltText,
    alertAddedToCart,
    numberOfItems = 0,
    displayCheckoutButtonOnMiniCart = true,
    actionContinueShopping,
    isUserLoggedIn,
    showMobileElements,
    textFreeGift,
    textFree,
    textPreOrderable,
    textBackOrderable,
    messageStatusPreOrder,
    messageStatusBackOrder,
    miniCartState,
    closeMiniCart,
    shippingGroups,
    currentPriceListGroup,
    messageAtTheRate
  } = props;

  const {showMiniCart = false, miniCartItems = [], itemAdded = false} = miniCartState;

  const miniCartItemsToShow =
    showMiniCart && itemAdded
      ? miniCartItems.map(commerceItem => (
          <MiniCartItem
            key={commerceItem.id}
            commerceItem={commerceItem}
            shippingGroups={shippingGroups}
            shippingGroupCommerceItem={commerceItem}
            textFreeGift={textFreeGift}
            textFree={textFree}
            textPreOrderable={textPreOrderable}
            textBackOrderable={textBackOrderable}
            messageStatusPreOrder={messageStatusPreOrder}
            messageStatusBackOrder={messageStatusBackOrder}
            showMobileElements={showMobileElements}
            priceListGroup={currentPriceListGroup}
            messageAtTheRate={messageAtTheRate}
          />
        ))
      : null;

  return (
    <Styled id="MiniCartMobile__Modal" css={css}>
      <Modal
        cssOverride={cssOverride}
        show={showMiniCart}
        onClose={closeMiniCart}
        closeIconTitle={closeLinkAltText}
        closeArialLabel={closeLinkAltText}
        title={<MiniCartAddAlert alertAddedToCart={alertAddedToCart} />}
      >
        <div className="MiniCartItems">{miniCartItemsToShow}</div>
        <MiniCartButtons
          itemAdded={itemAdded}
          closeMiniCart={closeMiniCart}
          showMobileElements={showMobileElements}
          actionContinueShopping={actionContinueShopping}
          actionViewCart={actionViewCart}
          numberOfItems={numberOfItems}
          actionCheckout={actionCheckout}
          displayCheckoutButtonOnMiniCart={displayCheckoutButtonOnMiniCart}
          isUserLoggedIn={isUserLoggedIn}
        />
      </Modal>
    </Styled>
  );
};

export default React.memo(MiniCartModal);
