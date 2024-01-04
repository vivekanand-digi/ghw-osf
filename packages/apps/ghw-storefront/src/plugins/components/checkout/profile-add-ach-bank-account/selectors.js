/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  isAuthenticated,
  isCurrentUserB2B,
  getCurrentProfileId,
  getBillingCountries,
  getProfile,
  getSite,
  getShippingCountries,
  getCurrentSiteId,
  getPage
} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {getSavedPayments} from '../../../selectors/shopper-profile-selector';
import {compareSavedPayments} from '../helpers/saved-payment-comparer';

export const getPageData = state => {
  const getBraintreeRepository = state => state.braintreeRepository || {};
  const getWidgetInfo = state => getBraintreeRepository(state).widgetInfo || {};
  const getBasicAuth = state => getWidgetInfo(state)['basicAuth'] || undefined;
  const shippingCountries = getShippingCountries(state);
  const billingCountries = getBillingCountries(state);
  const currentProfile = getProfile(state);
  const siteId = getCurrentSiteId(state) || undefined;
  const profileId = getCurrentProfileId(state);
  const savedPaymentId = getPage(state).contextId || undefined;
  const savedPayments = getSavedPayments(state).sort(compareSavedPayments) || [];
  const selectedSavedAccount = savedPayments.find(item => item.token === savedPaymentId) || {};

  return {
    clientToken: getWidgetInfo(state).clientToken,
    isUserLoggedIn: isAuthenticated(state) && profileId !== 'anonymous',
    isB2BUser: isCurrentUserB2B(state),
    billingCountries: !isEmptyObject(billingCountries) ? billingCountries : undefined,
    defaultBillingCountryCode: getSite(state).defaultBillingCountryId,
    basicAuth: getBasicAuth(state) || undefined,
    siteId,
    currentProfile,
    shippingCountries,
    profileId,
    selectedSavedAccount
  };
};
