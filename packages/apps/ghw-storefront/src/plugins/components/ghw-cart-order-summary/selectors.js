/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getCurrencyCode,
  getCurrentOrder,
  getCurrentPriceListGroup,
  getOrder,
  getPage
} from '@oracle-cx-commerce/commerce-utils/selector';

export const getOrderData = state => {
  const contextOrderId = getPage(state).contextId;
  const currentOrder = contextOrderId ? getOrder(state, {id: contextOrderId}) : getCurrentOrder(state);

  const currentPriceListGroup = getCurrentPriceListGroup(state);
  const currencyCode = getCurrencyCode(state);

  return {
    currentOrder,
    currentPriceListGroup,
    currencyCode
  };
};
