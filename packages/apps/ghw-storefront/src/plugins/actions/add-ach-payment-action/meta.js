/**
 * Metadata for the addAchPaymentAction action.
 */
export const addAchPaymentAction = {
  name: 'addAchPaymentAction',
  // Action's description
  description: 'Description for addAchPaymentAction',
  author: 'roycalvo',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['addSavedPayment'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'braintree-widgets/src/plugins/actions/add-ach-payment-action/schema/input.json',
  packageId: 'braintree-widgets'
};
