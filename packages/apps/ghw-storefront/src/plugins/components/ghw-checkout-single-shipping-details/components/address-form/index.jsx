/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  PAGE_CHECKOUT_SHIPPING_LINK,
  VALIDATION_CONFIG,
  VALIDATION_CONFIG_BUYER,
  VALIDATION_CONFIG_PROFILEADDRESSMANAGER
} from '@oracle-cx-commerce/commerce-utils/constants';
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  getAddressManagerRoles,
  getDefaultCountry,
  getSortedArray,
  setCustomValidity
} from '@oracle-cx-commerce/react-components/utils/address';
import {isEmptyObject, noop} from '@oracle-cx-commerce/utils/generic';

import Checkbox from '@oracle-cx-commerce/react-components/checkbox';
import Form from '@oracle-cx-commerce/react-components/form';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {getContactInfos} from '@oracle-cx-commerce/commerce-utils/selector';
import Styled from '@oracle-cx-commerce/react-components/styled';
import PropTypes from 'prop-types';

//constants
import {formToJson} from '@oracle-cx-commerce/react-components/utils';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import ProfileAddressInput from '../../../profile/ghw-profile-address-form/components/profile-address-input';
import css from './styles.css';
import USPSModel from '../usps-model';

/**
 * Component to render add or edit shipping address/ billing address form
 * @param {Object} props The properties object
 * @memberof Components
 * @class AddressForm
 * @category Component-list
 * @param {String} textAllFieldsRequired - Text specifying all fields are required
 * @param {String} labelSaveAsANewProfileAddress - Locale save as new profile address
 * @param {String} labelSaveAsANewAccountAddress - Locale save as new account address
 * @param {String} labelCancel - Locale for cancel label
 * @param {String} buttonSaveAndContinue - Label for save and continue button
 * @param {String} textRequiredField - Label for required field
 * @param {String} textInvalidField - Label for invalid field
 * @param {String} id - Unique id for the component
 * @param {Boolean} isUserLoggedIn - Boolean flag to indicate if the user is logged in
 * @param {Boolean} isB2BUser - Boolean indicating if the user is a B2B user.
 * @param {Array} roles - The roles (user roles) object from redux state(ProfileRepository->roles)
 * @param {Array} countries - List of countries
 * @param {String} defaultCountry - Default country selected
 * @param {Object} address - Address object
 * @param {Boolean} isEditAddress - Flag to know if address form is opened to edit an address
 * @param {Function} handleCloseAction - Callback function to handle modal close
 * @param {Function} onAddressUpdated - Callback function to handle save or update address
 * @author Oracle
 */
