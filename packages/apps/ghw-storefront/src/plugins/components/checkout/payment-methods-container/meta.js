import * as en from './locales/en';
import defaultConfig from '@oracle-cx-commerce/react-widgets/config';

/**
 * Different examples on how to import a config object.
 */
// import config from './config';
// import defaultConfig from '@oracle-cx-commerce/react-widgets/config';
// import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';

/**
 * Metadata for the widget.
 */
export default {
  name: 'PaymentMethodsContainer',
  decription: 'Braintree payment methods container',
  type: 'container',
  fetchers: [],
  actions: [],
  /**
   * Include references to all of our resource strings in all supported locales.
   * This will enable the component to access any resource string via its props,
   * using the locale that is currently in effect.
   */
  resources: {
    en
  },
  /**
   *  Specify configuration properties for use in Design Studio.
   */
  config: defaultConfig,
  providesContext: ['cart_context']
};
