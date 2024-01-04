import React, {useContext, useEffect, useState} from 'react';
import {StoreContext, PaymentsContext} from '@oracle-cx-commerce/react-ui/contexts';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {getWidgetInfo} from '../../../selectors';
import {useInitializeWidget} from '../../../fetchers/hooks';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {Braintree} from '../helpers/braintree-loader';
import {PAYMENT_TYPE_GENERIC} from '@oracle-cx-commerce/commerce-utils/constants';
import orderRepoReader from '../helpers/order-repo-reader';
import paymentSettingsReader from '../helpers/payment-settings-reader';
import Alert from '@oracle-cx-commerce/react-components/alert';
import {updateShippingAddress} from './utils';
import css from './styles.css';
import {setSelectedPaymentInfo} from '../helpers/payment-info-data';
import {loadVisaCheckoutScript} from '../helpers/visa-checkout-loader';

const amountFormat = n => n.toFixed(2);

const setupWidget = async props => {
  const {clientToken, paymentAmount, settings} = props;
  const braintree = await Braintree({environment: settings.environment});
  const client = await braintree.client.create({authorization: clientToken});
  const scriptResponse = await loadVisaCheckoutScript(settings.environment);
  const {currencyCode, amount} = paymentAmount;

  try {
    if (scriptResponse) {
      const visaCheckoutInstance = await braintree.visaCheckout.create({client});
      const initOptions = visaCheckoutInstance.createInitOptions({
        paymentRequest: {
          currencyCode,
          subtotal: amountFormat(amount)
        }
      });
      V.init(initOptions);
      return await visaCheckoutInstance;
    }
  } catch (error) {
    return error;
  }
};

const SecureRemoteCommerceButton = props => {
  const {addOrUpdatePaymentToContext, setSelectedPaymentType} = useContext(PaymentsContext) || {};
  const {clientToken} = props;
  const [actionResponse, setActionResponse] = useState({type: '', message: ''});
  const store = useContext(StoreContext);
  const state = store.getState();
  const paymentAmount = orderRepoReader.getTotalAmountDue(state);
  const settings = paymentSettingsReader.getPaymentWidgetSettings(state);
  useInitializeWidget(store);
  useEffect(() => {
    if (!clientToken || !settings) {
      return;
    }
    setupWidget({
      ...props,
      paymentAmount,
      settings
      // setShowSpinner: setLoading
    }).then(instance => {
      V.on('payment.success', payment => {
        instance
          .tokenize(payment)
          .then(payload => {
            updateShippingAddress(store, payload).then(() => {
              console.log('SRC payment payload: ', payload);
              setSelectedPaymentType(PAYMENT_TYPE_GENERIC);
              addOrUpdatePaymentToContext({
                customProperties: {nonce: payload.nonce},
                type: PAYMENT_TYPE_GENERIC
              });
              setSelectedPaymentInfo({paymentType: 'secure-remote-commerce'});
            });
          })
          .catch(err => {
            setActionResponse({type: 'error', message: err.message});
          });
      });
    });
  });
  const btnImg = `https://${
    !!settings && settings.environment === 'sandbox' ? 'sandbox.' : ''
  }secure.checkout.visa.com/wallet-services-web/xo/button.png`;
  return (
    <Styled id="SecureRemoteCommerceButton" css={css}>
      {actionResponse.message && actionResponse.type && (
        <div className="ProfileDeleteSavedCard__ActionResponse">
          <Alert
            id={`ProfileAddCreditCard__Alert-${props.id}`}
            type={actionResponse.type}
            message={actionResponse.message}
          />
        </div>
      )}
      <img src={btnImg} alt="Visa Checkout" className="v-button" role="button" />
    </Styled>
  );
};

export default connect(getWidgetInfo)(SecureRemoteCommerceButton);
