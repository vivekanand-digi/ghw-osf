import Styled from '@oracle-cx-commerce/react-components/styled';
import React, {createContext, useContext, useState, useEffect} from 'react';

import Alert from '@oracle-cx-commerce/react-components/alert';
import Region from '@oracle-cx-commerce/react-components/region';
import {PaymentsContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import SpinnerContent from '@oracle-cx-commerce/react-components/page-loader/spinner-content';
import Card from '@oracle-cx-commerce/react-components/card';
import Radio from '@oracle-cx-commerce/react-components/radio';
import Badge from '@oracle-cx-commerce/react-components/badge';
import {getRegion, getWidget, isAuthenticated, getCurrentProfileId} from '@oracle-cx-commerce/commerce-utils/selector';
import css from './payment-option-list.css';
import {setSelectedPaymentInfo} from '../../../helpers/payment-info-data';
import {compareSavedPayments} from '../../../helpers/saved-payment-comparer';
import {getPaymentType, getPaymentDescription} from '../../../payment-methods-container/utils/payment';

const PaymentSavedPaymentMethods = props => {
  const {
    textSavedPaymentBankDescription = '__bankName__ with last 4 digit __last4__',
    selectedPaymentMethodLabel = 'Selected',
    useThisPaymentMethodButtonLabel = 'Use this payment method',
    addMethod,
    setAddMethod
  } = props;
  const store = useContext(StoreContext);
  const state = store.getState();
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';

  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [actionCompletedSuccessfully, setActionCompletedSuccessfully] = useState(false);
  const [actionResponse, setActionResponse] = useState({type: '', message: ''});
  const [errorOccured, setErrorOccured] = useState(false);
  const [paymentMethodToken, setPaymentMethodToken] = useState('');
  const [selectedNewPaymentMethod, setSelectedNewPaymentMethod] = useState(!isUserLoggedIn);

  useEffect(() => {
    if (isUserLoggedIn && !actionCompletedSuccessfully && !errorOccured) {
      store.action('getShopperProfile').then(response => {
        if (response.ok) {
          const {paymentMethods} = response.delta.shopperProfileRepository.profile;
          if (paymentMethods.length) {
            // setAddMethod(false);
          } else {
            // setAddMethod(true);
          }
          setSavedPaymentMethods(paymentMethods);
          setActionCompletedSuccessfully(true);
        }
        if (!response.ok) {
          const {error} = response;
          setSavedPaymentMethods([]);
          setAddMethod(true);
          setActionResponse({type: 'error', message: error.message});
          setErrorOccured(true);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoggedIn]);
  useEffect(() => {
    if (savedPaymentMethods) {
      const defaultPaymentMethod = savedPaymentMethods.find(p => p.default);
      if (defaultPaymentMethod) {
        const p = defaultPaymentMethod;
        const paymentType = getPaymentType(p);
        setPaymentMethodToken(defaultPaymentMethod.token);
        setSelectedPaymentInfo({imageUrl: defaultPaymentMethod.imageUrl, paymentType});
      }
    }
  }, [savedPaymentMethods]);

  const hasSavedPayments = !!savedPaymentMethods && !!savedPaymentMethods.length;

  const getSelected = (paymentMethodToken, token) => {
    if (addMethod) {
      return false;
    }

    return paymentMethodToken === token;
  };

  return (
    <Styled id="PaymentMethodsContainer" css={css}>
      <ul className="PaymentMethodsContainer__Items payment-list">
        {isUserLoggedIn && hasSavedPayments && (
          <>
            {!selectedNewPaymentMethod &&
              savedPaymentMethods.sort(compareSavedPayments).map(p => (
                <li key={p.globalId} className="PaymentMethodsContainer__Item">
                  <Radio
                    className="CheckoutSavedCards__RadioButton"
                    id={p.token}
                    name={getPaymentDescription(p, {
                      textSavedPaymentBankDescription
                    })}
                    value={getPaymentDescription(p, {
                      textSavedPaymentBankDescription
                    })}
                    checked={getSelected(paymentMethodToken, p.token)}
                    disabled={false}
                    onChange={() => {
                      const paymentType = getPaymentType(p);
                      setAddMethod(false);
                      setPaymentMethodToken(p.token);
                      setSelectedPaymentInfo({imageUrl: p.imageUrl, paymentType});
                    }}
                  ></Radio>
                  <div className="PaymentMethodsContainer__CardDetails">
                    <span>
                      {getPaymentDescription(p, {
                        textSavedPaymentBankDescription
                      })}
                    </span>
                  </div>
                  <div>
                    <div>
                      <img src={p.imageUrl} alt="payment-method"></img>
                    </div>
                  </div>
                </li>
              ))}
          </>
        )}
        <li className="PaymentMethodsContainer__Item">
          <Radio
            className="CheckoutSavedCards__RadioButton"
            id="addMethod"
            name="addMethod"
            value="addMethod"
            checked={addMethod}
            disabled={false}
            onChange={() => {
              setAddMethod(true);
            }}
          ></Radio>
          <div>Add new payment method</div>
        </li>
      </ul>
    </Styled>
  );
};

export default PaymentSavedPaymentMethods;
