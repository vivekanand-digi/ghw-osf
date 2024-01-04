import {isAuthenticated, getPage, getCurrentProfileId} from '@oracle-cx-commerce/commerce-utils/selector';

export const getPageData = state => {
  const subscriptionId = getPage(state).contextId;
  // eslint-disable-next-line no-unused-vars
  const [_, orderId] = subscriptionId.split('-');

  return {
    isUserLoggedIn: isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous',
    orderId,
    subscriptionId
  };
};
