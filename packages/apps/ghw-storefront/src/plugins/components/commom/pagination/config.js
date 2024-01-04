/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';

const configResourceKeys = ['configTextPaginationMode', 'configNumberOfpagesToShowBesideCurrentPage'];

const config = {
  properties: [
    {
      id: 'paginationMode',
      type: 'stringType',
      labelResourceId: 'configTextPaginationMode',
      defaultValue: 'standard',
      pattern: 'standard$|basic$|dropdown$|text$'
    },
    {
      id: 'pagesToShowBesideCurrentPage',
      type: 'stringType',
      labelResourceId: 'configNumberOfpagesToShowBesideCurrentPage',
      defaultValue: '1',
      pattern: '^[0-9]*$'
    }
  ],
  locales: buildConfigResources(resourceBundle, configResourceKeys)
};

export default config;
