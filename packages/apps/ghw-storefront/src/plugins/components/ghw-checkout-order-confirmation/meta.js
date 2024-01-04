import defaultConfig from '@oracle-cx-commerce/react-widgets/config';
import * as en from './locales/en';

export default {
  name: 'GHWCheckoutOrderConfirmation',
  decription: 'Description of widget GHWCheckoutOrderConfirmation',
  author: 'VirendraPatil',
  fetchers: [],
  actions: [],
  resources: {
    en
  },
  packageId: '@oracle-cx-commerce/react-widgets',
  config: defaultConfig,
  pageTypes: ['checkout-order-confirmation'],
  requiresContext: ['container_context']
};
