import {createEndpoint, getBodyAsJson} from '@oracle-cx-commerce/endpoints/factory';
import {populateError} from '@oracle-cx-commerce/endpoints/utils';

const processInput = ({profileId, site, basicAuth, makeDefault, nonce, type}) => {
  console.log('########### set default add saved payment processInput');

  return {
    params: ['v1/bt-add-saved-payment'],
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'x-braintree-site-id': site
    },
    body: {
      nonce,
      type,
      makeDefault,
      profileId
    }
  };
};

/**
 * Convert response data into an object to be merged into the application state.
 */
const processOutput = async response => {
  const json = await getBodyAsJson(response);
  console.log('########### add saved payment processOutput', json);

  return response.ok
    ? {
        ...json
      }
    : populateError(response, json);
};

export default createEndpoint('extpost', {
  processInput,
  processOutput
});
