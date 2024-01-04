/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import defaultConfig from '@oracle-cx-commerce/react-widgets/config';

const widgetResourceKeys = [
  'actionConfirm',
  'actionCancel',
  'alertCardDeleted',
  'headingConfirmCardDeletion',
  'labelConfirmDeleteSavedCard',
  'textConfirmCardDeletionMessage',
  'textCardRemove'
];

export default {
  packageId: '@oracle-cx-commerce/react-widgets',
  availableToAllPages: false,
  pageTypes: ['profile'],
  config: defaultConfig,
  resources: buildResources(resourceBundle, widgetResourceKeys),
  actions: ['removeSavedCardFromProfile', 'notify', 'notifyClearAll']
};
