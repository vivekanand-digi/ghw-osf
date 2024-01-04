import React, {useContext, useState, useEffect} from 'react';
import {StoreContext, PaymentsContext} from '@oracle-cx-commerce/react-ui/contexts';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {getWidgetInfo} from '../../../selectors';
import {useInitializeWidget} from '../../../fetchers/hooks';
import {Braintree} from '../helpers/braintree-loader';
import Styled from '@oracle-cx-commerce/react-components/styled';
import SpinnerContent from '@oracle-cx-commerce/react-components/page-loader/spinner-content';
import {PAYMENT_TYPE_GENERIC} from '@oracle-cx-commerce/commerce-utils/constants';
import siteSettingsReader from '../helpers/site-settings-reader';
import orderRepoReader from '../helpers/order-repo-reader';
import css from './styles.css';
import {loadApplePayScript} from '../helpers/apple-pay-loader';
import {setSelectedPaymentInfo} from '../helpers/payment-info-data';

const amountFormat = n => n.toFixed(2);

const setupApplePayWidget = async props => {
  const {clientToken} = props;
  const braintree = await Braintree();
  const clientInstance = await braintree.client.create({authorization: clientToken});
  const response = await loadApplePayScript();

  if (response) {
    const applePayInstance = await braintree.applePay.create({client: clientInstance});
    return applePayInstance;
  }
};

const ApplePayButton = props => {
  const {clientToken, applePayNotSupportedMsg} = props;
  const [showSpinner, setShowSpinner] = useState(true);
  const [isApplePaySupported, setIsApplePaySupported] = useState(true);
  const [applePayInstance, setApplePayInstance] = useState(null);
  const store = useContext(StoreContext);
  const state = store.getState();
  const {addOrUpdatePaymentToContext, setSelectedPaymentType} = useContext(PaymentsContext) || {};
  const siteName = siteSettingsReader.getSiteTitle(state);
  const paymentAmount = orderRepoReader.getTotalAmountDue(state);
  useInitializeWidget(store);
  useEffect(() => {
    if (!window.ApplePaySession || !window.ApplePaySession.canMakePayments()) {
      setIsApplePaySupported(false);
      return;
    }
    if (!clientToken) {
      return;
    }
    setupApplePayWidget({clientToken}).then(a => {
      setApplePayInstance(a);
      setShowSpinner(false);
    });
  }, [clientToken]);
  return (
    <Styled id="ApplePayButton" css={css}>
      {!isApplePaySupported && <div>{applePayNotSupportedMsg}</div>}
      {showSpinner && isApplePaySupported && (
        <div>
          <SpinnerContent />
        </div>
      )}
      {!showSpinner && isApplePaySupported && (
        <button
          className="apple-pay-button apple-pay-button-black"
          onClick={() => {
            const paymentRequest = applePayInstance.createPaymentRequest({
              countryCode: 'US',
              currencyCode: paymentAmount.currencyCode,
              total: {
                label: siteName,
                type: 'final',
                amount: amountFormat(paymentAmount.amount)
              },
              requiredBillingContactFields: ['postalAddress']
            });
            const session = new window.ApplePaySession(3, paymentRequest);
            session.onvalidatemerchant = event => {
              applePayInstance
                .performValidation({
                  validationURL: event.validationURL,
                  displayName: siteName
                })
                .then(merchantSession => {
                  session.completeMerchantValidation(merchantSession);
                })
                .catch(err => {
                  console.log(err);
                  session.abort();
                });
            };
            session.onpaymentauthorized = event => {
              applePayInstance
                .tokenize({token: event.payment.token})
                .then(payload => {
                  setSelectedPaymentType(PAYMENT_TYPE_GENERIC);
                  addOrUpdatePaymentToContext({
                    customProperties: {nonce: payload.nonce},
                    type: PAYMENT_TYPE_GENERIC
                  });
                  session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
                  setSelectedPaymentInfo({paymentType: 'apple-pay'});
                })
                .catch(err => {
                  console.error(err);
                  session.completePayment(window.ApplePaySession.STATUS_FAILURE);
                });
            };
            session.begin();
          }}
        ></button>
      )}
    </Styled>
  );
};

export default connect(getWidgetInfo)(ApplePayButton);
