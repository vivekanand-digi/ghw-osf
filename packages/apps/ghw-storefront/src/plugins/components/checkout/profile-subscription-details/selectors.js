/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {getCurrentProfileId, getPage, isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';
import {getSubscriptionsFromPaymentMethods} from '../../../selectors/shopper-profile-selector';

import mockProfileState from '../profile-recurring-payment-subscriptions';

export const getPageData = state => {
  const mockShopperProfileState = {
    ...state,
    shopperProfileRepository: {
      profile: mockProfileState
    }
  };
  const subscriptionId = getPage(state).contextId;
  const subscriptionList = getSubscriptionsFromPaymentMethods(state) || [];
  const subscriptionDetails = subscriptionList.find(({id}) => id === subscriptionId) || {};

  return {
    isUserLoggedIn: isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous',
    subscriptionId,
    subscriptionDetails
  };
};
