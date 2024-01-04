import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import defaultConfig from '@oracle-cx-commerce/react-widgets/config';

const widgetResourceKeys = [
  'labelProductQuantity',
  'textMaxOrderQtyExceeded',
  'textMinOrderQtyRequired',
  'alertTotalItemQuantityExceeded'
];

export default {
  name: 'GHWProductQuantity',
  decription: 'Description of widget GHWProductQuantity',
  author: 'VirendraPatil',
  fetchers: [],
  actions: [],
  packageId: '@oracle-cx-commerce/react-widgets',
  resources: buildResources(resourceBundle, widgetResourceKeys),
  config: defaultConfig,
  requiresContext: ['product_context', 'container_context']
};
