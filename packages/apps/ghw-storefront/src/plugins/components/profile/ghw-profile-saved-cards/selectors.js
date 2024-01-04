/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getCurrentProfileId,
  getProfileSavedCardsArray,
  isAuthenticated
} from '@oracle-cx-commerce/commerce-utils/selector';
import {compareCards} from '@oracle-cx-commerce/react-components/utils/payment';

export const getPageData = state => {
  return {
    isUserLoggedIn: isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous',
    GHWProfileSavedCards: getProfileSavedCardsArray(state).sort(compareCards)
  };
};
