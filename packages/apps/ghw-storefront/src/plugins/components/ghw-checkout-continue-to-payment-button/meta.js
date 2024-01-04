/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import config from './config';

const widgetResourceKeys = [
  'actionConfirm',
  'actionContinue',
  'actionContinueToPayment',
  'closeLinkAltText',
  'headingItemsWillBeShippedTogether',
  'labelCancel',
  'alertItemsWillBeShippedTogether',
  'alertVerifyShippingDetails',
  'alertShippingMethodDisabled'
];

export default {
  packageId: '@oracle-cx-commerce/react-widgets',
  resources: buildResources(resourceBundle, widgetResourceKeys),
  availableToAllPages: false,
  pageTypes: ['checkout-shipping'],
  config: mergeDefaultConfig(config),
  requiresContext: ['cart_context', 'checkout_shipping_context'],
  actions: [
    'listShippingMethodsForCart',
    'updateCartShippingGroup',
    'createProfileAddress',
    'addOrganizationAddress',
    'notify'
  ]
};
