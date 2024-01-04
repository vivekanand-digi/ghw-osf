/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {
  isAuthenticated,
  getBillingCountries,
  getCurrentProfileId,
  getCurrentSiteId,
  getShippingCountries,
  getSite,
  isCurrentUserB2B
} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';

export const getPageData = state => {
  const getBraintreeRepository = state => state.braintreeRepository || {};
  const getWidgetInfo = state => getBraintreeRepository(state).widgetInfo || {};
  const getBasicAuth = state => getWidgetInfo(state)['basicAuth'] || undefined;
  const shippingCountries = getShippingCountries(state);
  const billingCountries = getBillingCountries(state);
  const siteId = getCurrentSiteId(state) || undefined;
  const profileId = getCurrentProfileId(state);

  return {
    clientToken: getWidgetInfo(state).clientToken,
    isUserLoggedIn: isAuthenticated(state) && profileId !== 'anonymous',
    isB2BUser: isCurrentUserB2B(state),
    billingCountries: !isEmptyObject(billingCountries) ? billingCountries : undefined,
    defaultBillingCountryCode: getSite(state).defaultBillingCountryId,
    basicAuth: getBasicAuth(state) || undefined,
    siteId,
    shippingCountries
  };
};
