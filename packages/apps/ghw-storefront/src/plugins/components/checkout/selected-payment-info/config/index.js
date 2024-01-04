import * as en from './locales/en';
/**
 * Design Studio configuration properties for the WidgetName component.
 */
const config = {
  properties: [
    {
      id: 'showEditLink',
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
      labelResourceId: 'showEditLinkLabel',
      helpTextResourceId: 'showEditLinkHelpText'
    }
  ],
  locales: {
    en: {
      resources: en
    }
  }
};

export default config;
