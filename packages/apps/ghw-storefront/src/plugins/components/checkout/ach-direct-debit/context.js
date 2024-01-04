import {PaymentsContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {PAYMENT_TYPE_GENERIC} from '@oracle-cx-commerce/commerce-utils/constants';
import {ACCOUNT_TYPE_FIELDS_VALUES, OWNERSHIP_FIELDS_VALUES} from './constants/account-fields';
import {setSelectedPaymentInfo} from '../helpers/payment-info-data';

export const ACHDirectDebitContext = React.createContext({});

const checkFormValidity = formValues => {
  if (!formValues.streetAddress || !formValues.locality || !formValues.region || !formValues.postalCode) {
    return false;
  }

  if (
    formValues.ownershipType === OWNERSHIP_FIELDS_VALUES.PERSONAL &&
    (!formValues.firstName || !formValues.lastName)
  ) {
    return false;
  }

  if (formValues.ownershipType === OWNERSHIP_FIELDS_VALUES.BUSINESS && !formValues.businessName) {
    return false;
  }

  if (!formValues.accountNumber || !formValues.routingNumber) {
    return false;
  }

  return true;
};

const getCommonRequestPayload = formValues => {
  const payload = {
    ownershipType: formValues.ownershipType,
    billingAddress: {
      streetAddress: formValues.streetAddress,
      extendedAddress: formValues.extendedAddress,
      locality: formValues.locality,
      region: formValues.region,
      postalCode: formValues.postalCode
    },
    savePayment: formValues.savePayment
  };

  if (formValues.ownershipType === OWNERSHIP_FIELDS_VALUES.BUSINESS) {
    payload.businessName = formValues.businessName;
  } else {
    payload.firstName = formValues.firstName;
    payload.lastName = formValues.lastName;
  }

  return payload;
};

export const ACDHDirectDebitProvider = ({isUserLoggedIn, mandateText, usBankAccountInstance, children}) => {
  const {addOrUpdatePaymentToContext, setSelectedPaymentType} = useContext(PaymentsContext) || {};

  const requestPayload = useRef(null);
  const addOrUpdatePaymentToContextRef = useRef(addOrUpdatePaymentToContext);
  const setSelectedPaymentTypeRef = useRef(setSelectedPaymentType);

  const [isValidForm, setIsValidForm] = useState(false);
  const [formValues, setFormValues] = useState({
    accountNumber: '',
    accountType: ACCOUNT_TYPE_FIELDS_VALUES.CHECKING,
    businessName: '',
    displayName: '',
    extendedAddress: '',
    firstName: '',
    lastName: '',
    locality: '',
    ownershipType: OWNERSHIP_FIELDS_VALUES.PERSONAL,
    postalCode: '',
    region: '',
    routingNumber: '',
    streetAddress: '',
    ...(isUserLoggedIn && {savePayment: false})
  });

  const setFormFieldValue = useCallback((fieldName, value) => {
    setFormValues(prev => ({...prev, [fieldName]: value}));
  }, []);

  useEffect(() => {
    addOrUpdatePaymentToContextRef.current = addOrUpdatePaymentToContext;
    setSelectedPaymentTypeRef.current = setSelectedPaymentType;
  });

  useEffect(() => {
    setIsValidForm(checkFormValidity(formValues));

    requestPayload.current = {
      accountNumber: formValues.accountNumber,
      routingNumber: formValues.routingNumber,
      accountType: formValues.accountType,
      ...getCommonRequestPayload(formValues)
    };
  }, [formValues]);

  useEffect(() => {
    if (!isValidForm) {
      return;
    }
    setSelectedPaymentTypeRef.current(PAYMENT_TYPE_GENERIC);

    addOrUpdatePaymentToContextRef.current({
      callbackPromise: async () => {
        const {savePayment, ...bankDetails} = requestPayload.current;
        const {nonce, type} = await usBankAccountInstance.tokenize({
          bankDetails,
          mandateText
        });

        setSelectedPaymentInfo({paymentType: 'ach'});

        return {nonce, type, savePayment};
      },
      customProperties: {type: 'us_bank_account'},
      type: PAYMENT_TYPE_GENERIC
    });
  }, [isValidForm, mandateText, usBankAccountInstance]);

  return (
    <ACHDirectDebitContext.Provider value={{formValues, setFormValues, setFormFieldValue}}>
      {children}
    </ACHDirectDebitContext.Provider>
  );
};
