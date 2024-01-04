/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {getCurrentProfileId, isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';
import {getWidgetInfo} from '../../../selectors';

import {
  getShopperProfileRepository,
  getSubscriptionsFromPaymentMethods
} from '../../../selectors/shopper-profile-selector';

export const getPageData = state => {
  const {clientToken} = getWidgetInfo(state);

  return {
    isUserLoggedIn: isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous',
    subscriptionList: getSubscriptionsFromPaymentMethods(state) || [],
    billingFrequency: getShopperProfileRepository(state).subscription,
    clientToken
  };
};
