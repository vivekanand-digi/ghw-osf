
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';

import config from './config';

const widgetResourceKeys = ['SRPContentLabel','SRPLinkLabel'];
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
  name: 'GHWStandardReturnPolicy',
  decription: 'Description of widget GHWStandardReturnPolicy',
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
