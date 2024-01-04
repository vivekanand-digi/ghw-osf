import {useEffect} from 'react';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {getWidgetInfoEntity} from '../../selectors';
import {useInitializeWidget} from '..';

/**
 * This hook will invoke the useInitializeWidget if the currency
 * list is not already available in the application state.
 */
export default store =>
  useEffect(() => {
    // Detects if the site was populated in the state during server-side rendering
    if (isEmptyObject(getWidgetInfoEntity(store.getState(), {entityName: 'clientToken'}))) {
      useInitializeWidget(store);
    }
  }, [store]);
