/**
 * Metadata for the cancelSubscriptionAction action.
 */
export const cancelSubscriptionAction = {
  name: 'cancelSubscriptionAction',
  // Action's description
  description: 'Description for cancelSubscriptionAction',
  author: 'roycalvo',
  // This action uses a Saga to invoke an endpoint.
  endpoints: ['cancelSubscription'],
  // The path to Json schema representing the request Json structure and the example of payload.
  input: 'braintree-widgets/src/plugins/actions/cancel-subscription-action/schema/input.json',
  packageId: 'braintree-widgets'
};
