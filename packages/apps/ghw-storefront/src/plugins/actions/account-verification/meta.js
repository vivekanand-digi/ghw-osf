/**
 * Metadata for the accountVerification action.
 */
export const accountVerification = {
  name: 'accountVerification',
  // Action's description
  description: 'Description for accountVerification',
  author: 'VirendraPatil',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['accountVerification'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: '@oracle-cx-commerce/core-commerce-reference-store-storefront-prov/src/plugins/actions/account-verification/schema/input.json',
  packageId: '@oracle-cx-commerce/core-commerce-reference-store-storefront-prov'
};
