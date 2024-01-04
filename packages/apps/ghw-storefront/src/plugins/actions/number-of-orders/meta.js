/**
 * Metadata for the numberOfOrders action.
 */
export const numberOfOrders = {
  name: 'numberOfOrders',
  // Action's description
  description: 'Description for numberOfOrders',
  author: 'VirendraPatil',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['numberOfOrders'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'ghw-storefront/src/plugins/actions/number-of-orders/schema/input.json',
  packageId: 'ghw-storefront'
};
