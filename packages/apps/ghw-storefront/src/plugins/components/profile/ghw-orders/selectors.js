/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getProfile} from '@oracle-cx-commerce/commerce-utils/selector';

export const getPageData = state => {
  const currentProfile = getProfile(state);

  return {
    currentProfile
  };
};
