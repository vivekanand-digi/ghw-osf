import {loadScript} from './script-loader';

export const loadGooglePayScript = () => {
  return new Promise(resolve => {
    if (!window.google) {
      loadScript('https://pay.google.com/gp/p/js/pay.js').then(() => {
        loadScript('https://js.braintreegateway.com/web/3.80.0/js/google-payment.js', 'google-pay-script');
        document.getElementById('google-pay-script').addEventListener('load', () => {
          resolve(window.google);
        });
      });
    } else {
      resolve(window.google);
    }
  });
};
