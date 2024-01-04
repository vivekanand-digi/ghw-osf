import {isAuthenticated, getPage, getCurrentProfileId} from '@oracle-cx-commerce/commerce-utils/selector';
import {getSavedPayments} from '../../../selectors/shopper-profile-selector';

export const getPageData = state => {
  const savedPaymentId = getPage(state).contextId;

  return {
    savedPaymentId,
    isUserLoggedIn: isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous',
    profileSavedCards: getSavedPayments(state)
  };
};
