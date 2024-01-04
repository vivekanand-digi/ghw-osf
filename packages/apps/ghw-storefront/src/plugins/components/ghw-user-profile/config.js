/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';

const configResourceKeys = [
  'configLinksTitle',
  'configAnonymousPagesDisplayNameAndURLLabel',
  'configAuthenticatedPagesDisplayAndURLLabel',
  'configDisplayIcons',
  'configProfileLinksPlaceHoldersText',
  'configAddMoreRowsText',
  'configProfileLinksDisplayAndURLHelpText1',
  'configProfileLinksDisplayAndURLHelpText2',
  'configNavigationOrientationLabel',
  'configHorizontalOrientationLabel',
  'configVerticalOrientationLabel',
  'configNavigationOrientationHelpText'
];
const config = {
  properties: [
    {
      id: 'displayIcons',
      type: 'booleanType',
      labelResourceId: 'displayIcons',
      defaultValue: true
    },
    {
      id: 'navigationOrientation',
      type: 'optionType',
      labelResourceId: 'configNavigationOrientationLabel',
      helpTextResourceId: 'configNavigationOrientationHelpText',
      defaultValue: 'vertical',
      required: true,
      options: [
        {
          id: 'horizontalOrientation',
          value: 'horizontal',
          labelResourceId: 'configHorizontalOrientationLabel'
        },
        {
          id: 'verticalOrientation',
          value: 'vertical',
          labelResourceId: 'configVerticalOrientationLabel'
        }
      ]
    },
    {
      id: 'linksTitle',
      type: 'sectionTitleType',
      labelResourceId: 'configLinksTitle'
    },
    {
      id: 'helpTextProfileLinksTitle1',
      type: 'sectionTitleType',
      labelResourceId: 'configAnonymousPagesDisplayNameAndURLLabel',
      helpTextResourceId: 'configProfileLinksDisplayAndURLHelpText1'
    },
    {
      id: 'helpTextProfileLinksTitle2',
      type: 'sectionTitleType',
      labelResourceId: 'configHelpTextLabelProfileLinks',
      helpTextResourceId: 'configProfileLinksDisplayAndURLHelpText2'
    },
    {
      id: 'anonymousPagesDisplayNameAndURL',
      type: 'multiKeyValuePairsType',
      name: 'anonymousPagesDisplayNameAndURL',
      labelResourceId: 'configAnonymousPagesDisplayNameAndURLLabel',
      placeHolders: 'configProfileLinksPlaceHoldersText',
      maxLengths: '1000,2000,1000',
      noOfColumns: 3,
      addMoreRowsResourceId: 'configAddMoreRowsText',
      required: true
    },
    {
      id: 'authenticatedPagesDisplayNameAndURL',
      type: 'multiKeyValuePairsType',
      name: 'authenticatedPagesDisplayNameAndURL',
      labelResourceId: 'configAuthenticatedPagesDisplayAndURLLabel',
      placeHolders: 'configProfileLinksPlaceHoldersText',
      maxLengths: '1000,2000,1000',
      noOfColumns: 3,
      addMoreRowsResourceId: 'configAddMoreRowsText',
      required: true
    }
  ],
  defaults: {
    anonymousPagesDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
    authenticatedPagesDisplayNameAndURL: "[{'0':'','1':'','2':''}]"
  },
  locales: buildConfigResources(resourceBundle, configResourceKeys)
};
export default config;
