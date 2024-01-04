/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getCommonResources, getPasswordPolicies} from '@oracle-cx-commerce/commerce-utils/selector';

export const getPageData = state => {
  const commonResources = getCommonResources(state);
  const passwordPolicies = getPasswordPolicies(state);

  return {
    commonResources,
    passwordPolicies
  };
};
