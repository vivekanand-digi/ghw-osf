import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import config from '@oracle-cx-commerce/react-widgets/cart/promotion-code-entry/config';

const widgetResourceKeys = [
  'messageDuplicateCoupon',
  'textApplyPromoCode',
  'lablePromoCode',
  'actionApply',
  'messageEmptyCoupon'
];
export default {
  name: 'GHWPromotionCodeEntry',
  decription: 'Description of widget GHWPromotionCodeEntry',
  author: 'VirendraPatil',
  fetchers: [],
  resources: buildResources(resourceBundle, widgetResourceKeys),
  config: mergeDefaultConfig(config),
  actions: ['applyCouponsToCart']
};
