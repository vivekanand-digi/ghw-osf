/**
 * Metadata for the getShopperProfile action.
 */
export const getShopperProfile = {
  name: 'getShopperProfile',
  // Action's description
  description: 'Description for getShopperProfile',
  author: 'ThanxMedia',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['retrieveShopperProfile'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'braintree-widgets/src/plugins/actions/get-shopper-profile/schema/input.json',
  packageId: 'braintree-widgets'
};
