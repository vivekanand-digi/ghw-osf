import {PAYMENT_TYPE_GENERIC} from '@oracle-cx-commerce/commerce-utils/constants';
import SpinnerContent from '@oracle-cx-commerce/react-components/page-loader/spinner-content';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {PaymentsContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useInitializeWidget} from '../../../fetchers/hooks';
import {getWidgetInfo} from '../../../selectors';
import {Braintree} from '../helpers/braintree-loader';
import {loadGooglePayScript} from '../helpers/google-pay-loader';
import orderRepoReader from '../helpers/order-repo-reader';
import siteSettingsReader from '../helpers/site-settings-reader';
import css from './styles.css';
import paymentSettingsReader from '../helpers/payment-settings-reader';
import {setSelectedPaymentInfo} from '../helpers/payment-info-data';

const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
};

const getGoogleIsReadyToPayRequest = allowedPaymentMethods => {
  return Object.assign({}, baseRequest, {
    allowedPaymentMethods
  });
};

const getGoogleTransactionInfo = (totalPrice, currencyCode) => {
  return {
    countryCode: 'US',
    totalPriceLabel: 'Total',
    totalPriceStatus: 'FINAL',
    currencyCode,
    totalPrice: totalPrice.toString()
  };
};

const getGooglePaymentDataRequest = (allowedPaymentMethods, transactionInfo) => {
  const paymentDataRequest = Object.assign({}, baseRequest);
  const {amount, currencyCode, merchantName, googlePayMerchantId} = transactionInfo;
  paymentDataRequest.allowedPaymentMethods = allowedPaymentMethods;
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo(amount, currencyCode);
  paymentDataRequest.merchantInfo = {
    // @todo a merchant ID is available for a production environment after approval by Google
    // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
    merchantId: googlePayMerchantId,
    merchantName
  };

  return paymentDataRequest;
};

const loadGooglePayWidget = async props => {
  const {clientToken, paymentAmount, addOrUpdatePaymentToContext, merchantName, settings} = props;
  const braintree = await Braintree();
  const google = await loadGooglePayScript();
  const googlePayEnv = settings.environment === 'sandbox' ? 'TEST' : 'PRODUCTION';
  const googlePayMerchantId = settings.googlePayMerchantId;
  var paymentsClient = new google.payments.api.PaymentsClient({
    environment: googlePayEnv
  });

  braintree.client
    .create({
      authorization: clientToken
    })
    .then(function (clientInstance) {
      return braintree.googlePayment.create({
        client: clientInstance,
        googlePayVersion: 2
      });
    })
    .then(function (googlePaymentInstance) {
      const {allowedPaymentMethods} = googlePaymentInstance.createPaymentDataRequest();
      const isReadyToPayRequest = Object.assign({}, baseRequest);

      paymentsClient
        .isReadyToPay(getGoogleIsReadyToPayRequest(allowedPaymentMethods))
        .then(function (response) {
          if (response.result) {
            const button = paymentsClient.createButton({
              onClick: () => {
                const paymentDataRequest = getGooglePaymentDataRequest([allowedPaymentMethods[0]], {
                  amount: paymentAmount.amount,
                  currencyCode: paymentAmount.currencyCode,
                  merchantName,
                  googlePayMerchantId
                });

                paymentsClient
                  .loadPaymentData(paymentDataRequest)
                  .then(paymentData => {
                    return googlePaymentInstance.parseResponse(paymentData);
                  })
                  .then(result => {
                    addOrUpdatePaymentToContext({
                      customProperties: {nonce: result.nonce},
                      type: PAYMENT_TYPE_GENERIC
                    });
                    setSelectedPaymentInfo({paymentType: 'google-pay'});
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            });
            document.getElementById('container').appendChild(button);
          }
        })
        .catch(function (err) {
          // show error in developer console for debugging
          console.error(err);
        });
    });
};

const GooglePayButton = props => {
  const {clientToken, termsOfServiceURL, privacyPolicyURL, cancellationTermsURL} = props;
  const store = useContext(StoreContext);
  const {addOrUpdatePaymentToContext, setSelectedPaymentType} = useContext(PaymentsContext) || {};
  const state = store.getState();
  const paymentAmount = orderRepoReader.getTotalAmountDue(state);
  const merchantName = siteSettingsReader.getSiteTitle(state);
  const settings = paymentSettingsReader.getPaymentWidgetSettings(state);
  const [loading, setLoading] = useState(false);
  useInitializeWidget(store);

  useEffect(() => {
    if (!clientToken) {
      return;
    }

    const fetchWidget = async () => {
      setLoading(true);
      await loadGooglePayWidget({
        ...props,
        paymentAmount,
        addOrUpdatePaymentToContext,
        merchantName,
        settings
      });
      setSelectedPaymentType(PAYMENT_TYPE_GENERIC);
      setLoading(false);
    };
    fetchWidget();
  }, [clientToken]);

  return (
    <Styled id="GooglePayButton" css={css}>
      <div className="GooglePay">
        {loading ? (
          <SpinnerContent className="loader" />
        ) : (
          <>
            <p>
              By submitting to this form, you agree to our{' '}
              <a href={termsOfServiceURL} target="_blank">
                terms of service
              </a>{' '}
              and <a href={privacyPolicyURL}>privacy policy</a>
            </p>
            <p>
              See offer details and cancellation terms{' '}
              <a href={cancellationTermsURL} target="_blank">
                here
              </a>
            </p>
            <p>
              If you do not want to see wish to received information about Nord services. Please send us an email at
              privacy@nordaccount.com.
            </p>
            <div id="container"></div>
            <ul className="GooglePay__payment-notes">
              <li>You're 100% backed by our 30-day money-back guarantee.</li>
              <li>Follow the instruction on screen to complete your purchase securely.</li>
              <li>
                Payments are charged in {paymentAmount.currencyCode}. Payment provider fees may apply. Plan
                automatically renew until cancelled.
              </li>
            </ul>
          </>
        )}
      </div>
    </Styled>
  );
};

export default connect(getWidgetInfo)(GooglePayButton);
