import React, {useContext, useEffect, useState, useRef} from 'react';
import {isAuthenticated, getCurrentProfileId} from '@oracle-cx-commerce/commerce-utils/selector';
import {StoreContext, PaymentsContext} from '@oracle-cx-commerce/react-ui/contexts';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {getCreditCards, getWidgetInfo} from '../../../selectors';
import {useInitializeWidget} from '../../../fetchers/hooks';
import Styled from '@oracle-cx-commerce/react-components/styled';
import SpinnerContent from '@oracle-cx-commerce/react-components/page-loader/spinner-content';
import {Braintree} from '../helpers/braintree-loader';
import {PAYMENT_TYPE_GENERIC} from '@oracle-cx-commerce/commerce-utils/constants';
import {validateFields} from './validate';
import Field from './field';
import orderRepoReader from '../helpers/order-repo-reader';
import {PaymentMethodsContext} from '../payment-methods-container';
import paymentSettingsReader from '../helpers/payment-settings-reader';
import {setSelectedPaymentInfo} from '../helpers/payment-info-data';
import Dropdown from '@oracle-cx-commerce/react-components/dropdown';
import Alert from '@oracle-cx-commerce/react-components/alert';
import Checkbox from '@oracle-cx-commerce/react-components/checkbox';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';

const NEW_CARD_SELECTED = 'NEW_CARD_SELECTED';

const loadBraintreeWidget = async (props, state) => {
  const {
    clientToken,
    cardHolderNamePlaceHolder,
    cardNumberPlaceHolder,
    cardExpirationPlaceHolder,
    cardCvvPlaceHolder,
    cardPostalCodePlaceHolder
  } = props;
  // const {setLoading, setThreeDSecureState, setDataCollectorState, setHostedFieldsState} = state;
  const {setLoading, setThreeDSecureState, setHostedFieldsState} = state;
  const braintree = await Braintree();
  const clientInstance = await braintree.client.create({authorization: clientToken});
  const threeDSecureInstance = await braintree.threeDSecure.create({authorization: clientToken, version: 2});
  // const dataCollectorInstance = await braintree.dataCollector.create({client: clientInstance});
  const hostedFieldsInstance = await braintree.hostedFields.create({
    client: clientInstance,
    fields: {
      cardholderName: {
        selector: '#card-name',
        placeholder: cardHolderNamePlaceHolder
      },
      number: {
        selector: '#card-number',
        placeholder: cardNumberPlaceHolder
      },
      cvv: {
        selector: '#card-cvv',
        placeholder: cardCvvPlaceHolder
      },
      expirationDate: {
        selector: '#card-expiration',
        placeholder: cardExpirationPlaceHolder
      },
      postalCode: {
        selector: '#card-postal-code',
        placeholder: cardPostalCodePlaceHolder
      }
    }
  });
  setLoading(false);
  setThreeDSecureState(threeDSecureInstance);
  // setDataCollectorState(dataCollectorInstance);
  setHostedFieldsState(hostedFieldsInstance);
};

const submitPaymentHandler = async state => {
  const {hostedFieldsState, threeDSecureState, paymentAmount, settings} = state;
  let payload = await hostedFieldsState.tokenize();
  if (settings.enable3DSecure) {
    payload = await threeDSecureState.verifyCard({
      onLookupComplete: function (_data, next) {
        next();
      },
      amount: paymentAmount.amount,
      nonce: payload.nonce,
      bin: payload.details.bin,
      email: '',
      billingAddress: {
        givenName: '',
        surname: '',
        phoneNumber: '', // remove (), spaces, and - from phone number
        streetAddress: '',
        extendedAddress: '',
        locality: '',
        region: '',
        postalCode: '',
        countryCodeAlpha2: ''
      }
    });
  }
  // place order
  console.log('result: ', payload);
  setSelectedPaymentInfo({paymentType: 'credit-card'});
  return payload.nonce;
};

