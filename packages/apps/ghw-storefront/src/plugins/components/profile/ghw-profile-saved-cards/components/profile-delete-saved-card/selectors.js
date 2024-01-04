/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {isAuthenticated, getPage, getCardTypes, getCurrentProfileId} from '@oracle-cx-commerce/commerce-utils/selector';

export const getPageData = state => {
  const savedCardId = getPage(state).contextId;

  return {
    savedCardId,
    isUserLoggedIn: isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous',
    cardTypes: getCardTypes(state)
  };
};
