/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import CartItemRow from '@oracle-cx-commerce/react-widgets/cart/cart-item-details/components/cart-item-row';
import CartItemsTableHeader from '@oracle-cx-commerce/react-widgets/cart/cart-item-details/components/cart-items-table-header';
import GWPPlaceholder from '@oracle-cx-commerce/react-widgets/cart/cart-item-details/components/gwp-placeholder';
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import {useCartState} from '@oracle-cx-commerce/react-components/utils/cart/hooks';
import PropTypes from 'prop-types';

/**
 * Component to render the cart item details for a shipping group
 * @param {Object} props The properties object
 * @memberof Components
 * @class ShippingCartItemDetails
 * @category Component-list
 * @param {Object} shippingGroup - Shipping group
 * @param {Object} commerceItems - Commerce items
 * @param {Boolean} [isMultiShipping = false] - Boolean flag indicating if this component is rendered for multi-shipping-widget
 * @param {Number} shippingDeliveryIndex - Shipping delivery index
 * @author Oracle
 */
const ShippingCartItemDetails = props => {
  const {shippingGroup = {}, commerceItems = {}, isMultiShipping = false, shippingDeliveryIndex} = props;
  const {shippingGroupId} = shippingGroup;

  // cart state
  const {setInvalidItems} = useCartState();

  return (
    <Styled id="ShippingCartItemDetails" css={css}>
      <div className="ShippingCartItemDetails">
        <div className="ShippingCartItemDetails__TableHeader">
          <CartItemsTableHeader {...props} />
        </div>

        <div className="ShippingCartItemDetails__TableBody">
          {(shippingGroup.items || []).map(item => {
            return (
              <CartItemRow
                key={`${shippingGroupId}-${item.commerceId}`}
                shippingGroupCommerceItem={item}
                shippingGroupId={shippingGroupId}
                commerceItem={commerceItems[item.commerceId]}
                setInvalidItems={setInvalidItems}
                isSplitShipping={isMultiShipping}
                pdpUrlNotRequired={true}
                {...props}
              />
            );
          })}
          {(shippingDeliveryIndex === 1 || shippingDeliveryIndex === '') && <GWPPlaceholder {...props} />}
        </div>
      </div>
    </Styled>
  );
};

ShippingCartItemDetails.propTypes = {
  /**
   * Shipping Group
   */
  shippingGroup: PropTypes.shape({
    shippingGroupId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        commerceId: PropTypes.string.isRequired
      })
    )
  }).isRequired,

  /**
   * Commerce Items.
   */
  commerceItems: PropTypes.objectOf(PropTypes.object),

  /**
   * Flag to know if this component is rendered for multi-shipping-widget
   */
  isMultiShipping: PropTypes.bool
};

ShippingCartItemDetails.defaultProps = {
  commerceItems: {},
  isMultiShipping: undefined
};

export default React.memo(ShippingCartItemDetails);
