import {createEndpoint, getBodyAsJson} from '@oracle-cx-commerce/endpoints/factory';
import {populateError} from '@oracle-cx-commerce/endpoints/utils';

const processInput = ({profileId, site, basicAuth}) => {
  console.log('########### retrieve-braintree-account-profile processInput');

  return {
    params: [`v1/bt-retrieve-shopper-profile`],
    query: {profileId},
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'x-braintree-site-id': site
    }
  };
};
/**
 * Convert response data into an object to be merged into the application state.
 */
const processOutput = async response => {
  const profile = await getBodyAsJson(response);
  console.log('########### retrieve-braintree-account-profile processOutput', profile);

  return response.ok
    ? {
        shopperProfileRepository: {
          profile
        }
      }
    : populateError(response, profile);
};

export default createEndpoint('extget', {
  processInput,
  processOutput
});
