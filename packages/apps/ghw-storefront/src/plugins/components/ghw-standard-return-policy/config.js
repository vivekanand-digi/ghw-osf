import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';
import * as resources from '@oracle-cx-commerce/resources';

/**
 * The list below declares which of the locale resources should be made available to the widget
 */
const resourceKeys = ['SRPContentLabel','SRPLinkLabel'];

/**
 * Design Studio configuration properties for the WidgetName component.
 */
const config = {
  properties: [
    {
      id: 'SRPContent',
      type: 'stringType',
      labelResourceId: 'SRPContentLabel',
      required: true,
    },
    {
      id: 'SRPLink',
      type: 'stringType',
      labelResourceId: 'SRPLinkLabel',
      required: true,
    }
  ],
  locales: buildConfigResources(resources, resourceKeys)
};

export default config;

