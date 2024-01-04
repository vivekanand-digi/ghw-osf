import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';

const configResourceKeys = [
  'configCollapsedText',
  'configExpandedText',
  'configGiftCardDefaultStateHelpText',
  'configGiftCardDefaultStateLabel'
];
const config = {
  properties: [
    {
      id: 'showApplyPromoInput',
      type: 'optionType',
      labelResourceId: 'configGiftCardDefaultStateLabel',
      helpTextResourceId: 'configGiftCardDefaultStateHelpText',
      defaultValue: 'false',
      options: [
        {
          id: 'collapsed',
          value: 'false',
          labelResourceId: 'configCollapsedText'
        },
        {
          id: 'expanded',
          value: 'true',
          labelResourceId: 'configExpandedText'
        }
      ],
      required: false
    }
  ],
  locales: buildConfigResources(resourceBundle, configResourceKeys)
};

export default config;
