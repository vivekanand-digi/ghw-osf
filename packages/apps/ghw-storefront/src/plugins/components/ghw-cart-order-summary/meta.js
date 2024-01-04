import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import * as resourceBundle from '@oracle-cx-commerce/resources';
import config from './config';

// import config from '@oracle-cx-commerce/react-widgets/cart/cart-order-summary/config';
// import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';

/**
 * The list below declares which of the locale resources should be made available to the widget
 */
const widgetResourceKeys = [
  'headingOrderSummary',
  'textExcludingTax',
  'textFree',
  'textGiftCardBalance',
  'textIncludingTax',
  'textOrderDiscounts',
  'textShipping',
  'textShippingDiscount',
  'textShippingSurcharge',
  'textSubtotal',
  'textTax',
  'textTotal',
  'textRemainingTotal',
  'textGiftCard',
  'labelPayInStore',
  'labelInvoice',
  'textOrderSummaryGiftCard',
  'textPriceChangeMessage',
  'textConditionalTotal'
];

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
  name: 'GHWCartOrderSummary',
  decription: 'Description of widget GHWCartOrderSummary',
  author: 'VirendraPatil',
  fetchers: [],
  actions: [],
  resources: buildResources(resourceBundle, widgetResourceKeys),
  config: mergeDefaultConfig(config),
  availableToAllPages: false,
  pageTypes: ['cart', 'checkout-loing', 'checkout-shipping', 'checkout-payment', 'checkout-review-order']
};
