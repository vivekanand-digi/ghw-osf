/**
 * Metadata for the contactus action.
 */
export const contactus = {
  name: 'contactus',
  // Action's description
  description: 'Description for contactus',
  author: 'VirendraPatil',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['contactus'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: '@oracle-cx-commerce/core-commerce-reference-store-storefront-prov/src/plugins/actions/contactus/schema/input.json',
  packageId: '@oracle-cx-commerce/core-commerce-reference-store-storefront-prov'
};
