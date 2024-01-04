/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getOrder, getPage} from '@oracle-cx-commerce/commerce-utils/selector';

export const getOrderData = state => {
  const {contextId} = getPage(state);
  const [_, orderId] = contextId.split('-');
  const order = getOrder(state, {id: orderId});

  return {
    orderId,
    order
  };
};
