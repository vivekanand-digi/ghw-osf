/**
 * Metadata for the signifydCheckout action.
 */
export const signifydCheckout = {
  name: 'signifydCheckout',
  // Action's description
  description: 'Description for signifydCheckout',
  author: 'VirendraPatil',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['signifydCheckout'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'ghw-storefront/src/plugins/actions/signifyd-checkout/schema/input.json',
  packageId: 'ghw-storefront'
};
