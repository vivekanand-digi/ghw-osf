/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getProfile, getRememberMe, getSite, isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';

export const getLoggedInData = state => {
  const {login} = getRememberMe(state);
  const authenticated = isAuthenticated(state);
  const {id: profileId} = getProfile(state);
  const currentProfile = getProfile(state);

  return {
    login,
    authenticated,
    profileId,
    currentProfile
  };
};
