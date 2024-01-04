
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';

import config from './config';

const widgetResourceKeys = ['teammember1Label','teammember2Label','teammember3Label','role1Label','role2Label','role3Label','image1label','image2label','image3label'];
/**
 * The list below declares which of the locale resources should be made available to the widget
 */


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
  name: 'GHWBrandAmbassador',
  decription: 'Description of widget GHWBrandAmbassador',
  author: 'AC',
  fetchers: [],
  actions: [],
  /**
   * Include references to all of our resource strings in all supported locales.
   * This will enable the component to access any resource string via its props,
   * using the locale that is currently in effect.
   */
  /**
   *  Specify configuration properties for use in Design Studio.
   */
  config: mergeDefaultConfig(config)
};
