/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {
  isCurrentUserB2B,
  getBillingCountries,
  getContactInfos,
  getCurrentOrganizationId,
  getDefaultShippingAddressId,
  getOrganizations,
  getProfile,
  getRolesForProfile,
  getSite
} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {isCountryValidBillingCountry} from '@oracle-cx-commerce/react-components/utils/payment';

export const getBillingAddressData = state => {
  const billingCountries = getBillingCountries(state);
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
  } else if (defaultShippingAddressId) {
    // If there is default shipping address and the country is a valid billing country
    const defaultShippingAddress = contactInfos[defaultShippingAddressId];
    if (isCountryValidBillingCountry(defaultShippingAddress.country, billingCountries)) {
      defaultAddress = defaultShippingAddress;
    }
  }

  return {
    //an empty object is always treated as new object and causes render of widget so explicitly
    //check if billingCountries is not empty object then only return it otherwise return undefined
    billingCountries: !isEmptyObject(billingCountries) ? billingCountries : undefined,
    defaultBillingCountryCode: getSite(state).defaultBillingCountryId,
    defaultAddress,
    isB2BUser: isCurrentUserB2B(state),
    currentProfile,
    roles
  };
};
