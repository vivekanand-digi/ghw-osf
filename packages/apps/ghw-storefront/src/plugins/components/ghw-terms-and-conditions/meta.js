import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import * as resources from '../../../core/ui/locales';
import config from './config';

/**
 * The list below declares which of the locale resources should be made available to the widget
 */
const resourceKeys = ['helloText', 'labelExtraInfo', 'labelSampleTranslation'];

export default {
  name: 'GHWTermsAndConditions',
  decription: 'Description of widget GHWTermsAndConditions',
  author: 'AC',
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
