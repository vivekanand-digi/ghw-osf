/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getContactInfos,
  getDefaultShippingAddressId,
  getEndpointStatus,
  getProfileShippingAddresses,
  getCurrentProfileId,
  isAuthenticated
} from '@oracle-cx-commerce/commerce-utils/selector';

export const getComponentData = state => {
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  const contactInfos = getContactInfos(state);
  const isGetProfileAddressInProgress = getEndpointStatus(state).getCurrentProfile
    ? getEndpointStatus(state).getCurrentProfile.inProgress
    : 1;
  const defaultShippingAddressId = getDefaultShippingAddressId(state);
  const shippingAddressIds = getProfileShippingAddresses(state);

  return {
    isUserLoggedIn,
    contactInfos,
    defaultShippingAddressId,
    isGetProfileAddressInProgress,
    shippingAddressIds
  };
};
