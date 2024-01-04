/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getCurrentProfileId,
  getCommonResources,
  getPasswordPolicies,
  getProfile,
  isAuthenticated
} from '@oracle-cx-commerce/commerce-utils/selector';

export const getPageData = state => {
  const commonResources = getCommonResources(state);
  const passwordPolicies = getPasswordPolicies(state);

  return {
    ...getProfile(state),
    commonResources,
    passwordPolicies,
    isUserLoggedIn: isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous'
  };
};