const AddressForm = props => {
  // resources
  const {
    textAllFieldsRequired,
    labelSaveAsANewProfileAddress,
    labelSaveAsANewAccountAddress,
    labelCancel,
    buttonSaveAndContinue,
    textRequiredField,
    textInvalidField
  } = props;

  const {
    id,
    isUserLoggedIn,
    isB2BUser,
    roles,
    countries = {},
    defaultCountry,
    address: existingAddress,
    isEditAddress,
    handleCloseAction = noop,
    onAddressUpdated = noop,
    currentProfile,
    isBilling = false,
    headingAddAddress
  } = props;
  console.log('add-->', props);
  const store = useContext(StoreContext);
  const {action, getState} = store;

  const profileContactInfos = getContactInfos(getState());
  const goToPage = useNavigator();
  const addressFormRef = useRef({});
  const [address, setAddress] = useState({});

  const addressManagerRoles = useMemo(() => getAddressManagerRoles(roles), [roles]);

  /* For B2C user, checkbox will be default checked */
  const [saveAsANewProfileAddress, setSaveAsANewProfileAddress] = useState(isUserLoggedIn && !isB2BUser);
  const [saveAsANewAccountAddress, setSaveAsANewAccountAddress] = useState(false);

  /**
   * Returns  default billing country and region
   */
  const getDefaultCountryRegion = useCallback(() => {
    // Sets country to the defaultCountry or the  first country in the countries list
    let state = '',
      country = '',
      stateList = [];
    if (countries) {
      country = getDefaultCountry(countries, defaultCountry);
      // get region according to the default country
      stateList = countries[country] ? countries[country].regions : [];
      state = stateList.length > 0 ? getSortedArray(stateList, 'displayName')[0].abbreviation : '';
    }

    return {country, state};
  }, [countries, defaultCountry]);

  /**
   * Sets the address into local state when performing edit operation
   */
  useEffect(() => {
    if (isEditAddress) {
      setAddress({...existingAddress, addressType: existingAddress.addressType || existingAddress.alias});
    } else if (!isEmptyObject(countries)) {
      // set country,state according to default country
      const {state, country} = getDefaultCountryRegion();
      const {firstName, lastName} = currentProfile;
      setAddress(address => {
        return {
          ...address,
          state,
          country,
          firstName,
          lastName
        };
      });
    }
  }, [isEditAddress, existingAddress, countries, getDefaultCountryRegion]);

  /**
   * Form Validation config based on the user role
   */
  const getValidationConfig = () => {
    if (isB2BUser) {
      if (addressManagerRoles.isAccountAddrManager || addressManagerRoles.isAdmin) {
        if (saveAsANewAccountAddress) {
          return VALIDATION_CONFIG;
        }

        return VALIDATION_CONFIG_PROFILEADDRESSMANAGER;
      }
      if (addressManagerRoles.isProfileAddrManager) {
        return VALIDATION_CONFIG_PROFILEADDRESSMANAGER;
      }
      /* If buyer edits an address, disable all fields except fName and lName */
      if (isEditAddress) {
        return VALIDATION_CONFIG_BUYER;
      }
    }

    return VALIDATION_CONFIG;
  };

  /**
   * Failure callback for the action
   */
  const onNotOk = useCallback(
    ({error = {}}) => {
      action('notify', {level: 'error', message: error.message});
    },
    [action]
  );

  const [formData, setFormData] = useState({});
  const [openUSPS, setOpenUSPS] = useState(false);
  const [suggestedAddress, setSuggestedAddress] = useState({});
  const [addressAction, setAddressAction] = useState({});

  const convertToObject = (inputObject, localAddress) => {
    return {
      firstName: localAddress.firstName,
      lastName: localAddress.firstName,
      address1: inputObject.Address2 ? inputObject.Address2[0] : localAddress.address1,
      city: inputObject.City ? inputObject.City[0] : '',
      state: inputObject.State ? inputObject.State[0] : '',
      postalCode: inputObject.Zip5 ? inputObject.Zip5[0] : '',
      country: localAddress.country,
      phoneNumber: localAddress.phoneNumber
    };
  };

  const getSuggestedAddress = localAddress => {
    const payload = {
      address: {
        address1: localAddress.address1,
        city: localAddress.city,
        state: localAddress.state,
        zip: localAddress.postalCode
      }
    };
    action('uspsValidation', payload).then(response => {
      if (response.ok) {
        if (response.delta?.myRepository?.myTable?.myProperty?.success) {
          const arr = response.delta.myRepository.myTable.myProperty.data.AddressValidateResponse.Address;
          const addresses = {};
          addresses.localAddress = localAddress;
          for (let index = 0; index < arr.length; index++) {
            const elem = arr[index];
            addresses[index] = convertToObject(elem, localAddress);
          }
          setSuggestedAddress(addresses);
          setOpenUSPS(true);
        }
      } else {
        setSuggestedAddress({localAddress});
        setOpenUSPS(true);
      }
    });
  };

  const createSuggestedAddress = localAddress => {
    const addresses = {};
    addresses.localAddress = localAddress;
    getSuggestedAddress(localAddress);
  };
  const handleUSPSValidation = event => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target;
    action('notifyClearAll');

    if (form.checkValidity()) {
      const formData = formToJson(form);
      const {saveAsANewProfileAddress, saveAsANewAccountAddress, ...remainingAddressFields} = formData;
      const addressDetails = remainingAddressFields;
      setAddressAction(formData);
      setFormData(addressDetails);
      if (isBilling) {
        handleAddOrEditAddress(formData);

        return false;
      }
      createSuggestedAddress(addressDetails);
    }

    return false;
  };

  const closeUSPSModal = () => {
    setOpenUSPS(false);
  };

  /**
   * Handler for Form submit
   * @param {*} props
   */
  const handleAddOrEditAddress = data => {
    let saveNewProfileAddress, saveNewAccountAddress;
    const {saveAsANewProfileAddress, saveAsANewAccountAddress} = addressAction;

    //select final address form USPS
    let addressDetails;
    if (isBilling) {
      const {saveAsANewProfileAddress, saveAsANewAccountAddress, ...remainingAddressFields} = data;
      addressDetails = remainingAddressFields;
      saveNewProfileAddress = saveAsANewProfileAddress;
      saveNewAccountAddress = saveAsANewAccountAddress;
    } else {
      addressDetails = suggestedAddress[data.selectedAddress];
      saveNewProfileAddress = saveAsANewProfileAddress;
      saveNewAccountAddress = saveAsANewAccountAddress;
    }

    if (saveNewProfileAddress) {
      if (profileContactInfos.length <= 0) {
        addressDetails.isDefaultShippingAddress = true;
      }
      action('createProfileAddress', {...addressDetails})
        .then(response => {
          if (response.ok === false) {
            onNotOk(response);
          }
        })
        .catch(() => {
          onNotOk();
        });
    }

    if (saveNewAccountAddress) {
      action('addOrganizationAddress', {...addressDetails})
        .then(response => {
          if (response.ok === false) {
            onNotOk(response);
          }
        })
        .catch(() => {
          onNotOk();
        });
    }

    // The entered address need to be passed back to the parent component, whenever it is updated.
    onAddressUpdated({address: addressDetails, handleCloseAction, isEditAddress});
    // }
    /* Form component expects false from onsubmit handler */
    setOpenUSPS(false);
    if(isBilling){
      headingAddAddress()
    }

    return false;
  };

  const getFormControlElement = namedItem => {
    return (
      addressFormRef.current &&
      addressFormRef.current.querySelectorAll &&
      addressFormRef.current.querySelectorAll('form') &&
      addressFormRef.current.querySelectorAll('form')[0] &&
      addressFormRef.current.querySelectorAll('form')[0].elements &&
      addressFormRef.current.querySelectorAll('form')[0].elements.namedItem(namedItem)
    );
  };

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
  }, [address.country, textInvalidField, textRequiredField]);

  /**
   * Validate NickName and CompanyName when save as account address changes
   */
  useEffect(() => {
    if (addressManagerRoles.isAccountAddrManager || addressManagerRoles.isAdmin) {
      const addressTypeEl = getFormControlElement('addressType');
      const companyNameEl = getFormControlElement('companyName');
      const countryEl = getFormControlElement('country');
      const country = countryEl ? countryEl.value : '';
      if (addressTypeEl) {
        setCustomValidity(addressTypeEl, textInvalidField, textRequiredField, country);
      }
      if (companyNameEl) {
        setCustomValidity(companyNameEl, textInvalidField, textRequiredField, country);
      }
    }
  }, [
    addressManagerRoles.isAccountAddrManager,
    addressManagerRoles.isAdmin,
    saveAsANewAccountAddress,
    textInvalidField,
    textRequiredField
  ]);

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

  /**
   * Function to handle the onChange event callback
   */
  const onInputChange = useCallback(
    event => {
      const prop = {};
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      prop[event.target.name] = value;
      setAddress({...address, ...prop});
    },
    [address]
  );

  return (
    <Styled id="AddressForm" css={css}>
      <div className="AddressForm">
        {/* <div className="AddressForm__AllFieldsRequiredText" aria-label={textAllFieldsRequired}>
          {textAllFieldsRequired}
        </div> */}
        <div ref={addressFormRef}>
          <Form onSubmit={handleUSPSValidation} setCustomValidity={onFormSubmit} noValidate>
            <div>
              <ProfileAddressInput
                {...props}
                countryList={countries}
                address={address}
                onInputChange={onInputChange}
                onInputBlur={onInputBlur}
                validationConfig={getValidationConfig()}
                setAddress={setAddress}
              ></ProfileAddressInput>
              {isUserLoggedIn && (
                <div className="AddressForm__Field">
                  {(!isB2BUser || addressManagerRoles.isProfileAddrManager) && (
                    <Checkbox
                      id={`saveAsANewProfileAddress-${id}`}
                      name="saveAsANewProfileAddress"
                      className="AddressForm_SaveAsANewProfileAddressCheckBox"
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
                      className="AddressForm_SaveAsANewAccountAddressCheckBox form-checkbox"
                      labelText={labelSaveAsANewAccountAddress}
                      checked={saveAsANewAccountAddress}
                      value={saveAsANewAccountAddress}
                      onChange={event => {
                        setSaveAsANewAccountAddress(event.target.checked);
                      }}
                    ></Checkbox>
                  )}
                </div>
              )}
              <div className="AddressForm__Buttons">
                <button type="submit" className="btn primary-btn" aria-label={buttonSaveAndContinue}>
                  {buttonSaveAndContinue}
                </button>
                <button
                  type="button"
                  className="btn secondary-btn"
                  aria-label={labelCancel}
                  onClick={() => (handleCloseAction ? handleCloseAction() : goToPage(PAGE_CHECKOUT_SHIPPING_LINK))}
                >
                  {labelCancel}
                </button>
              </div>
            </div>
          </Form>
        </div>
        <USPSModel
          openModal={openUSPS}
          title={'Select Shipping Address'}
          onCancel={closeUSPSModal}
          onSubmit={handleAddOrEditAddress}
          localAddress={formData}
          suggestedAddress={suggestedAddress}
          {...props}
        />
      </div>
    </Styled>
  );
};

AddressForm.propTypes = {
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
  ),

  /** The countries object from redux state(countryRegionRepository->shippingCountries) */
  countries: PropTypes.objectOf(
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
  defaultCountry: PropTypes.string,

  /**
   * This is the address object for edit
   */
  address: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    address1: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
    country: PropTypes.string,
    phoneNumber: PropTypes.string
  }),

  /**
   * Flag to know if address form is opened to edit an address
   */
  isEditAddress: PropTypes.bool.isRequired,

  /** Callback function to handle modal close  */
  handleCloseAction: PropTypes.func.isRequired,

  /** Callback function to handle save or update address */
  onAddressUpdated: PropTypes.func.isRequired
};

AddressForm.defaultProps = {
  address: {},
  countries: {},
  defaultCountry: '',
  roles: []
};

export default React.memo(AddressForm);
