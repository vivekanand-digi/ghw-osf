import {createEndpoint, getBodyAsJson} from '@oracle-cx-commerce/endpoints/factory';
import {populateError} from '@oracle-cx-commerce/endpoints/utils';

const processInput = ({site, basicAuth}) => {
  return {
    method: 'POST',
    params: [`v1/bt-client-token`],
    // params: [`v1/get-token`],
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'x-braintree-site-id': site
    }
  };
};

const processOutput = async response => {
  const json = await getBodyAsJson(response);
  if (!response.ok) {
    return populateError(response, json);
  }
  const {clientToken, basicAuthCreds} = json;

  return {
    braintreeRepository: {
      widgetInfo: {
        clientToken,
        basicAuth: basicAuthCreds
      }
    }
  };
};

export default createEndpoint('extget', {
  processInput,
  processOutput
});
