import {createFetcher} from '@oracle-cx-commerce/fetchers/factory';
import {getCurrentProfileId, isAuthenticated, getCurrentSiteId} from '@oracle-cx-commerce/commerce-utils/selector';
import {getWidgetInfoEntity} from '../../selectors/braintree-selector';

/*
 * Function to make the endpoints call(s).
 *
 * Unsuccessful fetcher calls should not be memoized. Return the (significant) response object
 * from the fetcher so the memoizer can determine if the execution was successful, i.e. 'response.ok'.
 *
 * Populates state with shopper custom properties during server-side rendering
 */
export const fetcher = store => {
  const state = store.getState();
  if (isAuthenticated(state)) {
    return store.endpoint('retrieveShopperProfile', {
      profileId: getCurrentProfileId(state),
      site: getCurrentSiteId(state),
      basicAuth: getWidgetInfoEntity(state, {entityName: 'basicAuth'})
    });
  }
  return false;
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
