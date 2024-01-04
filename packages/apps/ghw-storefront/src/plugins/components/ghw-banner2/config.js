import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';
import * as resources from '../../../core/ui/locales';

/**
 * The list below declares which of the locale resources should be made available to the widget
 */
const resourceKeys = ['includeExtraInfoLabel', 'includeExtraInfoHelpText'];

/**
 * Design Studio configuration properties for the WidgetName component.
 */
const config = {
  properties: [
    {
      id: 'title',
      type: 'stringType',
      labelResourceId: 'includeExtraInfoLabel',
      helpTextResourceId: 'includeExtraInfoHelpText'
    },
    {
      id: 'backgroundImg',
      type: 'mediaType',
      labelResourceId: `slideMediaLabel`,
      required: false
    },
    {
      id: 'subtitle',
      type: 'stringType',
      labelResourceId: 'includeExtraInfoLabel',
      helpTextResourceId: 'includeExtraInfoHelpText'
    }
  ],
  locales: buildConfigResources(resources, resourceKeys)
};

export default config;
