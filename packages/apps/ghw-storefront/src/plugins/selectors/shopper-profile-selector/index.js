/**
 * Selector to extract repositories from a state object.
 */
export const getShopperProfileRepository = state => state.shopperProfileRepository || {};

/**
 * Selector to extract repositories.tables from a state object.
 */
export const getShopperProfile = state => getShopperProfileRepository(state).profile || {};

export const getShopperSubscription = state => getShopperProfileRepository(state).subscription || {};

export const getCreditCards = state => getShopperProfile(state).creditCards || [];

export const getSavedPayments = state => getShopperProfile(state).paymentMethods || [];

export const getSubscriptionsFromPaymentMethods = state =>
  getSavedPayments(state)
    .reduce((acc, item) => {
      const hasSubscriptionKey = Object.prototype.hasOwnProperty.call(item, 'subscriptions');

      return [...acc, ...(hasSubscriptionKey ? item.subscriptions : [])];
    }, [])
    .filter(({status}) => status === 'Active');
