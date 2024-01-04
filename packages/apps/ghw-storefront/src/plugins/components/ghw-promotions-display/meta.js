import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
// import * as resourceBundle from '@oracle-cx-commerce/resources';
import * as resources from '../../../core/ui/locales';
import config from './config';

/**
 * The list below declares which of the locale resources should be made available to the widget
 */
const resourceKeys = ['actionRemove', 'messagePromoApplied', 'messagePromoOffer'];

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
  name: 'GHWPromotionsDisplay',
  decription: 'Description of widget GHWPromotionsDisplay',
  author: 'VirendraPatil',
  fetchers: [],
  actions: ['removeCouponsFromCart'],
  /**
   * Include references to all of our resource strings in all supported locales.
   * This will enable the component to access any resource string via its props,
   * using the locale that is currently in effect.
   */
  resources: buildResources(resources, resourceKeys),
  // resources: buildResources(resourceBundle, resourceKeys),
  /**
   *  Specify configuration properties for use in Design Studio.
   */
  config: mergeDefaultConfig(config)
};
