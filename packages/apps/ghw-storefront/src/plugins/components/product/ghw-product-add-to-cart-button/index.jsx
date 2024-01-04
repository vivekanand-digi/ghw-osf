import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useCallback, useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {noop} from '@oracle-cx-commerce/utils/generic';
import css from './ghw-product-add-to-cart-button.css';
import AddToCartButton from './components/add-to-cart-button';
import GHWProductQuantity from '../ghw-product-quantity';

/**
 * A widget for adding an item to the cart.
 * Validates stock status before adding item to the cart.
 * The quantity and order limits validations are performed in quantity widget
 * Displays the last item added to the cart in the mini cart.
 */
const GHWProductAddToCartButton = props => {
  // contexts
  const {action} = useContext(StoreContext);

  /**
   * Handler for Product Add to Cart.
   * Dispatches action when add to cart is clicked.
   * Throws validation errors if quantity added is invalid
   * @param  {Object} Object
   */
  const onAddToCart = useCallback(
    ({payload, onOk = noop, onNotOk = noop, onComplete = noop}) => {
      action('addItemsToCart', {
        items: [{...payload}]
      })
        .then(response => {
          if (response.ok === true) {
            onOk(response);
          } else {
            onNotOk(response);
          }
        })
        .catch(error => {
          onNotOk({error});
        })
        .finally(onComplete);
    },
    [action]
  );

  return (
    <Styled id="GHWProductAddToCartButton" css={css}>
      <div className="GHWProductAddToCartButton__Wrapper">
        <GHWProductQuantity />
        <AddToCartButton onAddToCart={onAddToCart} {...props} />
      </div>
    </Styled>
  );
};

export default GHWProductAddToCartButton;
