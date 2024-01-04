import {connect} from '@oracle-cx-commerce/react-components/provider';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {PaymentsContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {getWidgetInfo} from '../../../selectors';
import {Braintree} from '../helpers/braintree-loader';
import orderRepoReader from '../helpers/order-repo-reader';
import paymentSettingsReader from '../helpers/payment-settings-reader';
import {loadLocalPaymentScript} from '../helpers/local-payment-loader';
import {setSelectedPaymentInfo} from '../helpers/payment-info-data';
import css from './styles.css';

const setupWidget = async props => {
  const {clientToken, settings} = props;
  const {environment, merchantAccountId} = settings;
  const braintree = await Braintree({environment});
  const client = await braintree.client.create({authorization: clientToken});
  const response = await loadLocalPaymentScript();

  if (response) {
    const instance = await braintree.localPayment.create({
      client,
      merchantAccountId
    });
    return instance;
  }
};

const LocalPaymentButton = props => {
  const {
    clientToken,
    notSupportedMessage,
    mobileAppRedirectButtonLabel,
    testMode = false,
    testModeCountry = 'PL',
    testModeCurrency = 'PLN',
    testMerchantAccountId = 'EUR_local'
  } = props;
  const {addOrUpdatePaymentToContext, setSelectedPaymentType} = useContext(PaymentsContext) || {};
  const store = useContext(StoreContext);
  const state = store.getState();
  const [localPaymentInstance, setLocalPaymentInstance] = useState();
  const paymentAmount = orderRepoReader.getTotalAmountDue(state);
  const shippingAddress = orderRepoReader.getShippingAddress(state);
  const settings = paymentSettingsReader.getPaymentWidgetSettings(state);
  if (testMode) {
    settings.merchantAccountId = testMerchantAccountId;
  }

  const handlePayment = useCallback(
    paymentType => {
      if (!localPaymentInstance) {
        return;
      }

      localPaymentInstance
        .startPayment({
          paymentType,
          amount: paymentAmount.amount.toFixed(2),
          fallback: {
            url: document.URL,
            buttonText: mobileAppRedirectButtonLabel
          },
          paymentTypeCountryCode: testMode ? testModeCountry : shippingAddress.country,
          currencyCode: testMode ? testModeCurrency : paymentAmount.currencyCode,
          shippingAddressRequired: true,
          email: shippingAddress.email,
          phone: shippingAddress.phoneNumber,
          givenName: shippingAddress.firstName,
          surname: shippingAddress.lastName,
          address: {
            streetAddress: shippingAddress.address1,
            extendedAddress: `${shippingAddress.address1} ${
              !!shippingAddress.address3 ? ',' + shippingAddress.address3 : ''
            }`,
            locality: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            region: shippingAddress.state,
            countryCode: shippingAddress.country
          },
          onPaymentStart: function (data, start) {
            // NOTE: It is critical here to store data.paymentId on your server
            //       so it can be mapped to a webhook sent by Braintree once the
            //       buyer completes their payment. See Start the payment
            //       section for details.

            // Call start to initiate the popup
            start();
          }
        })
        .then(function (payload) {
          // Send the nonce to your server to create a transaction
          const nonce = testMode ? 'fake-valid-nonce' : payload.nonce;
          setSelectedPaymentType('generic');
          addOrUpdatePaymentToContext({
            customProperties: {nonce},
            type: 'generic'
          });
          setSelectedPaymentInfo({paymentType: 'local-payment'});
        })
        .catch(function (err) {
          if (err.code === 'LOCAL_PAYMENT_POPUP_CLOSED') {
            console.error('Customer closed Local Payment popup.');
          } else {
            console.error('Error!', err);
          }
        });
    },
    [
      localPaymentInstance,
      mobileAppRedirectButtonLabel,
      paymentAmount,
      addOrUpdatePaymentToContext,
      setSelectedPaymentType,
      shippingAddress
    ]
  );

  useEffect(() => {
    if (!clientToken) {
      return;
    }
    setupWidget({
      ...props,
      paymentAmount,
      settings
    }).then(response => {
      setLocalPaymentInstance(response);
    });
  }, [clientToken]);

  return (
    <Styled id="LocalPaymentButton" css={css}>
      {localPaymentInstance ? (
        settings.acceptedLocalPayments.map(payments => (
          <button
            key={`local-payment-${payments}`}
            className={`LocalPaymentButton__Action LocalPaymentButton__Action--${payments}`}
            onClick={() => handlePayment(payments)}
            disabled={!localPaymentInstance}
          >
            <span className="sr-only">{`Local payment ${payments}`}</span>
          </button>
        ))
      ) : (
        <p className="LocalPaymentButton__message">{notSupportedMessage}</p>
      )}
    </Styled>
  );
};

export default connect(getWidgetInfo)(LocalPaymentButton);
