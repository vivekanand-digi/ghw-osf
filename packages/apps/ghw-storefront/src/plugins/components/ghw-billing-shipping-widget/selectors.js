/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getOrder,
  getPage,
  getCurrentOrder,
  getCurrentProfileId,
  getCartEndpointStatus,
  getEndpointStatus,
  getProfile,
  isAuthenticated,
  isCurrentUserB2B,
  getContactInfos,
  getRolesForProfile,
  getShippingCountries,
  getSite,
  hasCartItemsFromMultipleSites
} from '@oracle-cx-commerce/commerce-utils/selector';

export const getComponentData = state => {
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  const isGetCartInProgress = getCartEndpointStatus(state);
  const orderId = getPage(state).contextId;
  const currentOrder = orderId ? getOrder(state, {id: orderId}) : getCurrentOrder(state);
  const currentProfile = getProfile(state);
  const contactInfos = getContactInfos(state);
  const isB2BUser = isCurrentUserB2B(state);
  const roles = getRolesForProfile(state);
  const shippingCountries = getShippingCountries(state);
  const defaultShippingCountry = getSite(state).defaultShippingCountryId;
  const displayCartItemSiteInfo = hasCartItemsFromMultipleSites(state, {commerceItems: currentOrder.commerceItems});
  const isGetPriceCartInProgress = getEndpointStatus(state).priceCart
    ? getEndpointStatus(state).priceCart.inProgress
    : -1;

  return {
    isUserLoggedIn,
    currentProfile,
    currentOrder,
    isGetCartInProgress,
    isB2BUser,
    contactInfos,
    roles,
    shippingCountries,
    defaultShippingCountry,
    isGetPriceCartInProgress,
    displayCartItemSiteInfo
  };
};
