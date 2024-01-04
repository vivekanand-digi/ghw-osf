/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {VALIDATION_CONFIG, VALIDATION_CONFIG_PROFILEADDRESSMANAGER} from '@oracle-cx-commerce/commerce-utils/constants';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';

import Form from '@oracle-cx-commerce/react-components/form';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {fetchShippingCountries} from '@oracle-cx-commerce/fetchers/shipping-countries';
import {setCustomValidity} from '@oracle-cx-commerce/react-components/utils/address';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {useShippingCountriesFetcher} from '@oracle-cx-commerce/fetchers/shipping-countries/hooks';
import {formToJson} from '@oracle-cx-commerce/react-components/utils';
import {t} from '@oracle-cx-commerce/utils/generic';
import {getPageData} from './selectors';
import css from './styles.css';
import ProfileAddressAccountInput from './components/profile-address-account-input';
import {ACCOUNT_TYPE_FIELDS_VALUES, OWNERSHIP_FIELDS_VALUES} from './contants/account-fields';
import {loadACHScript} from '../helpers/profile-ach-loader';
import {useInitializeWidget} from '../../../fetchers/hooks';
import {getTransformedBankDetails} from './utils/bank-details';
import {convertSelectedSavedPaymentToFormValues} from './utils/account';

export const fetchers = [fetchShippingCountries];

const getUSBankAccountInstance = async clientToken => {
  const braintree = await loadACHScript();
  const clientInstance = await braintree.client.create({authorization: clientToken});

  if (clientInstance) {
    const usBankAccountInstance = await braintree.usBankAccount.create({client: clientInstance});

    return usBankAccountInstance;
  }
};

