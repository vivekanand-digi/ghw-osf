/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';

import {buildResources} from '@oracle-cx-commerce/resources/utils';
import config from './config';

const widgetResourceKeys = [
  'headingVerifyIdentity',
  'headingReturningCustomer',
  'textCreateAnAccount',
  'labelEmail',
  'textForgottenPassword',
  'textResendVerificationCode',
  'textVerificationCode',
  'textRememberThisDevice',
  'alertEnterVerificationCode',
  'alertResendOTP',
  'actionLogin',
  'alertLoginSuccessful',
  'alertLoginUnSuccessful',
  'alertLoginOTPIncorrect',
  'alertLoginUnsuccessful',
  'labelPassword',
  'headingEmailMarketingPreferences',
  'textConfirmEmailAndMarkatingPreference',
  'labelShowPersonalizationConsent',
  'labelGetMarketingMails',
  'buttonContinue',
  'buttonSubmit',
  'textAccountWithNoContractError',
  'actionBackToLogin'
];

// export const GHWLogin = {
//   packageId: '@oracle-cx-commerce/react-widgets',
//   resources: buildResources(resourceBundle, widgetResourceKeys),
//   config
// };


export default {
  name: 'GHWLogin',
  decription: 'Description of widget GHWLogin',
  resources: buildResources(resourceBundle, widgetResourceKeys),
  author: 'AC',
  fetchers: [],
  actions: [],
  config
};
