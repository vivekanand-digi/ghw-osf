/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';

const configResourceKeys = ['configDefaultLoginSuccessPageLabel', 'configDefaultLoginSuccessPageHelpText'];

const config = mergeDefaultConfig({
  properties: [
    {
      id: 'defaultLoginSuccessPage',
      type: 'stringType',
      labelResourceId: 'configDefaultLoginSuccessPageLabel',
      helpTextResourceId: 'configDefaultLoginSuccessPageHelpText'
    }
  ],
  locales: buildConfigResources(resourceBundle, configResourceKeys)
});
export default config;