const CreditCardHostedFields = props => {
  const {setLoading} = useContext(PaymentMethodsContext);
  const {addOrUpdatePaymentToContext, setSelectedPaymentType, payments} = useContext(PaymentsContext) || {};
  const {clientToken, newCardOptionLabel, savedPaymentCreditCardLabel, saveNewCardCheckboxLabel} = props;
  const store = useContext(StoreContext);
  const [threeDSecureState, setThreeDSecureState] = useState(null);
  // const [dataCollectorState, setDataCollectorState] = useState(null);
  const [hostedFieldsState, setHostedFieldsState] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);
  const [actionCompletedSuccessfully, setActionCompletedSuccessfully] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const {action, getState} = store;
  const state = getState();
  const paymentAmount = orderRepoReader.getTotalAmountDue(state);
  const settings = paymentSettingsReader.getPaymentWidgetSettings(state);
  const [actionResponse, setActionResponse] = useState({type: '', message: ''});
  // const savedPaymentCards = getCreditCards(state);
  const [selectedSavedCard, setSelectedSavedCard] = useState(NEW_CARD_SELECTED);
  const saveCardOnVault = useRef(false);
  const paymentSeqNo = useRef();
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  useInitializeWidget(store);

  useEffect(() => {
    if (!clientToken) {
      return;
    }

    if (isUserLoggedIn && !actionCompletedSuccessfully && !errorOccured) {
      action('getShopperProfile').then(response => {
        if (response.ok) {
          setActionCompletedSuccessfully(true);
        }
        if (!response.ok) {
          const {error} = response;
          setActionResponse({type: 'error', message: error.message});
          setErrorOccured(true);
        }
      });

      return;
    }

    // setLoading(true);
    loadBraintreeWidget(props, {
      setLoading,
      setThreeDSecureState,
      // setDataCollectorState,
      setHostedFieldsState
    }).then();
  }, [action, actionCompletedSuccessfully, errorOccured, clientToken, isUserLoggedIn]);

  useEffect(() => {
    if (!hostedFieldsState) {
      return;
    }
    hostedFieldsState.on('validityChange', function (event) {
      const areAllFieldsValid = Object.values(event.fields).every(fieldVal => fieldVal.isValid);
      if (areAllFieldsValid) {
        setSelectedPaymentType(PAYMENT_TYPE_GENERIC);
        paymentSeqNo.current = addOrUpdatePaymentToContext({
          callbackPromise: async () => {
            const nonce = await submitPaymentHandler({hostedFieldsState, threeDSecureState, paymentAmount, settings});

            return {nonce};
          },
          customProperties: {savePayment: saveCardOnVault.current},
          type: PAYMENT_TYPE_GENERIC
        });
      }
    });
  }, [hostedFieldsState]);

  // useEffect(() => {
  //   if (savedPaymentCards.length === 0) {
  //     return;
  //   }
  //   const defaultPaymentList = savedPaymentCards.filter(card => card.default)[0];
  //   const paymentMethodToken = !!defaultPaymentList ? defaultPaymentList.token : NEW_CARD_SELECTED;
  //   setSelectedSavedCard(paymentMethodToken);
  //   addOrUpdatePaymentToContext({
  //     customProperties: {paymentMethodToken},
  //     type: PAYMENT_TYPE_GENERIC
  //   });
  // }, [savedPaymentCards]);

  // const handleSelectSavedCard = useCallback(
  //   e => {
  //     const paymentMethodToken = e.currentTarget.value;
  //     setSelectedSavedCard(paymentMethodToken);

  //     if (paymentMethodToken !== NEW_CARD_SELECTED) {
  //       return addOrUpdatePaymentToContext({
  //         customProperties: {paymentMethodToken},
  //         type: PAYMENT_TYPE_GENERIC
  //       });
  //     }

  //     removePaymentFromContextByType(PAYMENT_TYPE_GENERIC);
  //   },
  //   [addOrUpdatePaymentToContext, setSelectedSavedCard]
  // );

  // labels from resource
  const {
    // submitButtonLabel,
    cardHolderNameInputLabel,
    cardNumberInputLabel,
    cardExpirationInputLabel,
    cardCvvInputLabel,
    cardPostalCodeInputLabel,
    id
  } = props;
  return (
    <Styled id="CreditCardHostedFields" css={css}>
      {actionResponse.message && actionResponse.type && (
        <div className="CreditCardHostedFields__ActionResponse">
          <Alert id="CreditCardHostedFields__Alert" type={actionResponse.type} message={actionResponse.message} />
        </div>
      )}
      {/* {savedPaymentCards.length > 0 ? (
        <div className="CreditCardHostedFields__saved-payment">
          <Dropdown
            id={`CreditCardHostedFields-saved-card-${id}`}
            name={`CreditCardHostedFields-saved-card-${id}`}
            label={savedPaymentCreditCardLabel}
            aria-label={savedPaymentCreditCardLabel}
            value={selectedSavedCard}
            onChange={handleSelectSavedCard}
          >
            {savedPaymentCards.map(({token, cardType, last4, expirationDate, expired}, index) => (
              <option
                tabIndex={0}
                value={token}
                key={token}
                aria-label={`${cardType} ${last4} ${expirationDate}`}
                disabled={expired}
              >
                {`${cardType} ${last4} ${expirationDate}`}
              </option>
            ))}
            <option value={NEW_CARD_SELECTED} aria-label={newCardOptionLabel}>
              {newCardOptionLabel}
            </option>
          </Dropdown>
        </div>
      ) : null} */}

      <div
        className="CreditCardHostedFields"
        style={{
          display: selectedSavedCard !== NEW_CARD_SELECTED ? 'none' : 'block'
        }}
      >
        <Field id="card-name" label={cardHolderNameInputLabel} invalid={invalidFields.includes('cardholderName')} />
        <Field id="card-number" label={cardNumberInputLabel} invalid={invalidFields.includes('number')} />
        <Field
          id="card-expiration"
          label={cardExpirationInputLabel}
          invalid={invalidFields.includes('expirationDate')}
        />
        <Field id="card-cvv" label={cardCvvInputLabel} invalid={invalidFields.includes('cvv')} />
        <Field id="card-postal-code" label={cardPostalCodeInputLabel} invalid={invalidFields.includes('postalCode')} />
        {isUserLoggedIn && settings.enabledSavePayment && (
          <div className="CreditCardHostedFields__FieldGroup">
            <Checkbox
              id={`CreditCardHostedFields-save-card-option-${id}`}
              name={`CreditCardHostedFields-save-card-option-${id}`}
              labelText={saveNewCardCheckboxLabel}
              onChange={e => {
                saveCardOnVault.current = e.currentTarget.checked;

                if (paymentSeqNo.current !== undefined) {
                  const ccPayment = payments.find(payment => payment.seqNum === paymentSeqNo.current);
                  if (!ccPayment) {
                    return;
                  }
                  addOrUpdatePaymentToContext({...ccPayment, customProperties: {savePayment: saveCardOnVault.current}});
                }
              }}
            />
          </div>
        )}
      </div>
    </Styled>
  );
};

export default connect(getWidgetInfo)(CreditCardHostedFields);
