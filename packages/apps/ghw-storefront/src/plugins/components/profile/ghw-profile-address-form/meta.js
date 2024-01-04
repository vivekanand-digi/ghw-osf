import {buildResources} from '@oracle-cx-commerce/resources/utils';
import defaultConfig, {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import * as resourceBundle from '@oracle-cx-commerce/resources';
import * as resources from '../../../../core/ui/locales';
import config from './config';

/**
 * The list below declares which of the locale resources should be made available to the widget
 */
const resourceKeys = ['helloText', 'labelExtraInfo', 'labelSampleTranslation'];

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

export default {
  name: 'GHWProfileAddressForm',
  decription: 'Description of widget GHWProfileAddressForm',
  author: 'VirendraPatil',
  fetchers: [],
  actions: [],
  // resources: buildResources(resources, resourceKeys),
  resources: buildResources(resourceBundle, widgetResourceKeys),
  config: mergeDefaultConfig(config)
};

// export const ProfileAddressForm = {
//   packageId: '@oracle-cx-commerce/react-widgets',
//   availableToAllPages: false,
//   pageTypes: ['profile'],
//   config: defaultConfig,
//   resources: buildResources(resourceBundle, widgetResourceKeys)
// };
