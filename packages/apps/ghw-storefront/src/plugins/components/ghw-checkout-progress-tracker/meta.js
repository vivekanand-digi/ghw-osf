/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';

import {buildResources} from '@oracle-cx-commerce/resources/utils';
import config from './config';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';

const widgetResourceKeys = [
  'headingCheckout',
  'headingPayment',
  'headingReview',
  'headingShipping',
  'headingPaymentReview'
];

export default {
  packageId: '@oracle-cx-commerce/react-widgets',
  resources: buildResources(resourceBundle, widgetResourceKeys),
  config: mergeDefaultConfig(config),
  availableToAllPages: false,
  pageTypes: [
    'checkout-shipping',
    'checkout-payment',
    'checkout-review-order',
    'checkout-quote-shipping',
    'checkout-quote-payment-and-review'
  ]
};
