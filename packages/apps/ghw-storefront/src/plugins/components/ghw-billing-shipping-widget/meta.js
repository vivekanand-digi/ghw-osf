import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import * as resources from '../../../core/ui/locales';
import config from './config';

/**
 * The list below declares which of the locale resources should be made available to the widget
 */
const resourceKeys = ['helloText', 'labelExtraInfo', 'labelSampleTranslation'];

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
  name: 'GHWBillingShippingWidget',
  decription: 'Description of widget GHWBillingShippingWidget',
  author: 'VirendraPatil',
  fetchers: [],
  actions: [],
  /**
   * Include references to all of our resource strings in all supported locales.
   * This will enable the component to access any resource string via its props,
   * using the locale that is currently in effect.
   */
  resources: buildResources(resources, resourceKeys),
  /**
   *  Specify configuration properties for use in Design Studio.
   */
  config: mergeDefaultConfig(config)
};
