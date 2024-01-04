import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import {buildResources} from '@oracle-cx-commerce/resources/utils';
import * as resources from '@oracle-cx-commerce/resources';
import config from './config';

/**
 * The list below declares which of the locale resources should be made available to the widget
 */

/**
 * Different examples on how to import a config object.
 */
// import config from './config';
// import defaultConfig from '@oracle-cx-commerce/react-widgets/config';
// import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';

/**
 * Metadata for the widget.
 */
const resourceKeys = [
  'textTest',
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
  'alertAddressCreatedSuccessfully',
  'labelCurrentPassword',
  'labelNewPassword',
  'labelConfirmNewPassword',
  'actionCancel'
];

export default {
  name: 'GHWMyAccount',
  decription: 'Description of widget GHWMyAccount',
  author: 'AC',
  fetchers: [],
  actions: [],
  resources: buildResources(resources, resourceKeys),
  /**
   * Include references to all of our resource strings in all supported locales.
   * This will enable the component to access any resource string via its props,
   * using the locale that is currently in effect.
   */
  /**
   *  Specify configuration properties for use in Design Studio.
   */
  config: mergeDefaultConfig(config)
};
