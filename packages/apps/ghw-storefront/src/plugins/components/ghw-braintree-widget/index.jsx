import React, {useContext, useEffect} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';

const GHWBraintreeWidget = props => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.braintreegateway.com/web/dropin/1.31.2/js/dropin.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    fetch('/ccstorex/custom/v1/get-token')
      .then(response => response.json())
      .then(clientToken => {
        // Initialize the Drop-in UI
        window.braintree.dropin.create(
          {
            authorization: clientToken.data,
            container: '#dropin-container',
            paypal: {
              flow: 'vault'
            }
          },
          function (error, dropinInstance) {
            if (error) {
              console.error(error);

              return;
            }

            const submitButton = document.querySelector('#submit-button');

            submitButton.addEventListener('click', function () {
              dropinInstance.requestPaymentMethod(function (error, payload) {
                if (error) {
                  console.error(error);

                  return;
                }

                // Determine the payment method type
                const paymentMethodType = payload.type;
                console.log(payload);
                console.log(paymentMethodType);
                // Set the appropriate payment method nonce field
                let payment_method_nonce;
                if (paymentMethodType === 'PayPalAccount') {
                  payment_method_nonce = 'paypalAccountNonce';
                } else {
                  payment_method_nonce = 'cardNonce';
                }

                // Prepare the payload to send to the server
                const payloadToSend = {
                  amount: '10.00', // Replace with the desired payment amount
                  payment_method_nonce: payload.nonce
                };

                // Submit the payload to the server
                fetch('/ccstorex/custom/v1/process-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(payloadToSend)
                })
                  .then(response => response.text())
                  .then(result => {
                    console.log(result);
                    // Display the result to the user
                    alert(result);
                  })
                  .catch(error => {
                    console.log(error);
                  });
              });
            });
          }
        );
      });
  }, []);

  return (
    <Styled id="GHWBraintreeWidget" css={css}>
      <div className="GHWBraintreeWidget">
        <div id="dropin-container"></div>
        <button id="submit-button">Pay</button>
      </div>
    </Styled>
  );
};

export default GHWBraintreeWidget;
