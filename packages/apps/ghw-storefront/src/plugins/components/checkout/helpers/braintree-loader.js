export const Braintree = ({environment, isPayPalStandalone} = {}) => {
  return new Promise(resolve => {
    if (!window.braintree) {
      const btScript = document.createElement('script');
      btScript.id = 'braintree-script';
      btScript.src = 'https://js.braintreegateway.com/web/3.80.0/js/client.min.js';
      btScript.async = false;
      document.body.appendChild(btScript);

      const ppScript = document.createElement('script');
      if (!window.paypal) {
        ppScript.id = 'braintree-paypal-script';
        ppScript.src = 'https://js.braintreegateway.com/web/3.80.0/js/paypal-checkout.min.js';
        ppScript.async = false;
        document.body.appendChild(ppScript);
      }

      // if (isPayPalStandalone) {
      //   if (window.paypal) {
      //     return resolve(window.braintree)
      //   }
      //   document.getElementById(ppScript.id).addEventListener('load', () => {
      //     resolve(window.braintree);
      //   });
      //   return;
      // }

      const btHfScript = document.createElement('script');
      btHfScript.id = 'braintree-hosted-fields-script';
      btHfScript.src = 'https://js.braintreegateway.com/web/3.80.0/js/hosted-fields.min.js';
      btHfScript.async = false;
      document.body.appendChild(btHfScript);

      const threeDSecureScript = document.createElement('script');
      threeDSecureScript.id = 'braintree-3d-secure-script';
      threeDSecureScript.src = 'https://js.braintreegateway.com/web/3.80.0/js/three-d-secure.min.js';
      threeDSecureScript.async = false;
      document.body.appendChild(threeDSecureScript);

      const dataCollectorScript = document.createElement('script');
      dataCollectorScript.id = 'braintree-data-collector-script';
      dataCollectorScript.src = 'https://js.braintreegateway.com/web/3.80.0/js/data-collector.min.js';
      dataCollectorScript.async = false;
      document.body.appendChild(dataCollectorScript);

      const venmoScript = document.createElement('script');
      venmoScript.id = 'braintree-venmo-script';
      venmoScript.src = 'https://js.braintreegateway.com/web/3.80.0/js/venmo.min.js';
      venmoScript.async = false;
      document.body.appendChild(venmoScript);

      const srcScript = document.createElement('script');
      srcScript.id = 'src-script';
      srcScript.src = 'https://js.braintreegateway.com/web/3.80.0/js/visa-checkout.min.js';
      srcScript.async = false;
      document.body.appendChild(srcScript);

      document.getElementById(btScript.id).addEventListener('load', () => {
        resolve(window.braintree);
      });
    } else {
      resolve(window.braintree);
    }
  });
};
