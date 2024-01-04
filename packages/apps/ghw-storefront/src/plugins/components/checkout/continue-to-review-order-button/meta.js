/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import config from './config';

const widgetResourceKeys = [
  'actionContinueToReviewOrder',
  'buttonPlaceOrder',
  'buttonPlacingOrder',
  'alertTechnicalProblemContactUs',
  'alertOrderNotPlacedPaymentDeclined',
  'buttonScheduledOrder',
  'buttonSchedulingOrder'
];

export default {
  resources: buildResources(resourceBundle, widgetResourceKeys),
  // availableToAllPages: false,
  config: mergeDefaultConfig(config),
  actions: ['applyPayments', 'updateAppliedPayment', 'deleteAppliedPayment', 'notifyClearAll', 'notify']
};
