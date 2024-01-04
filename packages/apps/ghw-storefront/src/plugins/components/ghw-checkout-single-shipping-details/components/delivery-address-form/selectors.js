/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {getSite} from '@oracle-cx-commerce/commerce-utils/selector';

export const getComponentData = state => {
  return {
    defaultShippingCountry: getSite(state).defaultShippingCountryId
  };
};
