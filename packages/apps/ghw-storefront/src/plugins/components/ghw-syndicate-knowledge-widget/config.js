import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';
// import * as resources from '../../../core/ui/locales';

import * as resources from '@oracle-cx-commerce/resources';

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
      id: 'configIncludeExtraInfo',
      /**
       * Supported config types:
       *  - stringType
       *  - booleanType
       *  - optionType
       *  - multiSelectOptionType
       *  - sectionTitleType
       *  - collectionType
       *  - mediaType
       */
      type: 'booleanType',
      defaultValue: false,
      labelResourceId: 'includeExtraInfoLabel',
      helpTextResourceId: 'includeExtraInfoHelpText'
    }
  ],
  locales: buildConfigResources(resources, resourceKeys)
};

export default config;
