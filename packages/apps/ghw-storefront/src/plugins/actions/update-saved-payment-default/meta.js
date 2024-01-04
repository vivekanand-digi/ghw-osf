/**
 * Metadata for the updateSavedPaymentDefault action.
 */
export const updateSavedPaymentDefault = {
  name: 'updateSavedPaymentDefault',
  // Action's description
  description: 'Description for updateSavedPaymentDefault',
  author: 'ThanxMedia',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['setDefaultSavedPayment'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'braintree-widgets/src/plugins/actions/update-saved-payment-default/schema/input.json',
  packageId: 'braintree-widgets'
};
