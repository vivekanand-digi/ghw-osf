/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  isAuthenticated,
  getCurrentProfileId,
  getContactInfos,
  getOrganizations,
  getCurrentOrganizationId,
  getRoles
} from '@oracle-cx-commerce/commerce-utils/selector';

export const getComponentData = state => {
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  const contactInfos = getContactInfos(state);
  const currentOrganization = getOrganizations(state)[getCurrentOrganizationId(state)];
  const roles = getRoles(state);

  return {isUserLoggedIn, contactInfos, currentOrganization, roles};
};
