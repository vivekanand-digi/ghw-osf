/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {Suspense, useCallback, useContext, useEffect, useState} from 'react';

import ActionIcon from '@oracle-cx-commerce/react-components/action-icon';
import Link from '@oracle-cx-commerce/react-components/link';
import {MINI_CART_DURATION} from '@oracle-cx-commerce/commerce-utils/constants/cart';
import PropTypes from 'prop-types';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {t, noop} from '@oracle-cx-commerce/utils/generic';
import {useCartInitializer} from '@oracle-cx-commerce/react-components/utils/cart/hooks';
import css from './styles.css';
import {getComponentData} from './selectors';
import {MINI_CART_TIMEOUT} from '../../utils/constants';

const MiniCartPopoverPromise = import('./components/mini-cart-popover-desktop');
const MiniCartPopover = React.lazy(() => MiniCartPopoverPromise);

/**
 * This component is for mini cart icon. On click, it invokes the mini cart pop up on desktop
 *
 * @param props - commerceItems in the cart & other supported properties
 */
const GHWMiniCartDesktop = props => {
  const {
    headingMiniShoppingCart,
    enableMiniCartOnDesktop = true,
    currentOrder,
    isGetCartInProgress,
    commerceItems = {},
    numberOfItems = 0
  } = props;
  console.log('mini-card index--> ', props.miniCartItemsBeforeScrolling);
  const showMobileElements = false; //this variable controls the visibility of mobile specific elements
  const cartLinkAriaText = t(headingMiniShoppingCart, {numberOfItems});
  const store = useContext(StoreContext);
  const {action} = store;
  const {isUserLoggedIn} = props;
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

  /**
   * Handler to close mini cart pop up
   * Resets the internal state values
   */
  const closeMiniCart = useCallback(() => {
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
  const handleMouseOver = useCallback(() => {
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
          setTimeout(closeMiniCart, MINI_CART_DURATION * {MINI_CART_TIMEOUT});
        }
      }
    });

    return unsubscribe;
  }, [action, closeMiniCart, commerceItems, store]);

  // include the mini cart only if the 'enableMiniCartOnDesktop' is set in the widget configuration

  return (
    <Styled id="GHWMiniCartDesktop" css={css}>
      <div
        className="GHWMiniCartDesktop"
        role="button"
        onKeyDown={noop}
        tabIndex="0"
        onClick={handleMouseOver}
        // onMouseLeave={closeMiniCartPopover}
      >
        <ActionIcon>
          <Link href={noop} ariaLabel={cartLinkAriaText}>
            <p className="cartTitle">Cart</p>
            <img src="/file/general/cart-empty.svg" alt="Empty Cart" />
          </Link>
        </ActionIcon>
        {numberOfItems > 0 ? <span aria-hidden="true">{numberOfItems}</span> : ''}
        {enableMiniCartOnDesktop && typeof window !== 'undefined' && (
          <Suspense fallback={null}>
            <MiniCartPopover
              miniCartState={miniCartState}
              closeMiniCart={closeMiniCart}
              showMobileElements={showMobileElements}
              {...props}
            />
          </Suspense>
        )}
      </div>
    </Styled>
  );
};

GHWMiniCartDesktop.propTypes = {
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

GHWMiniCartDesktop.defaultProps = {
  enableMiniCartOnDesktop: true,
  displayCheckoutButtonOnMiniCart: true,
  miniCartItemsBeforeScrolling: '3'
};

export default connect(getComponentData)(GHWMiniCartDesktop);
