import {createFetcher} from '@oracle-cx-commerce/fetchers/factory';
import {getCurrentSiteId} from '@oracle-cx-commerce/commerce-utils/selector';

const createOrderRequest = o => {
  const shoppingCart = {items: []};
  let shippingAddress = {};
  let billingAddress = {};
  for (const orderId of Object.keys(o.orders)) {
    const {commerceItems, shippingGroups} = o.orders[orderId];
    for (const itemId of Object.keys(commerceItems)) {
      const commerceItem = commerceItems[itemId];
      const {productId, quantity, catRefId, giftWithPurchaseCommerceItemMarkers, externalData, commerceItemId} =
        commerceItem;
      shoppingCart.items.push({
        productId,
        quantity,
        catRefId,
        giftWithPurchaseCommerceItemMarkers,
        externalData,
        commerceItem
      });
    }
    for (const shippingGroupId of Object.keys(shippingGroups)) {
      const shippingGroup = shippingGroups[shippingGroupId];
      shippingAddress = {...shippingGroup.shippingAddress};
      billingAddress = {...shippingGroup.shippingAddress};
    }
  }
  return {
    shoppingCart,
    appliedPromotions: [],
    isAnonymousCheckout: true,
    combineLineItems: 'yes',
    shippingAddress,
    billingAddress,
    payments: [{type: 'generic'}],
    placeAsyncOrder: false,
    giftWithPurchaseOrderMarkers: []
  };
};

/*
 * Function to make the endpoints call(s).
 *
 * Unsuccessful fetcher calls should not be memoized. Return the (significant) response object
 * from the fetcher so the memoizer can determine if the execution was successful, i.e. 'response.ok'.
 *
 * Populates state with shopper custom properties during server-side rendering
 */
export const fetcher = store => {
  // get data from state
  // const order = store.getState().OrdersRepository
  // pass arg to endpoint call
  // store.endpoint('initiateOder', orderData)
  const fullState = store.getState();
  console.log(`####################### initialize-widget fetcher #####################`, fullState);

  const siteId = getCurrentSiteId(fullState);
  store.endpoint('initializeBraintree', {site: siteId});
  store.endpoint('getPaymentConfigurations');
};

/*
 * Executing fetcher functions is expensive. To ensure fetchers are not executed unnecessarily
 * their results are memoized. The memoized values are recomputed ONLY when a value in the
 * specified dependency array changes. To specify the dependencies you must provide a selector
 * that returns an array of values from the state. The 'getDependencies' selector must ALWAYS
 * return dependency values in the same order--so they can be compared to the previous dependencies.
 * Providing no 'getDependencies' selector will cause the fetcher to run ONE TIME ONLY--as there
 * are no dependencies to trigger re-computation.
 */
export const getDependencies = state => [];

/*
 * Create memoized fetcher
 */
export default createFetcher(fetcher, getDependencies);
