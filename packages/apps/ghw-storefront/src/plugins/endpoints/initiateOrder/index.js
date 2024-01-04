import {createEndpoint, getBodyAsJson} from '@oracle-cx-commerce/endpoints/factory';
import {populateError} from '@oracle-cx-commerce/endpoints/utils';

export const processInput = payload => {
  console.log(`################### initiateOrder endpoint #######################`, payload);
  return {
    body: {...payload, op: 'initiate'}
  };
};

/**
 * Convert response data into an object to be merged into the application state.
 */
const processOutput = async response => {
  const json = await getBodyAsJson(response);
  if (!response.ok) {
    return populateError(response, json);
  }
  const {clientToken, basicAuth} = json.payments[0].customPaymentProperties;
  return {
    braintreeRepository: {
      widgetInfo: {
        clientToken,
        basicAuth
      }
    }
  };
};

export default createEndpoint('createOrder', {
  processInput,
  processOutput
});
