/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import * as resourceBundle from '@oracle-cx-commerce/resources';

import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';

const configResourceKeys = [
  'configDisplayAndURLLabelBreadcrumbs',
  'configDisplayAndURLHelpTextBreadcrumbs1',
  'configPlaceHoldersTextBreadcrumbs',
  'configAddMoreRowsTextBreadcrumbs',
  'configHelpTextLabel1Breadcrumbs',
  'configHelpTextLabel2Breadcrumbs',
  'configHelpTextLabel3Breadcrumbs',
  'configHelpTextLabel4Breadcrumbs',
  'configHelpTextLabel5Breadcrumbs',
  'configHelpTextLabel6Breadcrumbs',
  'configDisplayAndURLHelpTextBreadcrumbs2',
  'configDisplayAndURLHelpTextBreadcrumbs3',
  'configDisplayAndURLHelpTextBreadcrumbs4',
  'configDisplayAndURLHelpTextBreadcrumbs5',
  'configDisplayAndURLHelpTextBreadcrumbs6'
];

const config = {
  properties: [
    {
      id: 'helpTextTitle1',
      type: 'sectionTitleType',
      labelResourceId: 'configHelpTextLabel1Breadcrumbs',
      helpTextResourceId: 'configDisplayAndURLHelpTextBreadcrumbs1'
    },
    {
      id: 'helpTextTitle2',
      type: 'sectionTitleType',
      labelResourceId: 'configHelpTextLabel2Breadcrumbs',
      helpTextResourceId: 'configDisplayAndURLHelpTextBreadcrumbs2'
    },
    {
      id: 'helpTextTitle3',
      type: 'sectionTitleType',
      labelResourceId: 'configHelpTextLabel3Breadcrumbs',
      helpTextResourceId: 'configDisplayAndURLHelpTextBreadcrumbs3'
    },
    {
      id: 'helpTextTitle4',
      type: 'sectionTitleType',
      labelResourceId: 'configHelpTextLabel4Breadcrumbs',
      helpTextResourceId: 'configDisplayAndURLHelpTextBreadcrumbs4'
    },
    {
      id: 'helpTextTitle5',
      type: 'sectionTitleType',
      labelResourceId: 'configHelpTextLabel5Breadcrumbs',
      helpTextResourceId: 'configDisplayAndURLHelpTextBreadcrumbs5'
    },
    {
      id: 'helpTextTitle6',
      type: 'sectionTitleType',
      labelResourceId: 'configHelpTextLabel6Breadcrumbs',
      helpTextResourceId: 'configDisplayAndURLHelpTextBreadcrumbs6'
    },
    {
      id: 'viewedPagesNameAndURL',
      type: 'multiKeyValuePairsType',
      name: 'viewedPagesNameAndURL',
      labelResourceId: 'configDisplayAndURLLabelBreadcrumbs',
      placeHolders: 'configPlaceHoldersTextBreadcrumbs',
      maxLengths: '100,100',
      noOfColumns: 2,
      addMoreRowsResourceId: 'configAddMoreRowsTextBreadcrumbs',
      required: true
    }
  ],
  defaults: {
    displayAndURL: '[]'
  },
  locales: buildConfigResources(resourceBundle, configResourceKeys)
};

export default config;
