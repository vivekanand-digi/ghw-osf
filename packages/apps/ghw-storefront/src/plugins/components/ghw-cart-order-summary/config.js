import * as resourceBundle from '@oracle-cx-commerce/resources';

import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';

const configResourceKeys = ['configDisplayOrderDiscountsListLabel', 'configDisplayOrderDiscountsListHelpText'];

const config = {
  properties: [
    {
      id: 'displayOrderDiscountsList',
      type: 'booleanType',
      labelResourceId: 'configDisplayOrderDiscountsListLabel',
      defaultValue: false,
      helpTextResourceId: 'configDisplayOrderDiscountsListHelpText'
    }
  ],
  locales: buildConfigResources(resourceBundle, configResourceKeys)
};

export default config;
