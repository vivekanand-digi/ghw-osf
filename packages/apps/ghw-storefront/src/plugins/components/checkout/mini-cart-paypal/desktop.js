/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {Suspense, useCallback, useContext, useEffect, useRef, useState} from 'react';

import ActionIcon from '@oracle-cx-commerce/react-components/action-icon';
import Link from '@oracle-cx-commerce/react-components/link';
import {MINI_CART_DURATION} from '@oracle-cx-commerce/commerce-utils/constants/cart';
import {PAGE_CART_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import PropTypes from 'prop-types';
import ShoppingBasketIcon from '@oracle-cx-commerce/react-components/icons/shopping-basket';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect, useSelector} from '@oracle-cx-commerce/react-components/provider';
import css from '@oracle-cx-commerce/react-widgets/cart/mini-cart/desktop.css';
import {getComponentData} from '@oracle-cx-commerce/react-widgets/cart/mini-cart/selectors';
import {t} from '@oracle-cx-commerce/utils/generic';
import {useCartInitializer} from '@oracle-cx-commerce/react-components/utils/cart/hooks';
import {getCurrentOrderId, getCurrentPageId} from '@oracle-cx-commerce/commerce-utils/selector';
import {
  PAGE_CHECKOUT_LOGIN_LINK,
  PAGE_CHECKOUT_ORDER_CONFIRMATION_LINK,
  PAGE_CHECKOUT_PAYER_AUTHENTICATION_LINK,
  PAGE_CHECKOUT_PAYMENT_LINK,
  PAGE_CHECKOUT_REVIEW_ORDER_LINK,
  PAGE_CHECKOUT_QUOTE_SHIPPING_LINK,
  PAGE_CHECKOUT_PAYMENT_AND_REVIEW_ORDER_LINK,
  PAGE_CHECKOUT_SHIPPING_LINK,
  PAGE_CHECKOUT_LINK
} from '@oracle-cx-commerce/commerce-utils/constants/page-links';
import {getShopperSubscription} from '../../../selectors/shopper-profile-selector';

const MiniCartPopoverPromise = import('./components/mini-cart-popover-desktop');
const MiniCartPopover = React.lazy(() => MiniCartPopoverPromise);

const CHECKOUT_PAGE_LINK_IDS = [
  PAGE_CHECKOUT_LOGIN_LINK,
  PAGE_CHECKOUT_ORDER_CONFIRMATION_LINK,
  PAGE_CHECKOUT_PAYER_AUTHENTICATION_LINK,
  PAGE_CHECKOUT_PAYMENT_LINK,
  PAGE_CHECKOUT_REVIEW_ORDER_LINK,
  PAGE_CHECKOUT_QUOTE_SHIPPING_LINK,
  PAGE_CHECKOUT_PAYMENT_AND_REVIEW_ORDER_LINK,
  PAGE_CHECKOUT_SHIPPING_LINK,
  PAGE_CHECKOUT_LINK
];

/**
 * This component is for mini cart icon. On click, it invokes the mini cart pop up on desktop
 *
 * @param props - commerceItems in the cart & other supported properties
 */