const ProfileAddACHBankAccount = props => {
  const store = useContext(StoreContext);
  const [usBankAccountInstance, setUsBankAccountInstance] = useState(null);
  const {action} = store;
  useInitializeWidget(store);
  useShippingCountriesFetcher(store);

  const {
    clientToken,
    headingAchPayment,
    headingWiewAchPayment,
    textAllFieldsRequired,
    labelCancel,
    labelSave,
    labelBack,
    textInvalidField,
    textRequiredField,
    alertCreatedSuccessfully,
    alertSaveFail,
    mandateText
  } = props;

  const {
    id,
    onActionComplete,
    siteId,
    basicAuth,
    profileId,
    currentProfile,
    selectedSavedAccount,
    shippingCountries = [],
    isB2BUser = false
  } = props;

  const goToPage = useNavigator();
  const [inProgress, setInProgress] = useState(false);
  const formRef = useRef({});
  const [formValues, setFormValues] = useState({});
  const hasSavedPayment = Object.keys(selectedSavedAccount).length;

  const onSuccess = useCallback(() => {
    const message = t(alertCreatedSuccessfully, {accountNumber: formValues.accountNumber});

    action('notify', {level: 'success', message});
    if (onActionComplete) {
      onActionComplete();
    } else {
      goToPage('profile-saved-cards');
    }
  }, [action, alertCreatedSuccessfully, formValues.accountNumber, goToPage, onActionComplete]);

  const onError = useCallback(
    ({error = {}}) => {
      if (onActionComplete) onActionComplete();
      action('notify', {level: 'error', message: error.message || alertSaveFail});
    },
    [action, alertSaveFail, onActionComplete]
  );

  const getFormControlElement = namedItem => {
    return (
      formRef.current &&
      formRef.current.querySelectorAll &&
      formRef.current.querySelectorAll('form') &&
      formRef.current.querySelectorAll('form')[0] &&
      formRef.current.querySelectorAll('form')[0].elements &&
      formRef.current.querySelectorAll('form')[0].elements.namedItem(namedItem)
    );
  };

  useEffect(() => {
    if (hasSavedPayment) {
      const formValuesFromSavedAccount = convertSelectedSavedPaymentToFormValues(selectedSavedAccount);

      return setFormValues(formValuesFromSavedAccount);
    }

    setFormValues({
      firstName: currentProfile.firstName,
      lastName: currentProfile.lastName,
      accountType: ACCOUNT_TYPE_FIELDS_VALUES.CHECKING,
      ownershipType: OWNERSHIP_FIELDS_VALUES.PERSONAL
    });
  }, [currentProfile.firstName, currentProfile.lastName, hasSavedPayment, selectedSavedAccount]);

  useEffect(() => {
    (async () => {
      if (!clientToken && !hasSavedPayment) {
        return;
      }
      const instance = await getUSBankAccountInstance(clientToken);
      setUsBankAccountInstance(instance);
    })();
  }, [clientToken, hasSavedPayment]);

  /**
   * Validate postalCode when country changes
   */
  useEffect(() => {
    const postalCodeEl = getFormControlElement('postalCode');
    const countryEl = getFormControlElement('country');
    if (postalCodeEl && postalCodeEl.value !== '') {
      const country = countryEl ? countryEl.value : '';
      setCustomValidity(postalCodeEl, textInvalidField, textRequiredField, country);
    }
  }, [formValues.country, textInvalidField, textRequiredField]);

  const onFormSubmit = useCallback(
    event => {
      const countryEl = getFormControlElement('country');
      const country = countryEl ? countryEl.value : '';
      setCustomValidity(event, textInvalidField, textRequiredField, country);
    },
    [textInvalidField, textRequiredField]
  );

  const onInputBlur = useCallback(
    event => {
      const countryEl = getFormControlElement('country');
      const country = countryEl ? countryEl.value : '';
      setCustomValidity(event.target, textInvalidField, textRequiredField, country);
    },
    [textInvalidField, textRequiredField]
  );

  const onInputChange = useCallback(
    event => {
      const prop = {};
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      prop[event.target.name] = value;
      setFormValues({...formValues, ...prop});
    },
    [formValues]
  );

  const handleSubmit = event => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target;
    action('notifyClearAll');

    if (form.checkValidity()) {
      const bankDetails = getTransformedBankDetails(formToJson(form));

      usBankAccountInstance
        .tokenize({
          bankDetails,
          mandateText
        })
        .then(function ({nonce, type}) {
          action('addAchPaymentAction', {
            nonce,
            type,
            basicAuth,
            profileId,
            siteId,
            makeDefault: formValues.makeDefault
          }).then(response => {
            if (response.ok) {
              onSuccess();

              return;
            }
            onError(response);
          });
        });
    }

    return false;
  };

  return (
    <Styled id="ProfileAddACHBankAccount" css={css}>
      <div className="ProfileAddACHBankAccount">
        <h1>{hasSavedPayment ? headingWiewAchPayment : headingAchPayment}</h1>
        {!hasSavedPayment && (
          <div className="ProfileAddACHBankAccount__AllFieldsRequiredText" aria-label={textAllFieldsRequired}>
            {textAllFieldsRequired}
          </div>
        )}
        <div ref={formRef}>
          <Form
            onSubmit={handleSubmit}
            setCustomValidity={onFormSubmit}
            setInProgress={setInProgress}
            noValidate
            enableUnsavedChangesTracking={true}
          >
            <ProfileAddressAccountInput
              {...props}
              id={id}
              formValues={formValues}
              validationConfig={isB2BUser ? VALIDATION_CONFIG_PROFILEADDRESSMANAGER : VALIDATION_CONFIG}
              onInputChange={onInputChange}
              onInputBlur={onInputBlur}
              countryList={shippingCountries}
              hasSavedPayment={hasSavedPayment}
            ></ProfileAddressAccountInput>
            <p className="ProfileAddACHBankAccount__MandateText">{mandateText}</p>
            <div className="ProfileAddACHBankAccount__Buttons">
              {hasSavedPayment ? (
                <button
                  type="button"
                  className="ProfileAddACHBankAccount__ConfirmButton"
                  aria-label={labelBack}
                  onClick={() => {
                    goToPage('profile-saved-cards');
                  }}
                >
                  {labelBack}
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="ProfileAddACHBankAccount__ConfirmButton"
                    disabled={inProgress}
                    aria-label={labelSave}
                  >
                    {labelSave}
                  </button>
                  <button
                    disabled={inProgress}
                    type="button"
                    className="ProfileAddACHBankAccount__CancelButton secondary"
                    onClick={() => {
                      goToPage('profile-saved-cards');
                    }}
                    aria-label={labelCancel}
                  >
                    {labelCancel}
                  </button>
                </>
              )}
            </div>
          </Form>
        </div>
      </div>
    </Styled>
  );
};

export default connect(getPageData)(ProfileAddACHBankAccount);
