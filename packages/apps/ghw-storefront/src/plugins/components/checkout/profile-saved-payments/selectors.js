/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {getCurrentProfileId, isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';
import {getSavedPayments} from '../../../selectors/shopper-profile-selector';
import {compareSavedPayments} from '../helpers/saved-payment-comparer';
import {getWidgetInfo} from '../../../selectors';

export const getPageData = state => {
  const {clientToken} = getWidgetInfo(state);

  return {
    isUserLoggedIn: isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous',
    savedPaymentList: getSavedPayments(state).sort(compareSavedPayments) || [],
    clientToken
  };
};
