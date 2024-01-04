/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import config from '@oracle-cx-commerce/react-widgets/profile/profile-address-book/config';

const widgetResourceKeys = [
  'headingAddAddress',
  'headingEditAddress',
  'headingEditProfileAddress',
  'headingAddProfileAddress',
  'textAllFieldsRequired',
  'textInvalidField',
  'textRequiredField',
  'labelNickName',
  'labelFirstName',
  'labelLastName',
  'labelCompanyName',
  'labelCountry',
  'labelZipCode',
  'labelState',
  'labelStreetAddress',
  'labelTownCity',
  'labelPhoneNumberOptional',
  'labelMakeDefaultShippingAddress',
  'labelCancel',
  'labelSave',
  'alertAddressChangedSuccessfully',
  'alertAddressCreatedSuccessfully'
];
export const ProfileAddressBook = {
  packageId: '@oracle-cx-commerce/react-widgets',
  availableToAllPages: false,
  pageTypes: ['profile'],
  config: mergeDefaultConfig(config),
  resources: buildResources(resourceBundle, widgetResourceKeys)
};
