/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';

import {buildResources} from '@oracle-cx-commerce/resources/utils';
import defaultConfig from '@oracle-cx-commerce/react-widgets/config';

const widgetResourceKeys = [
  'actionCancel',
  'actionSave',
  'alertUpdatePasswordSuccessful',
  'alertPasswordsDoNotMatch',
  'headingUpdatePassword',
  'labelConfirmNewPassword',
  'labelCurrentPassword',
  'labelNewPassword',
  'textRequiredField'
];
export default {
  packageId: '@oracle-cx-commerce/react-widgets',
  resources: buildResources(resourceBundle, widgetResourceKeys),
  availableToAllPages: false,
  pageTypes: ['profile'],
  config: defaultConfig,
  actions: ['updateProfile'],
  fetchers: ['fetchCommonResources', 'fetchShopperSettings']
};
