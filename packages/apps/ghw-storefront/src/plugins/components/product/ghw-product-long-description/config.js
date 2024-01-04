/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';

const configResourceKeys = ['configDescriptionExpandedHelpText', 'configDescriptionExpandedLabel'];

const config = {
  properties: [
    {
      id: 'descriptionExpanded',
      type: 'booleanType',
      name: 'descriptionExpanded',
      helpTextResourceId: 'configDescriptionExpandedHelpText',
      labelResourceId: 'configDescriptionExpandedLabel',
      defaultValue: false
    }
  ],
  locales: buildConfigResources(resourceBundle, configResourceKeys)
};

export default config;
