import {useEffect} from 'react';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {getShopperProfile} from '../../selectors';
import {useShopperProfileFetcher} from '..';

/**
 * This hook will invoke the useShopperProfileFetcher if the currency
 * list is not already available in the application state.
 */
export default store =>
  useEffect(() => {
    // Detects if the site was populated in the state during server-side rendering
    if (isEmptyObject(getShopperProfile(store.getState()))) {
      useShopperProfileFetcher(store);
    }
  }, [store]);
