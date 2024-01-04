import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import config from '@oracle-cx-commerce/react-widgets/product/product-long-description/config';

const widgetResourceKeys = ['actionDescriptionViewProductInfo'];

export default {
  name: 'GHWProductLongDescription',
  decription: 'Description of widget GHWProductLongDescription',
  author: 'VirendraPatil',
  fetchers: [],
  actions: [],
  packageId: '@oracle-cx-commerce/react-widgets',
  resources: buildResources(resourceBundle, widgetResourceKeys),
  config: mergeDefaultConfig(config),
  requiresContext: ['product_context']
};
