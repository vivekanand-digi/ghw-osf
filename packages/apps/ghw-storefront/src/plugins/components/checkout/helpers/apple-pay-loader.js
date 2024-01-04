import {loadScript} from './script-loader';

export const loadApplePayScript = () => {
  return new Promise(resolve => {
    loadScript('https://js.braintreegateway.com/web/3.80.0/js/apple-pay.min.js').then(() => {
      loadScript('https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js').then(() => {
        resolve(true);
      });
    });
  });
};
