export default {
  name: 'uspsValidation',
  description: 'Description for uspsValidation',
  author: 'VirendraPatil',
  // Add comment: 'Documentation link for underlying rest endpoint'
  serviceurl: '',
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'ghw-storefront/src/plugins/endpoints/uspsValidation/schema/input.json',
  // The json schema represents the redux states changes that will occur due to this reducer.
  // The json schema is expected to contain the state definition and an example.
  output: 'ghw-storefront/src/plugins/endpoints/uspsValidation/schema/output.json',
  packageId: ''
};
