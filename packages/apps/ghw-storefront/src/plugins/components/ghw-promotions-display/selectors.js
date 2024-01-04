/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getCurrentOrder} from '@oracle-cx-commerce/commerce-utils/selector';

export const getComponentData = state => {
  const {discountInfo = {}} = getCurrentOrder(state);
  const {orderCouponsMap = {}, orderImplicitDiscountList = []} = discountInfo;

  return {
    orderCouponsMap,
    orderImplicitDiscountList
  };
};
