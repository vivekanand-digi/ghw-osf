import {loadScript} from './script-loader';

export const loadLocalPaymentScript = () => {
  return new Promise(resolve => {
    loadScript('https://js.braintreegateway.com/web/3.80.0/js/local-payment.min.js').then(() => {
      resolve(true);
    });
  });
};
