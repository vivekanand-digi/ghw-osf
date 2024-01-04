/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {Suspense, useCallback, useContext, useEffect, useState} from 'react';

import ActionIcon from '@oracle-cx-commerce/react-components/action-icon';
import Link from '@oracle-cx-commerce/react-components/link';
import {PAGE_CART_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import PropTypes from 'prop-types';
import ShoppingBasketIcon from '@oracle-cx-commerce/react-components/icons/shopping-basket';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import css from '@oracle-cx-commerce/react-widgets/cart/mini-cart/mobile.css';
import {getComponentData} from '@oracle-cx-commerce/react-widgets/cart/mini-cart/selectors';
import {t} from '@oracle-cx-commerce/utils/generic';
import {useCartInitializer} from '@oracle-cx-commerce/react-components/utils/cart/hooks';

// ONLY CHANGE FOR THIS FILE
const MiniCartModalPromise = import('./components/mini-cart-modal-mobile');
// END
const MiniCartModal = React.lazy(() => MiniCartModalPromise);

/**
 * This component is for cart icon and it invokes the mini cart modal on mobile
 * when an item is added to cart
 *
 * @param props - list of commerceItems in the cart & other supported properties
 */
const MiniCartMobile = props => {
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
    numberOfItems = 0,
    commerceItems = {},
    continueToPageAddress
  } = props;
  const cartLinkAriaText = t(headingMiniShoppingCart, {numberOfItems});
  const store = useContext(StoreContext);
  const {currentOrder, isGetCartInProgress} = props;

  const showMobileElements = true; //this variable controls the visibility of mobile specific elements

  /* create a local state to hold different values required by this and child Components
   * showMiniCart - flag to identify if mini cart should be shown hover on icon, item added to cart
   * miniCartItems - item added to cart
   * itemAdded - indicates if the item is added to the cart, used to differentiate from onHover event
   */
  const [miniCartState, setMiniCartState] = useState({
    showMiniCart: false,
    miniCartItems: [],
    itemAdded: false
  });

  /**
   * Handler to close mini cart pop up
   * Resets the internal state values
   */
  const closeMiniCart = useCallback(() => {
    setMiniCartState({
      showMiniCart: false,
      miniCartItems: [],
      itemAdded: false
    });
  }, []);

  useCartInitializer(currentOrder, isGetCartInProgress);

  useEffect(() => {
    // subscribe to 'addItemsToCartComplete', to get notified when an item is added to cart
    const unsubscribe = store.subscribeDispatch(action => {
      const {type, originalAction: {payload: {items = []} = {}} = {}} = action;

      if (type === 'addItemsToCartComplete' && items && items.length > 0) {
        const cartItems = Object.values(commerceItems);
        const itemAdded = cartItems.find(cartItem => cartItem.catRefId === items[0].catRefId);
        // update the local state with item added and other properties accordingly
        if (itemAdded) {
          setMiniCartState({
            miniCartItems: [itemAdded],
            itemAdded: true,
            showMiniCart: true
          });
        }
      }
    });

    return unsubscribe;
  }, [closeMiniCart, commerceItems, store]);

  return (
    <Styled id="MiniCartMobile" css={css}>
      <div className="MiniCartMobile">
        <ActionIcon>
          <Link href={PAGE_CART_LINK} className="MiniCartMobile__CartLink" ariaLabel={cartLinkAriaText}>
            <ShoppingBasketIcon />
          </Link>
        </ActionIcon>
        <span aria-hidden="true">{numberOfItems}</span>

        {numberOfItems > 0 ? (
          <Suspense fallback={null}>
            <MiniCartModal
              miniCartState={miniCartState}
              closeMiniCart={closeMiniCart}
              continueToPageAddress={continueToPageAddress}
              showMobileElements={showMobileElements}
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
        ) : null}
      </div>
    </Styled>
  );
};

MiniCartMobile.propTypes = {
  displayCheckoutButtonOnMiniCart: PropTypes.bool,
  commerceItems: PropTypes.objectOf(PropTypes.object).isRequired,
  shippingGroups: PropTypes.objectOf(PropTypes.object).isRequired,
  numberOfItems: PropTypes.number,
  currentPriceListGroup: PropTypes.shape({
    currency: PropTypes.shape({
      currencyCode: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    }),
    locale: PropTypes.string.isRequired
  }).isRequired,
  isUserLoggedIn: PropTypes.bool.isRequired
};

MiniCartMobile.defaultProps = {
  displayCheckoutButtonOnMiniCart: true,
  numberOfItems: 0
};

export default connect(getComponentData)(MiniCartMobile);
