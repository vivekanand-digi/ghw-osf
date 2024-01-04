/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getProfileShippingAddresses,
  getContactInfos,
  getDefaultShippingAddressId
} from '@oracle-cx-commerce/commerce-utils/selector';

export const getComponentData = state => {
  const shippingAddressIds = getProfileShippingAddresses(state);
  const contactInfos = getContactInfos(state);
  const shippingAddress = getDefaultShippingAddressId(state);

  return {
    shippingAddressIds,
    contactInfos,
    shippingAddress
  };
};
