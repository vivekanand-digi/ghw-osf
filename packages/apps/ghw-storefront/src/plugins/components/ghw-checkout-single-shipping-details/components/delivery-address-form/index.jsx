/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback, useContext, useState, useEffect, useMemo, useRef} from 'react';
import {
  getAddressManagerRoles,
  setCustomValidity,
  isAddressValid,
  getSortedArray,
  getDefaultCountry
} from '@oracle-cx-commerce/react-components/utils/address';
import {VALIDATION_CONFIG} from '@oracle-cx-commerce/commerce-utils/constants';
import {noop, isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import Checkbox from '@oracle-cx-commerce/react-components/checkbox';
import Form from '@oracle-cx-commerce/react-components/form';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {CheckoutShippingContext} from '@oracle-cx-commerce/react-widgets/checkout/checkout-shipping-container/context';
import Styled from '@oracle-cx-commerce/react-components/styled';
import PropTypes from 'prop-types';
import ProfileAddressInput from '../../../profile/ghw-profile-address-form/components/profile-address-input';
import {getComponentData} from './selectors';
import css from './delivery-address-form.css';

/**
 * Component to render shipping address form for guest and user without any saved address
 * @param {Object} props The properties object
 * @memberof Components
 * @class CheckoutDeliveryAddressForm
 * @category Component-list
 * @param {String} textAllFieldsRequired - Text specifying all fields are required
 * @param {String} textInvalidField - Label for invalid field
 * @param {String} textRequiredField - Label for required field
 * @param {String} labelSaveAsANewProfileAddress - Locale save as new profile address
 * @param {String} labelSaveAsANewAccountAddress - Locale save as new account address
 * @param {Boolean} isUserLoggedIn - Boolean flag to indicate if the user is logged in
 * @param {Boolean} isB2BUser - Boolean indicating if the user is a B2B user.
 * @param {String} id - Unique id for the component
 * @param {Array} [shippingCountries = []] - The countries object from redux state(countryRegionRepository->shippingCountries)
 * @param {String} defaultShippingCountry - Default shipping country code
 * @param {Array} roles - The roles (user roles) object from redux state(ProfileRepository->roles)
 * @author Oracle
 */
const CheckoutDeliveryAddressForm = props => {
  // resources
  const {
    textAllFieldsRequired,
    textInvalidField,
    textRequiredField,
    labelSaveAsANewProfileAddress,
    labelSaveAsANewAccountAddress
  } = props;

  const {id, shippingCountries = [], defaultShippingCountry, isUserLoggedIn, isB2BUser, roles} = props;

  const addressManagerRoles = useMemo(() => getAddressManagerRoles(roles), [roles]);
  /* For B2C user, checkbox will be default checked */
  const [saveAsANewProfileAddress, setSaveAsANewProfileAddress] = useState(isUserLoggedIn && !isB2BUser);
  const [saveAsANewAccountAddress, setSaveAsANewAccountAddress] = useState(false);

  const {setShippingStatus, setDeliveryAddressForm = noop} = useContext(CheckoutShippingContext);
  const [address, setAddress] = useState({});
  const shippingAddressFormRef = useRef({});

  /**
   * Returns  default shipping country and its regions
   */
  const getDefaultShippingCountryRegions = useCallback(() => {
    // Sets country to the defaultShippingCountry or the  first country in the countries list
    let state = '',
      country = '',
      stateList = [];
    if (shippingCountries) {
      country = getDefaultCountry(shippingCountries, defaultShippingCountry);
      // set regions according to the default shipping country
      stateList = shippingCountries[country] ? shippingCountries[country].regions : [];
      state = stateList.length > 0 ? getSortedArray(stateList, 'displayName')[0].abbreviation : '';
    }

    return {country, state};
  }, [shippingCountries, defaultShippingCountry]);

  /**
   * Sets default shipping country and its regions when shippingCountries data is loaded
   */
  useEffect(() => {
    if (!isEmptyObject(shippingCountries)) {
      const {state, country} = getDefaultShippingCountryRegions();
      setAddress(address => {
        return {
          ...address,
          state,
          country
        };
      });
    }
  }, [shippingCountries, getDefaultShippingCountryRegions]);

  /**
   * Returns HTMLFormControlsCollection element or array
   */
  const getFormControls = () => {
    return (
      shippingAddressFormRef.current &&
      shippingAddressFormRef.current.querySelectorAll &&
      shippingAddressFormRef.current.querySelectorAll('form') &&
      shippingAddressFormRef.current.querySelectorAll('form')[0] &&
      shippingAddressFormRef.current.querySelectorAll('form')[0].elements
    );
  };
  const getFormControlElement = useCallback(namedItem => {
    return getFormControls() && getFormControls().namedItem(namedItem);
  }, []);

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
  }, [address.country, getFormControlElement, textInvalidField, textRequiredField]);

  const onFormSubmit = useCallback(
    event => {
      const countryEl = getFormControlElement('country');
      const country = countryEl ? countryEl.value : '';
      setCustomValidity(event, textInvalidField, textRequiredField, country);
    },
    [getFormControlElement, textInvalidField, textRequiredField]
  );

  const onInputBlur = useCallback(
    event => {
      const countryEl = getFormControlElement('country');
      const country = countryEl ? countryEl.value : '';
      setCustomValidity(event.target, textInvalidField, textRequiredField, country);
    },
    [getFormControlElement, textInvalidField, textRequiredField]
  );

  /**
   * Checks whether all fields in delivery address form is valid
   */
  const isAddressFormValid = useCallback(() => {
    let isValid = true;
    Array.from(getFormControls() || []).forEach(item => {
      if (item.classList.contains('AddressInput__Invalid')) {
        isValid = false;
      }
    });

    return isValid;
  }, []);

  /**
   * Updates the deliveryAddressForm on every input field change
   */
  useEffect(() => {
    if (address) {
      const isAddressInputValid = isAddressValid(address, isB2BUser) && isAddressFormValid();
      setShippingStatus(prevState => {
        return {...prevState, enableContinue: isAddressInputValid, loadShippingMethods: isAddressInputValid};
      });
      setDeliveryAddressForm(prevState => {
        return {...prevState, address, saveAsANewProfileAddress, saveAsANewAccountAddress, isModified: true};
      });
    }
  }, [
    address,
    isAddressFormValid,
    isB2BUser,
    saveAsANewAccountAddress,
    saveAsANewProfileAddress,
    setDeliveryAddressForm,
    setShippingStatus
  ]);

  /**
   * Function to handle the onChange event callback
   */
  const onInputChange = useCallback(
    event => {
      const prop = {};
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      prop[event.target.name] = value;
      if (event.target.name === 'country') {
        const stateList = shippingCountries[value] ? shippingCountries[value].regions : [];
        const state = stateList.length > 0 ? getSortedArray(stateList, 'displayName')[0].abbreviation : '';
        setAddress({...address, ...prop, state});
      } else {
        setAddress({...address, ...prop});
      }
    },
    [shippingCountries, address]
  );

  return (
    <Styled id="CheckoutDeliveryAddressForm" css={css}>
      <div className="DeliveryAddressForm">
        {/* <div className="DeliveryAddressForm__AllFieldsRequiredText" aria-label={textAllFieldsRequired}>
          {textAllFieldsRequired}
        </div> */}
        <div ref={shippingAddressFormRef}>
          <Form setCustomValidity={onFormSubmit} noValidate>
            <ProfileAddressInput
              countryList={shippingCountries}
              address={address}
              onInputChange={onInputChange}
              onInputBlur={onInputBlur}
              validationConfig={VALIDATION_CONFIG}
              setAddress={setAddress}
              {...props}
            ></ProfileAddressInput>
            {isUserLoggedIn && (
              <div>
                <p>
                  {(!isB2BUser || addressManagerRoles.isProfileAddrManager) && (
                    <Checkbox
                      id={`saveAsANewProfileAddress-${id}`}
                      name="saveAsANewProfileAddress"
                      className="DeliveryAddressForm_SaveAsANewProfileAddressCheckBox"
                      labelText={labelSaveAsANewProfileAddress}
                      checked={saveAsANewProfileAddress}
                      value={saveAsANewProfileAddress}
                      onChange={event => {
                        setSaveAsANewProfileAddress(event.target.checked);
                      }}
                    ></Checkbox>
                  )}
                  {isB2BUser && (addressManagerRoles.isAccountAddrManager || addressManagerRoles.isAdmin) && (
                    <Checkbox
                      id={`saveAsANewAccountAddress-${id}`}
                      name="saveAsANewAccountAddress"
                      className="DeliveryAddressForm_SaveAsANewAccountAddressCheckBox"
                      labelText={labelSaveAsANewAccountAddress}
                      checked={saveAsANewAccountAddress}
                      value={saveAsANewAccountAddress}
                      onChange={event => {
                        setSaveAsANewAccountAddress(event.target.checked);
                      }}
                    ></Checkbox>
                  )}
                </p>
              </div>
            )}
          </Form>
        </div>
      </div>
    </Styled>
  );
};

CheckoutDeliveryAddressForm.propTypes = {
  /** The countries object from redux state(countryRegionRepository->shippingCountries) */
  shippingCountries: PropTypes.objectOf(
    PropTypes.shape({
      countryCode: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      repositoryId: PropTypes.string.isRequired,
      regions: PropTypes.shape.isRequired
    })
  ),

  /**
   * This is the default shipping country code
   */
  defaultShippingCountry: PropTypes.string,

  /**
   * Logged in status of the user.
   */
  isUserLoggedIn: PropTypes.bool.isRequired,

  /**
   * Type of the shopper.
   */
  isB2BUser: PropTypes.bool.isRequired,

  /**
   * The roles (user roles) object from redux state(ProfileRepository->roles)
   */
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      repositoryId: PropTypes.string.isRequired,
      function: PropTypes.string.isRequired
    })
  )
};

CheckoutDeliveryAddressForm.defaultProps = {
  shippingCountries: {},
  defaultShippingCountry: '',
  roles: []
};

export default connect(getComponentData)(CheckoutDeliveryAddressForm);
