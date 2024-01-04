/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {createEndpoint, getBodyAsJson} from '@oracle-cx-commerce/endpoints/factory';
import {populateError} from '@oracle-cx-commerce/endpoints/utils';
import {transformProfileV2} from '@oracle-cx-commerce/endpoints/utils/transform';

const processInput = payload => {
  //extracting other query params which will be added as part of accessRole Changes.
  const {_filterKey: filterKey = 'OSFCurrentProfile', expand, includedRoles} = payload;
  const query = {};
  if (expand) {
    query['expand'] = expand;
  }
  if (includedRoles) {
    query['includedRoles'] = includedRoles;
  }
  //assigning default value of filterKey if the payload does not contains any filterKey.
//   if (filterKey !== '') {
//     query.filterKey = filterKey;
//   }

  return {query};
};

export const processOutput = async (response, state) => {
  const json = await getBodyAsJson(response);

  return response.ok ? transformProfileV2(json, state) : populateError(response, json);
};

/**
 * Get current profile
 * @memberof Endpoints
 * @class getCurrentProfile
 * @category Endpoint-list
 * @serviceurl https://docs.oracle.com/en/cloud/saas/cx-commerce/cxocc/op-ccstore-v1-profiles-current-get.html
 * @author Oracle
 * @since 2.10.0
 */
export default createEndpoint('getCurrentProfile', {
  processInput,
  processOutput
});
