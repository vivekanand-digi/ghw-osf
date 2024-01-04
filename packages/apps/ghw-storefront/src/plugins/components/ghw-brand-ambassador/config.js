import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';
import * as resources from '@oracle-cx-commerce/resources';

/**
 * The list below declares which of the locale resources should be made available to the widget
 */
const resourceKeys = ['teammember1Label','teammember2Label','teammember3Label','role1Label','role2Label','role3Label','image1label','image2label','image3label'];

/**
 * Design Studio configuration properties for the WidgetName component.
 */
const config = {
  properties: [
    {
      id: 'teammember1',
      type: 'stringType',
      labelResourceId: 'teammember1Label',
      required: true,
      defaultValue: '<p>Some Web Content Text</p>'
    },
    {
      id: 'teammember2',
      type: 'stringType',
      labelResourceId: 'teammember2Label',
      required: true,
      defaultValue: '<p>Some Web Content Text</p>'
    },
    {
      id: 'teammember3',
      type: 'stringType',
      labelResourceId: 'teammember3Label',
      required: true,
      defaultValue: '<p>Some Web Content Text</p>'
    },
    {
      id: 'role1',
      type: 'stringType',
      labelResourceId: 'role1Label',
      required: true,
      defaultValue: '<p>Some Web Content Text</p>'
    },
    {
      id: 'role2',
      type: 'stringType',
      labelResourceId: 'role2Label',
      required: true,
      defaultValue: '<p>Some Web Content Text</p>'
    },
    {
      id: 'role3',
      type: 'stringType',
      labelResourceId: 'role3Label',
      required: true,
      defaultValue: '<p>Some Web Content Text</p>'
    },
    {
      id: 'image1',
      type: 'mediaType',
      labelResourceId: 'image1label',
      required: true
     },
     {
       id: 'image2',
       type: 'mediaType',
       labelResourceId: 'image2label',
       required: true
      },
      {
        id: 'image3',
        type: 'mediaType',
        labelResourceId: 'image3label',
        required: true
       }
  ],
  locales: buildConfigResources(resources, resourceKeys)
};

export default config;

