/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getCurrentOrder,
  getProduct,
  getCurrentPriceListGroup,
  isAuthenticated,
  getCurrentProfileId,
  getCartEndpointStatus
} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';

export const getComponentData = state => {
  const products = [];
  const currentOrder = getCurrentOrder(state);
  const currentPriceListGroup = getCurrentPriceListGroup(state);
  const {priceInfo = {}} = currentOrder;
  const {commerceItems = {}, shippingGroups = {}, numberOfItems} = currentOrder;
  Object.values(commerceItems).forEach(commerceItem => {
    const {productId} = commerceItem;
    const product = getProduct(state, {productId});
    if (!isEmptyObject(product)) {
      products.push(product);
    }
  });
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  const isGetCartInProgress = getCartEndpointStatus(state);

  return {
    products,
    priceInfo,
    currentPriceListGroup,
    shippingGroups,
    currentOrder,
    numberOfItems,
    commerceItems,
    isUserLoggedIn,
    isGetCartInProgress
  };
};
