import {loadScript} from './script-loader';

export const loadACHScript = () => {
  return new Promise(resolve => {
    loadScript('https://js.braintreegateway.com/web/3.80.0/js/client.min.js', 'braintree-script').then(() => {
      loadScript('https://js.braintreegateway.com/web/3.80.0/js/us-bank-account.min.js', 'bt-us-bank-account').then(
        () => {
          resolve(window.braintree);
        }
      );
    });
  });
};
