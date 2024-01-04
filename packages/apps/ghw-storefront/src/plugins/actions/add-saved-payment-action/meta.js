/**
 * Metadata for the addSavedPaymentAction action.
 */
export const addSavedPaymentAction = {
  name: 'addSavedPaymentAction',
  // Action's description
  description: 'Description for addSavedPaymentAction',
  author: 'ThanxMedia',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['addSavedPayment'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'braintree-widgets/src/plugins/actions/add-saved-payment-action/schema/input.json',
  packageId: 'braintree-widgets'
};
