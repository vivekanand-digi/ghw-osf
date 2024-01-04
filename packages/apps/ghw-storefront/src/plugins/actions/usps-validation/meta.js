/**
 * Metadata for the uspsValidation action.
 */
export const uspsValidation = {
  name: 'uspsValidation',
  // Action's description
  description: 'Description for uspsValidation',
  author: 'VirendraPatil',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['uspsValidation'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'ghw-storefront/src/plugins/actions/usps-validation/schema/input.json',
  packageId: 'ghw-storefront'
};
