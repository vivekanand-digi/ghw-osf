import {loadScript} from './script-loader';

export const loadAchDirectDebitScript = () => {
  return new Promise(resolve => {
    loadScript('https://js.braintreegateway.com/web/3.80.0/js/us-bank-account.min.js').then(() => {
      resolve(true);
    });
  });
};
