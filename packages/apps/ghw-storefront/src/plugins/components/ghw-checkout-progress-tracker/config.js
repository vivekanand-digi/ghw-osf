/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import * as resourceBundle from '@oracle-cx-commerce/resources';

import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';

const configResourceKeys = [
  'configCheckoutShippingAddressLabel',
  'configCheckoutShippingAddressHelpText',
  'configCheckoutPaymentAddressLabel',
  'configCheckoutPaymentAddressHelpText',
  'configCheckoutReviewAddressLabel',
  'configCheckoutReviewAddressHelpText',
  'configCheckoutQuoteShippingAddressLabel',
  'configCheckoutQuoteShippingAddressHelpText',
  'configCheckoutPaymentAndReviewAddressLabel',
  'configCheckoutPaymentAndReviewAddressHelpText'
];

const config = {
  properties: [
    {
      id: 'checkoutShippingAddress',
      type: 'stringType',
      defaultValue: 'checkout-shipping',
      labelResourceId: 'configCheckoutShippingAddressLabel',
      helpTextResourceId: 'configCheckoutShippingAddressHelpText',
      required: true
    },
    {
      id: 'checkoutPaymentAddress',
      type: 'stringType',
      defaultValue: 'checkout-payment',
      labelResourceId: 'configCheckoutPaymentAddressLabel',
      helpTextResourceId: 'configCheckoutPaymentAddressHelpText',
      required: true
    },
    {
      id: 'checkoutReviewAddress',
      type: 'stringType',
      defaultValue: 'checkout-review-order',
      labelResourceId: 'configCheckoutReviewAddressLabel',
      helpTextResourceId: 'configCheckoutReviewAddressHelpText',
      required: true
    },
    {
      id: 'checkoutQuoteShippingAddress',
      type: 'stringType',
      defaultValue: 'checkout-quote-shipping',
      labelResourceId: 'configCheckoutQuoteShippingAddressLabel',
      helpTextResourceId: 'configCheckoutQuoteShippingAddressHelpText',
      required: true
    },
    {
      id: 'checkoutPaymentAndReviewAddress',
      type: 'stringType',
      defaultValue: 'checkout-quote-payment-and-review',
      labelResourceId: 'configCheckoutPaymentAndReviewAddressLabel',
      helpTextResourceId: 'configCheckoutPaymentAndReviewAddressHelpText',
      required: true
    }
  ],
  locales: buildConfigResources(resourceBundle, configResourceKeys)
};

export default config;
