/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useEffect} from 'react';

import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import {MiniCartItem} from '../mini-cart-item';

/**
 * This component is for rendering the line items of mini cart
 *
 * @param props - items present in the cart, widget configuration for number of items to be displayed before scrolling
 */
export const MiniCartItemTable = props => {
  const {
    miniCartState,
    commerceItems,
    shippingGroups,
    miniCartitemsBeforeScrolling = '3',
    textQuantity,
    textFreeGift,
    textFree,
    textPreOrderable,
    textBackOrderable,
    messageStatusPreOrder,
    messageStatusBackOrder,
    showMobileElements
  } = props;

  const {showMiniCart = false, miniCartItems = [], itemAdded = false} = miniCartState;

  const isCurrentItemAdded = item => {
    const found = miniCartItems.find(miniCartItem => miniCartItem.catRefId === item.catRefId);
    if (found) {
      return true;
    }

    return false;
  };
  const miniCartItemsToShow = showMiniCart
    ? (Object.keys(shippingGroups || {}) || []).map(shippingGroupId => (
        <div key={shippingGroupId}>
          {shippingGroups[shippingGroupId].items.map(item => {
            return (
              <MiniCartItem
                key={`${shippingGroupId}-${item.commerceId}`}
                isCurrentItemAdded={itemAdded && isCurrentItemAdded(item) ? true : false}
                showMobileElements={showMobileElements}
                shippingGroupId={shippingGroupId}
                shippingGroupCommerceItem={item}
                commerceItem={commerceItems[item.commerceId]}
                shippingGroups={shippingGroups}
                textQuantity={textQuantity}
                textFreeGift={textFreeGift}
                textFree={textFree}
                textPreOrderable={textPreOrderable}
                textBackOrderable={textBackOrderable}
                messageStatusPreOrder={messageStatusPreOrder}
                messageStatusBackOrder={messageStatusBackOrder}
              />
            );
          })}
        </div>
      ))
    : null;

  useEffect(() => {
    if (miniCartItemsToShow) {
      // update the max height property of all cart line items and each line item
      // this is to support the count of items to be shown before scrolling from widget configuration
      const miniCartitemHeight = 7.5;
      const miniCartitemsHeightBeforeScrolling = parseInt(miniCartitemsBeforeScrolling, 10) * miniCartitemHeight;
      document.documentElement.style.setProperty('--mini-cart-item-height', `${miniCartitemHeight}rem`);
      document.documentElement.style.setProperty(
        '--mini-cart-items-before-scrolling',
        `${miniCartitemsHeightBeforeScrolling}rem`
      );
    }
  }, [miniCartItemsToShow, miniCartitemsBeforeScrolling]);

  return (
    <Styled id="MiniCartItemTable" css={css}>
      <div className="MiniCartItems">{miniCartItemsToShow}</div>
    </Styled>
  );
};
