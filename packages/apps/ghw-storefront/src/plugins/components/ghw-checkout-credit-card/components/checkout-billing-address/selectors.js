/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {
  getBillingCountries,
  getContactInfos,
  getDefaultShippingAddressId,
  getCurrentOrder,
  getSite,
  isAuthenticated,
  isCurrentUserB2B,
  getProfile,
  getRolesForProfile,
  getCurrentOrganizationId,
  getOrganizations,
  getPage,
  getOrder
} from '@oracle-cx-commerce/commerce-utils/selector';
import {SHIPPING_GROUP_HARDGOOD} from '@oracle-cx-commerce/commerce-utils/constants';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {isCountryValidBillingCountry} from '@oracle-cx-commerce/react-components/utils/payment';

export const getBillingAddressData = state => {
  const billingCountries = getBillingCountries(state);
  const contextOrderId = getPage(state).contextId;
  const currentOrder = contextOrderId ? getOrder(state, {id: contextOrderId}) : getCurrentOrder(state);

  const {shippingGroups = {}} = currentOrder;
  const currentProfile = getProfile(state);
  const roles = getRolesForProfile(state);

  const currentOrganization = getOrganizations(state)[getCurrentOrganizationId(state)] || {};
  // If there is a current organization set the default shipping/billing address according to the organization
  const defaultShippingAddressId = !isEmptyObject(currentOrganization)
    ? currentOrganization.shippingAddress
    : getDefaultShippingAddressId(state);
  const defaultBillingAddressId = !isEmptyObject(currentOrganization) ? currentOrganization.billingAddress : undefined;
  const contactInfos = getContactInfos(state);

  // get defaultAddress of the user
  let defaultAddress = {};
  // If there is a default billing address take the default billing address
  if (defaultBillingAddressId) {
    defaultAddress = contactInfos[defaultBillingAddressId];
  } else {
    // If there is default shipping address and the country is a valid billing country
    if (defaultShippingAddressId) {
      const defaultShippingAddress = contactInfos[defaultShippingAddressId];
      if (isCountryValidBillingCountry(defaultShippingAddress.country, billingCountries)) {
        defaultAddress = defaultShippingAddress;
      }
    }

    // If the default address is still not populated, take the shipping group's shipping address
    // if the shipping country is a valid billing country
    if (isEmptyObject(defaultAddress) && Object.keys(shippingGroups).length) {
      const shippingGroup = shippingGroups[Object.keys(shippingGroups)[0]];
      if (shippingGroup.type === SHIPPING_GROUP_HARDGOOD) {
        const shippingGroupAddress = shippingGroup.shippingAddress;
        if (isCountryValidBillingCountry(shippingGroupAddress.country, billingCountries)) {
          defaultAddress = shippingGroupAddress;
        }
      }
    }
  }

  return {
    billingCountries: !isEmptyObject(billingCountries) ? billingCountries : undefined,
    defaultAddress,
    defaultBillingCountry: getSite(state).defaultBillingCountryId,
    isUserLoggedIn: isAuthenticated(state),
    isB2BUser: isCurrentUserB2B(state),
    currentProfile,
    roles
  };
};
