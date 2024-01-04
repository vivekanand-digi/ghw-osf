/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getProfile, getRememberMe, getSite, isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';

export const getLoggedInData = state => {
  const {login} = getRememberMe(state);
  const authenticated = isAuthenticated(state);
  const {requireGDPRP13nConsent} = getSite(state);
  const {
    id: profileId,
    parentOrganization,
    GDPRProfileP13nConsentGranted,
    receiveEmail,
    previousVisitDate,
    currentOrganization
  } = getProfile(state);

  return {
    login,
    authenticated,
    requireGDPRP13nConsent,
    profileId,
    parentOrganization,
    previousVisitDate,
    GDPRProfileP13nConsentGranted,
    receiveEmail,
    currentOrganization
  };
};
