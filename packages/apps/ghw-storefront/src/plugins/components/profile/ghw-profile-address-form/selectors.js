/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getShippingCountries,
  getContactInfos,
  getCurrentPageId,
  isCurrentUserB2B,
  getDefaultShippingAddressId
} from '@oracle-cx-commerce/commerce-utils/selector';

export const getComponentData = state => {
  const shippingCountries = getShippingCountries(state);
  const contactInfos = getContactInfos(state);
  const currentPageId = getCurrentPageId(state);
  const isB2BUser = isCurrentUserB2B(state);
  const defaultShippingAddressId = getDefaultShippingAddressId(state);

  return {
    shippingCountries,
    contactInfos,
    currentPageId,
    isB2BUser,
    defaultShippingAddressId
  };
};
