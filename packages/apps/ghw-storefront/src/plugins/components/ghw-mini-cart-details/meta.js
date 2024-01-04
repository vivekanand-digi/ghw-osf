import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import config from './config';

const widgetResourceKeys = [
  'messageDuplicateCoupon',
  'textApplyPromoCode',
  'lablePromoCode',
  'actionApply',
  'messageEmptyCoupon'
];

export default {
  name: 'GHWMiniCartDetails',
  decription: 'Description of widget GHWCartDetails',
  author: 'APEX IT',
  fetchers: [],
  actions: [],
  /**
   * Include references to all of our resource strings in all supported locales.
   * This will enable the component to access any resource string via its props,
   * using the locale that is currently in effect.
   */
  resources: buildResources(resourceBundle, widgetResourceKeys),
  /**
   *  Specify configuration properties for use in Design Studio.
   */
  config: mergeDefaultConfig(config)
};
