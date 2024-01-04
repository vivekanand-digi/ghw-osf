/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import defaultConfig from '@oracle-cx-commerce/react-widgets/config';

const widgetResourceKeys = [
  'labelEmail',
  'textPasswordResetHelper',
  'headingResetPassword',
  'alertResetPasswordFailure',
  'alertResetPasswordSuccessful',
  'buttonResendPasswordRequest',
  'buttonSubmit'
];

export default {
  packageId: '@oracle-cx-commerce/react-widgets',
  resources: buildResources(resourceBundle, widgetResourceKeys),
  config: defaultConfig
};
