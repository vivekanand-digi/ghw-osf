import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import config from './config';

export default {
  name: 'ProductPayPalPaymentButton',
  decription: 'PayPal payment widget in product page',
  author: 'wes',
  fetchers: [],
  actions: [],
  /**
   *  Specify configuration properties for use in Design Studio.
   */
  config: mergeDefaultConfig(config)
};
