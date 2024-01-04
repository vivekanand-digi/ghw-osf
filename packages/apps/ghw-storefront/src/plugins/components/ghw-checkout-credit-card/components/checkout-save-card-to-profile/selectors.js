/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';

export const isLoggedIn = state => {
  return {
    isLoggedIn: isAuthenticated(state)
  };
};
