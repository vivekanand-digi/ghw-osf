import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import config from '@oracle-cx-commerce/react-widgets/product/product-add-to-cart-button/config';

const widgetResourceKeys = [
  'actionCheckout',
  'actionContinueShopping',
  'actionViewCart',
  'closeLinkAltText',
  'alertAddedToCart',
  'actionAddToCart',
  'alertAddToCartAdded',
  'alertAddToCartAdding',
  'actionAddToCartPreOrder',
  'alertPriceUnavailable',
  'alertTotalItemQuantityExceeded',
  'textSuccessGiftMessage',
  'textFailureGiftMessage'
];

export default {
  name: 'GHWProductAddToCartButton',
  decription: 'Description of widget GHWProductAddToCartButton',
  author: 'VirendraPatil',
  fetchers: [],
  actions: [],
  resources: buildResources(resourceBundle, widgetResourceKeys),
  config: mergeDefaultConfig(config),
  requiresContext: ['container_context', 'product_context']
};
