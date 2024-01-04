import {mobileConfig, desktopConfig} from './config'
import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import * as en from './locales/en';

const widgetResourceKeys = [
  'headingMiniShoppingCart',
  'actionCheckout',
  'actionContinueShopping',
  'actionViewCart',
  'closeLinkAltText',
  'alertAddedToCart',
  'alertPriceUnavailable',
  'headingYourCart',
  'textQuantity',
  'textFreeGift',
  'textFree',
  'textSubtotal',
  'textPreOrderable',
  'textBackOrderable',
  'messageStatusPreOrder',
  'messageStatusBackOrder',
  'messageAtTheRate'
];

const resources = buildResources(resourceBundle, widgetResourceKeys);
resources['en'] = {
  ...resources['en'],
  ...en
};

export const MiniCartPayPalDesktop = {
  resources,
  config: desktopConfig
};

export const MiniCartPayPalMobile = {
  resources,
  config: mobileConfig
};
