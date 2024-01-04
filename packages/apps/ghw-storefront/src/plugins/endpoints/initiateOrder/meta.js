export default {
  name: 'initiateOrder',
  description: 'Description for initiateOrder',
  author: 'roycalvo',
  // Add comment: 'Documentation link for underlying rest endpoint'
  serviceurl: '',
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'braintree-widgets/src/plugins/endpoints/initiateOrder/schema/input.json',
  // The json schema represents the redux states changes that will occur due to this reducer.
  // The json schema is expected to contain the state definition and an example.
  output: 'braintree-widgets/src/plugins/endpoints/initiateOrder/schema/output.json',
  packageId: ''
};
