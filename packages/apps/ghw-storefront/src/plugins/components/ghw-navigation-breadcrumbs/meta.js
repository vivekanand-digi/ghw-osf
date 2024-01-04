/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';

import {buildResources} from '@oracle-cx-commerce/resources/utils';
import config from './config';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';

const widgetResourceKeys = [
  'breadcrumbLinkText1',
  'breadcrumbLinkText2',
  'breadcrumbLinkText3',
  'breadcrumbLinkText4',
  'breadcrumbLinkText5',
  'breadcrumbSeparator',
  'actionHome',
  'actionYourAccount',
  'actionOrderHistory',
  'actionWishLists',
  'actionScheduledOrders',
  'actionPurchaseLists',
  'actionAccountContacts',
  'actionRegistrationRequests'
];

export default {
  packageId: '@oracle-cx-commerce/react-widgets',
  config: mergeDefaultConfig(config),
  resources: buildResources(resourceBundle, widgetResourceKeys)
};
