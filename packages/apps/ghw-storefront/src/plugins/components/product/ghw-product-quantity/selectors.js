/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getCurrentOrder, getProduct, getLocationBasedInventory} from '@oracle-cx-commerce/commerce-utils/selector';
import {useSelector} from '@oracle-cx-commerce/react-components/provider';
import {useContext} from 'react';
import {ProductContext, ContainerContext} from '@oracle-cx-commerce/react-ui/contexts';

/**
 * Returns data required by the component by invoking selectors
 *
 * @param  {String} widgetId Widget Id
 * @param  {String} productId Product Id
 * @return {Object} Object
 */
export const useComponentData = state => {
  const {id: productId} = useContext(ProductContext);

  const {
    selections: {skuId = null, qty: previousQty, selectedStore = {}, isPickupInStoreOptionSelected = false} = {},
    selections,
    setSelections
  } = useContext(ContainerContext);

  const locationId = isPickupInStoreOptionSelected && selectedStore.locationId ? selectedStore.locationId : '';
  // selectors
  const skuInventory = getLocationBasedInventory(state, {
    skuId,
    locationId
  });
  const {orderableQuantity} = skuInventory;
  const {shippingGroups = {}} = useSelector(getCurrentOrder);
  const {orderLimit} = getProduct(state, {productId});

  return {
    productId,
    shippingGroups,
    selectedStore,
    isPickupInStoreOptionSelected,
    skuId,
    orderableQuantity,
    orderLimit,
    previousQty,
    selections,
    setSelections,
    skuInventory
  };
};
