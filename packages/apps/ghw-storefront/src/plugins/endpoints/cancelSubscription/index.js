import {createEndpoint, getBodyAsJson} from '@oracle-cx-commerce/endpoints/factory';
import {populateError} from '@oracle-cx-commerce/endpoints/utils';

const processInput = ({site, basicAuth, orderId}) => {
  console.log('########### set cancel subscription processInput');

  return {
    params: ['v1/bt-cancel-subscription'],
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'x-braintree-site-id': site
    },
    body: {
      orderId
    }
  };
};

/**
 * Convert response data into an object to be merged into the application state.
 */
const processOutput = async response => {
  const json = await getBodyAsJson(response);
  console.log('########### delete cancel subscription processOutput', json);

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
