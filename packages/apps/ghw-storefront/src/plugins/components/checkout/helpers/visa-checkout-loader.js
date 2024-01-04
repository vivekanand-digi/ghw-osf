import {loadScript} from './script-loader';

export const loadVisaCheckoutScript = environment => {
  return new Promise(resolve => {
    loadScript(
      `https://${
        environment === 'sandbox' ? 'sandbox-' : ''
      }assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js`
    ).then(() => {
      resolve(true);
    });
  });
};
