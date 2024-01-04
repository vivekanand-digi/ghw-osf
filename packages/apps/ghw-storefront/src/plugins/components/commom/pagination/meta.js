/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';

import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';

import config from '@oracle-cx-commerce/react-widgets/common/pagination/config';

const widgetResourceKeys = [
  'labelPageOfPages',
  'labelPageOfPagesDropdown',
  'labelPaginationDropDown',
  'labelPreviousPage',
  'labelNextPage',
  'labelFirstPage',
  'labelLastPage'
];

export const Pagination = {
  packageId: '@oracle-cx-commerce/react-widgets',
  resources: buildResources(resourceBundle, widgetResourceKeys),
  config: mergeDefaultConfig(config),
  actions: ['search'],
  requiresContext: ['pagination_context']
};