const MiniCartDesktop = props => {
  const {
    enableFunding = 'credit,paylater,venmo',
    messagingLayout = 'text',
    messagingLogoType = 'primary',
    messagingLogoPosition = 'left',
    messagingTextColor = 'black',
    messagingTextSize = '12',
    messagingTextAlign = 'left',
    messagingColor = 'blue',
    messagingRatio = '1x1',
    headingMiniShoppingCart,
    enableMiniCartOnDesktop = true,
    currentOrder,
    isGetCartInProgress,
    commerceItems = {},
    numberOfItems = 0
  } = props;
  const showMobileElements = false; //this variable controls the visibility of mobile specific elements
  const cartLinkAriaText = t(headingMiniShoppingCart, {numberOfItems});
  const store = useContext(StoreContext);
  const {action} = store;
  const currentOrderId = getCurrentOrderId(store.getState());
  const currentPageId = useSelector(getCurrentPageId);

  const subscriptionBillingFrequency = useSelector(getShopperSubscription).billingFrequency;

  const autoOpenMiniCart = useRef(null);

  // create a local state to hold different values required by this and child Components
  // showMiniCart - flag to identify if mini cart should be shown hover on icon, item added to cart
  // miniCartItems - list of items in the cart
  // itemAdded - indicates if the item is added to the cart, used to differentiate from onHover event
  const [miniCartState, setMiniCartState] = useState({
    showMiniCart: false,
    miniCartItems: [],
    itemAdded: false,
    closeHandler: null
  });

  const isPayPalOpen = useRef(false);

  /**
   * Handler to close mini cart pop up
   * Resets the internal state values
   */
  const closeMiniCart = useCallback(() => {
    if (isPayPalOpen.current) {
      return;
    }
    setMiniCartState({
      showMiniCart: false,
      miniCartItems: [],
      itemAdded: false,
      closeHandler: null
    });
  }, []);

  const closeMiniCartPopover = useCallback(() => {
    setMiniCartState(prevState => {
      return {...prevState, closeHandler: setTimeout(closeMiniCart, 250)};
    });
  }, [closeMiniCart]);

  /**
   * Handler to hover event on cart icon
   * initializes commerceItems of the local state with list of cart items
   * and other properties accordingly
   */
  const handleShowCart = useCallback(() => {
    if (miniCartState.closeHandler) {
      clearTimeout(miniCartState.closeHandler);
    }
    if (miniCartState.showMiniCart) return;
    const cartItems = Object.values(commerceItems);
    setMiniCartState({
      miniCartItems: cartItems,
      itemAdded: false,
      showMiniCart: true,
      closeHandler: null
    });
  }, [commerceItems, miniCartState]);

  const handleMouseOver = useCallback(() => {
    if (autoOpenMiniCart.current) {
      clearTimeout(autoOpenMiniCart.current);
    }
    handleShowCart();
  }, [handleShowCart]);

  useCartInitializer(currentOrder, isGetCartInProgress);

  useEffect(() => {
    // subscribe to 'addItemsToCartComplete', to get notified when an item is added to cart
    const unsubscribe = store.subscribeDispatch(action => {
      const {type, originalAction: {payload: {items = []} = {}} = {}} = action;

      if (type === 'addItemsToCartComplete' && items && items.length > 0) {
        const cartItems = Object.values(commerceItems);
        const itemAddedToCart = cartItems.find(cartItem => cartItem.catRefId === items[0].catRefId);
        // update the local state with item added and other properties accordingly
        if (itemAddedToCart) {
          setMiniCartState({
            miniCartItems: [itemAddedToCart],
            itemAdded: true,
            showMiniCart: true,
            closeHandler: null
          });
          // close the mini cart (item added) pop up after specified no. of seconds
          autoOpenMiniCart.current = setTimeout(closeMiniCart, MINI_CART_DURATION * 1000);
        }
      }
    });

    return unsubscribe;
  }, [action, closeMiniCart, commerceItems, store]);

  useEffect(() => {
    const isInCheckoutFlow = CHECKOUT_PAGE_LINK_IDS.some(linkId => currentPageId.includes(linkId));

    if (subscriptionBillingFrequency && numberOfItems && !isInCheckoutFlow) {
      action('deleteCart', {orderId: currentOrderId});
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetPayPalOpen = useCallback(val => (isPayPalOpen.current = val), []);

  // include the mini cart only if the 'enableMiniCartOnDesktop' is set in the widget configuration

  return (
    <Styled id="MiniCartDesktop" css={css}>
      <div
        className="MiniCartDesktop"
        onFocus={handleShowCart}
        onMouseOver={handleMouseOver}
        onMouseLeave={closeMiniCartPopover}
      >
        <ActionIcon>
          <Link href={PAGE_CART_LINK} ariaLabel={cartLinkAriaText}>
            <ShoppingBasketIcon />
          </Link>
        </ActionIcon>
        <span aria-hidden="true">{numberOfItems}</span>
        {enableMiniCartOnDesktop && numberOfItems > 0 && typeof window !== 'undefined' && (
          <Suspense fallback={null}>
            <MiniCartPopover
              setIsPayPalOpen={handleSetPayPalOpen}
              miniCartState={miniCartState}
              closeMiniCart={closeMiniCart}
              showMobileElements={showMobileElements}
              subscriptionBillingFrequency={subscriptionBillingFrequency}
              enableFunding={enableFunding}
              messagingLayout={messagingLayout}
              messagingLogoType={messagingLogoType}
              messagingLogoPosition={messagingLogoPosition}
              messagingTextColor={messagingTextColor}
              messagingTextSize={messagingTextSize}
              messagingTextAlign={messagingTextAlign}
              messagingColor={messagingColor}
              messagingRatio={messagingRatio}
              {...props}
            />
          </Suspense>
        )}
      </div>
    </Styled>
  );
};

MiniCartDesktop.propTypes = {
  enableMiniCartOnDesktop: PropTypes.bool,
  displayCheckoutButtonOnMiniCart: PropTypes.bool,
  miniCartItemsBeforeScrolling: PropTypes.string,
  currentOrder: PropTypes.shape({
    commerceItems: PropTypes.objectOf(PropTypes.object),
    shippingGroups: PropTypes.objectOf(PropTypes.object),
    priceInfo: PropTypes.shape({
      subTotal: PropTypes.number
    }),
    numberOfItems: PropTypes.number
  }).isRequired,
  currentPriceListGroup: PropTypes.shape({
    currency: PropTypes.shape({
      currencyCode: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    }),
    locale: PropTypes.string.isRequired
  }).isRequired,
  isUserLoggedIn: PropTypes.bool.isRequired
};

MiniCartDesktop.defaultProps = {
  enableMiniCartOnDesktop: true,
  displayCheckoutButtonOnMiniCart: true,
  miniCartItemsBeforeScrolling: '3'
};

export default connect(getComponentData)(MiniCartDesktop);
