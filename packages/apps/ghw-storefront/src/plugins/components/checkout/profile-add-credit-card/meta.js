/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import defaultConfig from '@oracle-cx-commerce/react-widgets/config';

const widgetResourceKeys = [
  'actionCancel',
  'actionSave',
  'alertCardAdded',
  'buttonSaveAndContinue',
  'closeLinkAltText',
  'headingAddACreditCard',
  'headingAddBillingAddress',
  'headingBillingAddress',
  'headingEditBillingAddress',
  'labelAddANewAddress',
  'labelAddressBook',
  'labelCancel',
  'labelCardCVV',
  'labelCardNumber',
  'labelCompanyName',
  'labelCountry',
  'labelDefaultAddress',
  'labelDefaultBillingAddress',
  'labelDefaultPayment',
  'labelDefaultShippingAddress',
  'labelEditAddress',
  'labelExpiryDate',
  'labelExpiryMonth',
  'labelExpiryYear',
  'labelFirstName',
  'labelLastName',
  'labelNameOnCard',
  'labelNickName',
  'labelNoAccountAddressesAvailable',
  'labelNoDefaultAddressesAvailable',
  'labelNoInheritedAddressesAvailable',
  'labelNoProfileAddressesAvailable',
  'labelOpenAddressBook',
  'labelPhoneNumberOptional',
  'labelSaveAsANewAccountAddress',
  'labelSaveAsANewProfileAddress',
  'labelState',
  'labelStreetAddress',
  'labelTownCity',
  'labelZipCode',
  'textAccountAddressBook',
  'textAllFieldsRequired',
  'textAddressesForThisAccount',
  'textDefaultAddresses',
  'textEnterABillingAddress',
  'textInheritedAddresses',
  'textLoading',
  'textLoadMoreAccountAddress',
  'textLoadMoreInheritedAddress',
  'textLoadMoreProfileAddress',
  'textOpenAddressBookAndChooseBillingAddress',
  'textProfileAddresses',
  'textFieldInvalid',
  'textRequiredField',
  'textInvalidField',
  'textUseThisAddress'
];

export const ProfileAddCreditCard = {
  packageId: '@oracle-cx-commerce/react-widgets',
  availableToAllPages: false,
  pageTypes: ['profile'],
  config: defaultConfig,
  resources: buildResources(resourceBundle, widgetResourceKeys),
  actions: ['notifyClearAll', 'notify', 'getOrganizationDefaultAddresses', 'saveCardToProfile'],
  fetchers: ['fetchBillingCountries', 'fetchCardTypes']
};
