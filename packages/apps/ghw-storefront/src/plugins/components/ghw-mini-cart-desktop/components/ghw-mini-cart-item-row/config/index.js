import * as en from './locales/en';
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
  locales: {
    en: {
      resources: en
    }
  }
};

export default config;
