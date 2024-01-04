/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useEffect} from 'react';

import {
  CommerceItemImage,
  CommerceItemName,
  CommerceItemTotalPrice,
  CommerceItemPrice,
  CommerceItemVariants,
  CommerceItemFreeGiftIconMessage
} from '@oracle-cx-commerce/react-widgets/cart/cart-item-details/components/commerce-item-components';
import {MiniCartItemStockStatus} from '@oracle-cx-commerce/react-widgets/cart/mini-cart/components/mini-cart-components';
import {CartItemContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {useCartItemState} from '@oracle-cx-commerce/react-components/utils/cart/hooks';
import css from './styles.css';

/**
 * This component is for rendering the a line item of mini cart
 *
 * @param props - current item details
 */
export const MiniCartItem = props => {
  const {
    commerceItem = {},
    shippingGroupCommerceItem = {},
    shippingGroupId,
    shippingGroups,
    textQuantity,
    textFreeGift,
    textFree,
    textPreOrderable,
    textBackOrderable,
    messageStatusPreOrder,
    messageStatusBackOrder,
    isCurrentItemAdded,
    showMobileElements,
    messageAtTheRate,
    priceListGroup
  } = props;

  const pdpUrlNotRequired = false;

  //retrieve all the relevant info using cart hook
  const {pdpUrl, itemLocation, skuInventory} = useCartItemState({
    commerceItem,
    shippingGroupCommerceItem,
    shippingGroups,
    shippingGroupId,
    pdpUrlNotRequired
  });

  const {quantity} = shippingGroupCommerceItem;
  const cartItemContext = {commerceItem, pdpUrl, shippingGroupCommerceItem, skuInventory, itemLocation};
  const ref = React.createRef();

  useEffect(() => {
    // scroll to bring the added item into view
    if (isCurrentItemAdded && ref && ref.current) {
      const elementToView = ref.current;
      if (elementToView.nextSibling === null) {
        //last mini cart item, scroll till the end of the item
        setTimeout(() => {
          elementToView.lastElementChild
            ? elementToView.lastElementChild.scrollIntoView(false)
            : elementToView.scrollIntoView(false);
        }, 0);
      } else {
        //ensure the entire item is visible by positioning it at the middle
        elementToView.scrollIntoView({block: 'center', inline: 'nearest'});
      }
    }
  }, [ref, isCurrentItemAdded]);
  // invoke the commerce items components to display the details

  return (
    <Styled id="MiniCartItem" css={css}>
      <div className="MiniCartItem" ref={ref} key={`${shippingGroupId}-${commerceItem.id}`}>
        <CartItemContext.Provider value={cartItemContext}>
          <div className="MiniCartItem__Details">
            {pdpUrl ? (
              <div className="MiniCartItem__Image">
                <CommerceItemImage />
              </div>
            ) : (
              <div className="MiniCartItem__ImagePlaceHolder"></div>
            )}
            <div className="MiniCartItem__ItemInfo">
              <div className="MiniCartItem__Name">
                <CommerceItemName />
              </div>
              <div>
                <div className="MiniCartItem__Variants">
                  <CommerceItemVariants />
                </div>
                {!showMobileElements && (
                  <div className="MiniCartItem__Quantity">
                    {textQuantity} : {quantity}
                  </div>
                )}
                <div className="MiniCartItem__FreeGift">
                  <CommerceItemFreeGiftIconMessage textFreeGift={textFreeGift} />
                </div>
                <div className="MiniCartItem__StockStatus">
                  <MiniCartItemStockStatus
                    textPreOrderable={textPreOrderable}
                    textBackOrderable={textBackOrderable}
                    messageStatusPreOrder={messageStatusPreOrder}
                    messageStatusBackOrder={messageStatusBackOrder}
                  />
                </div>
              </div>
            </div>
            {!showMobileElements && (
              <div className="MiniCartItem__Price">
                <CommerceItemTotalPrice textFree={textFree} />
              </div>
            )}
            {showMobileElements && (
              <div className="MiniCartItem__Price">
                <CommerceItemPrice messageAtTheRate={messageAtTheRate} priceListGroup={priceListGroup} />
              </div>
            )}
          </div>
          <div>
            <hr className="MiniCartItem__DetailsBorder" />
          </div>
        </CartItemContext.Provider>
      </div>
    </Styled>
  );
};
