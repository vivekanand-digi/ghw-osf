/**
 * Metadata for the deleteSavedPaymentAction action.
 */
export const deleteSavedPaymentAction = {
  name: 'deleteSavedPaymentAction',
  // Action's description
  description: 'Description for deleteSavedPaymentAction',
  author: 'ThanxMedia',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['deleteSavedPayment'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'braintree-widgets/src/plugins/actions/delete-saved-payment-action/schema/input.json',
  packageId: 'braintree-widgets'
};
