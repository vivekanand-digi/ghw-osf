/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {useContext} from 'react';
import {useDateFormatter, useNumberFormatter} from '@oracle-cx-commerce/react-components/utils/hooks';

import {CartItemContext} from '@oracle-cx-commerce/react-ui/contexts';
import CheckCircleIcon from '@oracle-cx-commerce/react-components/icons/check-circle';
import Link from '@oracle-cx-commerce/react-components/link';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {t} from '@oracle-cx-commerce/utils/generic';
import {PAGE_HOME_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import css from './styles.css';

import {PAGE_CART_LINK} from '../../../../utils/constants/page-links';
/**
 * This component is for rendering the a sub total of the cart items
 *
 * @param props
 * 1. sub total of the cart
 * 2. The text for subtotal
 * 3. The order price list group
 */
export const MiniCartSubTotal = props => {
  const {subTotal, orderPriceListGroup} = props;

  console.log('cart details---> CartItemContext --', useContext(CartItemContext), orderPriceListGroup);
  const formatCurrency = useNumberFormatter({style: 'currency'}, orderPriceListGroup);

  return (
    <Styled id="MiniCartSubTotal" css={css}>
      <div className="MiniCartSubTotal">
        <span className="MiniCartSubTotal__Amount">{formatCurrency(subTotal)}</span>
      </div>
    </Styled>
  );
};
export const MiniCartTotal = props => {
  const {total, orderPriceListGroup} = props;
  const formatCurrency = useNumberFormatter({style: 'currency'}, orderPriceListGroup);

  return (
    <Styled id="MiniCartTotal" css={css}>
      <div className="MiniCartTotal">
        <span className="MiniCartTotal__Amount">{formatCurrency(total)}</span>
      </div>
    </Styled>
  );
};

export const RenderTax = props => {
  const {priceInfo, orderPriceListGroup} = props;
  const formatCurrency = useNumberFormatter({style: 'currency'}, orderPriceListGroup);
  if (priceInfo.shipping > 0) return <span className="OrderSummary__Value">{formatCurrency(priceInfo.shipping)}</span>;

  return <span className="OrderSummary__Value">{'TBD'}</span>;
};

export const RenderOrderDiscounts = props => {
  const {discountInfo, orderPriceListGroup} = props;
  const formatCurrency = useNumberFormatter({style: 'currency'}, orderPriceListGroup);

  console.log('discountInfo--', discountInfo);

  return (
    <span className="OrderSummary__Value">
      {'-'}
      {discountInfo.orderDiscount ? formatCurrency(discountInfo.orderDiscount) : '-'}
    </span>
  );
};

/**
 * This component is for rendering the added to cart alert message in mini -cart
 *
 * @param props - Alert heading for mini cart
 */
export const MiniCartAddAlert = props => {
  const {alertAddedToCart} = props;

  return (
    <Styled id="MiniCartAlertAddToCart">
      <div className="MiniCart__Alert">
        <span className="MiniCart__HeaderAddedIcon">
          <CheckCircleIcon title={alertAddedToCart} />
        </span>
        <span className="MiniCart__HeaderText">{alertAddedToCart}</span>
      </div>
    </Styled>
  );
};

/**
 * It displays stock status of mini cart item based on the inventory data
 */

export const MiniCartItemStockStatus = props => {
  //context
  const {skuInventory = {}, itemLocation} = useContext(CartItemContext);
  console.log('cart details--->', useContext(CartItemContext));
  const formatDate = useDateFormatter();
  const cartItemInventory = skuInventory[itemLocation] || {};

  const stockStatusData = {
    PREORDERABLE: {
      className: 'MiniCart__PreOrderable',
      message: cartItemInventory.availabilityDate
        ? t(props.messageStatusPreOrder, {
            AVAILABLEDATE: cartItemInventory.availabilityDate
              ? formatDate(new Date(cartItemInventory.availabilityDate))
              : ''
          })
        : ''
    },
    BACKORDERABLE: {
      className: 'MiniCart__BackOrderable',
      message: cartItemInventory.availabilityDate
        ? t(props.messageStatusBackOrder, {
            AVAILABLEDATE: cartItemInventory.availabilityDate
              ? formatDate(new Date(cartItemInventory.availabilityDate))
              : ''
          })
        : ''
    }
  };

  const defaultStatusValue = {
    className: '',
    message: ''
  };

  const currentStatuObject = stockStatusData[cartItemInventory.stockStatus] || defaultStatusValue;

  return (
    <Styled id="MiniCartStockStatus" css={css}>
      {cartItemInventory && cartItemInventory.stockStatus && (
        <div className={`${currentStatuObject.className}`}>
          <span>{currentStatuObject.message}</span>
        </div>
      )}
    </Styled>
  );
};

/**
 * This component is for rendering the buttons on mini cart
 *
 * @param props - different flags to render the buttons
 * 1. flag indicating if the mini cart is for hover or item added event
 * 2. number of items in the cart to display it on the cart button
 * 3. flag to indicate if checkout button is required (as defined in the widget configuration)
 */
export const MiniCartButtons = props => {
  const {
    actionCheckout,
    actionViewCart,
    Checkout,
    numberOfItems = 0,
    closeMiniCart,
    displayCheckoutButtonOnMiniCart,
    showMobileElements,
    actionContinueShopping
  } = props;

  return (
    <Styled id="MiniCartButtons" css={css}>
      <div className="MiniCartButtons__Wrapper">
        <React.Fragment>
          {displayCheckoutButtonOnMiniCart ? (
            <Link className="MiniCartButtons MiniCartButtons__CheckoutButton" onClick={closeMiniCart} href={Checkout}>
              {actionCheckout}
            </Link>
          ) : null}
          <Link className="MiniCartButtons MiniCartButtons__CartButton" onClick={closeMiniCart} href={PAGE_CART_LINK}>
            {t(actionViewCart, {numberOfItems})}
          </Link>
          <Link
            className="MiniCartButtons MiniCartButtons__ContinueShoppingButton btnLink"
            onClick={closeMiniCart}
            href={PAGE_HOME_LINK}
          >
            {actionContinueShopping}
          </Link>
        </React.Fragment>

        {showMobileElements ? (
          <div>
            <button type="button" className="secondary" onClick={() => closeMiniCart()}>
              {actionContinueShopping}
            </button>
          </div>
        ) : null}
      </div>
    </Styled>
  );
};
