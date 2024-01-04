/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';

const configResourceKeys = ['configContinueToPageAddressHelpText', 'configContinueToPageAddressLabel'];

const config = {
  properties: [
    {
      id: 'continueToPageAddress',
      type: 'stringType',
      defaultValue: '/checkout-review-order',
      labelResourceId: 'configContinueToPageAddressLabel',
      helpTextResourceId: 'configContinueToPageAddressHelpText',
      required: true
    }
  ],
  locales: buildConfigResources(resourceBundle, configResourceKeys)
};

export default config;
