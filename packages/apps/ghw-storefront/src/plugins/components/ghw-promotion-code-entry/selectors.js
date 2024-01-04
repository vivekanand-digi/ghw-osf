/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getCurrentOrder} from '@oracle-cx-commerce/commerce-utils/selector';

export const getComponentData = state => {
  const {discountInfo = {}, commerceItems = {}} = getCurrentOrder(state);
  const {orderCouponsMap = {}, orderImplicitDiscountList = []} = discountInfo;

  let coupons = [];
  if (orderCouponsMap) {
    coupons = Object.keys(orderCouponsMap);
  }
  if (orderImplicitDiscountList.length > 0) {
    orderImplicitDiscountList.forEach(coupon => {
      coupons.push(coupon.promotionName);
    });
  }

  return {
    coupons,
    displayPromoCodeEntry: Object.keys(commerceItems).length > 0
  };
};
