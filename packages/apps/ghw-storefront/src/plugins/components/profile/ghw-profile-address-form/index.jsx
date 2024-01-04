import {
  PAGE_ACCOUNT_ADDRESS_BOOK_LINK,
  PAGE_ADDRESS_BOOK_LINK,
  VALIDATION_CONFIG,
  VALIDATION_CONFIG_PROFILEADDRESSMANAGER
} from '@oracle-cx-commerce/commerce-utils/constants';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {isEmptyObject, searchStringToQueryParams} from '@oracle-cx-commerce/utils/generic';

import Checkbox from '@oracle-cx-commerce/react-components/checkbox';
import Form from '@oracle-cx-commerce/react-components/form';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {formToJson} from '@oracle-cx-commerce/react-components/utils';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {fetchShippingCountries} from '@oracle-cx-commerce/fetchers/shipping-countries';
import {getComponentData} from '@oracle-cx-commerce/react-widgets/profile/profile-address-form/selectors';
import {setCustomValidity} from '@oracle-cx-commerce/react-components/utils/address';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {useShippingCountriesFetcher} from '@oracle-cx-commerce/fetchers/shipping-countries/hooks';
import PropTypes from 'prop-types';
import css from './styles.css';
import ProfileAddressInput from './components/profile-address-input';
import Modal from '../ghw-profile-address-book/components/modal';
import USPSModel from '../../ghw-checkout-single-shipping-details/components/usps-model';

/**
 * export fetchers to load all shipping countries into the state during server-side rendering.
 */
export const fetchers = [fetchShippingCountries];

/**
 * widget to Create or Edit a profile address.
 * @param {Object} props the properties object
 */
const GHWProfileAddressForm = props => {
  const store = useContext(StoreContext);
  const {action} = store;

  /**
   * invoke fetcher hook to load all shipping countries into state,
   * this will not perform any task if state already has shipping countries
   * This is effective if SSR didn't populate the state with shipping countries data
   */
  useShippingCountriesFetcher(store);

  const {
    headingAddAddress,
    headingEditAddress,
    headingEditProfileAddress,
    headingAddProfileAddress,
    textAllFieldsRequired,
    labelMakeDefaultShippingAddress,
    labelCancel,
    labelSave,
    textInvalidField,
    textRequiredField,
    alertAddressChangedSuccessfully,
    alertAddressCreatedSuccessfully
  } = props;

  const {
    id,
    currentPageId,
    onActionComplete,
    contactInfos = [],
    shippingCountries = [],
    defaultShippingAddressId,
    isB2BUser = false
  } = props;

  const goToPage = useNavigator();
  const [inProgress, setInProgress] = useState(false);
  const profileAddressFormRef = useRef({});
  const {addressId, isProfileAddress} = searchStringToQueryParams(currentPageId);
  const [address, setAddress] = useState({});

  useEffect(() => {
    // eslint-disable-next-line spellcheck/spell-checker
    /* This check is for b2b-copy-as-profile-address feature.
     * When an address is not available in contactInfos, trigger the action to pull.
     */
    if (addressId && !isEmptyObject(contactInfos)) {
      if (contactInfos[addressId]) {
        setAddress(contactInfos[addressId]);
      } else {
        action(isProfileAddress === true || !isB2BUser ? 'getProfileAddress' : 'getOrganizationAddress', {
          addressId
        });
      }
    }
  }, [addressId, shippingCountries, contactInfos, isProfileAddress, isB2BUser, action]);

  const onOk = useCallback(() => {
    const message =
      addressId && !currentPageId.includes('isProfileAddress')
        ? alertAddressChangedSuccessfully
        : alertAddressCreatedSuccessfully;

    action('notify', {level: 'success', message});
    if (onActionComplete) {
      onActionComplete();
    } else {
      goToPage(isB2BUser ? PAGE_ACCOUNT_ADDRESS_BOOK_LINK : PAGE_ADDRESS_BOOK_LINK);
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }, [
    action,
    addressId,
    alertAddressChangedSuccessfully,
    alertAddressCreatedSuccessfully,
    currentPageId,
    goToPage,
    isB2BUser,
    onActionComplete
  ]);

  const onNotOk = useCallback(
    ({error = {}}) => {
      if (onActionComplete) onActionComplete();
      action('notify', {level: 'error', message: error.message});
    },
    [action, onActionComplete]
  );

  const getFormControlElement = namedItem => {
    return (
      profileAddressFormRef.current &&
      profileAddressFormRef.current.querySelectorAll &&
      profileAddressFormRef.current.querySelectorAll('form') &&
      profileAddressFormRef.current.querySelectorAll('form')[0] &&
      profileAddressFormRef.current.querySelectorAll('form')[0].elements &&
      profileAddressFormRef.current.querySelectorAll('form')[0].elements.namedItem(namedItem)
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
      setAddress({...address, ...prop});
    },
    [address]
  );

  const [formData, setFormData] = useState({});
  const [openUSPS, setOpenUSPS] = useState(false);
  const [suggestedAddress, setSuggestedAddress] = useState({});
  const [addressAction, setAddressAction] = useState({});
  const closeUSPSModal = () => {
    setOpenUSPS(false);
  };
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
      createSuggestedAddress(addressDetails);
    }

    return false;
  };
  const handleAddOrEditAddress = data => {
    //select final address form USPS
    const addressDetails = suggestedAddress[data.selectedAddress];
    // addressDetails.isDefaultShippingAddress = true;
    const url =
      addressId && !currentPageId.includes('isProfileAddress') ? 'updateProfileAddress' : 'createProfileAddress';
    action(url, {...addressDetails})
      .then(response => {
        if (response.ok === false) {
          onNotOk(response);
        } else {
          setOpenUSPS(false);
          onOk();
        }
        //add pop success
      })
      .catch(() => {
        onNotOk();
      });

    return false;
  };

  return (
    <Styled id="GHWProfileAddressForm" css={css}>
      <Modal show={true} onClose={true} title={headingAddAddress}>
        <div className="GHWProfileAddressForm">
          <div ref={profileAddressFormRef}>
            <Form
              // action={
              //   addressId && !currentPageId.includes('isProfileAddress')
              //     ? 'updateProfileAddress'
              //     : 'createProfileAddress'
              // }
              onSubmit={handleUSPSValidation}
              onOk={onOk}
              onNotOk={onNotOk}
              setCustomValidity={onFormSubmit}
              setInProgress={setInProgress}
              noValidate
              enableUnsavedChangesTracking={true}
            >
              <input type="hidden" name="addressId" value={addressId || ''} />
              <ProfileAddressInput
                {...props}
                id={id}
                address={address}
                validationConfig={isB2BUser ? VALIDATION_CONFIG_PROFILEADDRESSMANAGER : VALIDATION_CONFIG}
                onInputChange={onInputChange}
                onInputBlur={onInputBlur}
                countryList={shippingCountries}
                setAddress={setAddress}
              ></ProfileAddressInput>

              <div className="Buttons-Address-Container">
                <button
                  type="submit"
                  className="ProfileAddressForm__ConfirmButton"
                  disabled={inProgress}
                  aria-label={labelSave}
                >
                  Validate
                </button>
                <button
                  disabled={inProgress}
                  type="button"
                  className="ProfileAddressForm__CancelButton"
                  onClick={() => {
                    onActionComplete
                      ? onActionComplete()
                      : goToPage(isB2BUser ? PAGE_ACCOUNT_ADDRESS_BOOK_LINK : PAGE_ADDRESS_BOOK_LINK);
                    if (typeof window !== 'undefined') {
                      window.location.reload();
                    }
                  }}
                  aria-label={labelCancel}
                >
                  {labelCancel}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
      <USPSModel
        openModal={openUSPS}
        title={'Select Shipping Address'}
        onCancel={closeUSPSModal}
        onSubmit={handleAddOrEditAddress}
        localAddress={formData}
        suggestedAddress={suggestedAddress}
        {...props}
      />
    </Styled>
  );
};

GHWProfileAddressForm.propTypes = {
  /** Address id to update */
  id: PropTypes.string,

  /** Current page id */
  currentPageId: PropTypes.string.isRequired,

  /** Function to invoke on successfully completion of address action */
  onActionComplete: PropTypes.func,

  /** Default shipping address id */
  defaultShippingAddressId: PropTypes.string,

  // eslint-disable-next-line spellcheck/spell-checker
  /**
   * The contactInfos (address) object from redux state(ProfileRepository->contactInfos)
   */
  contactInfos: PropTypes.objectOf(
    PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      address1: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      postalCode: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired
    })
  ),

  /** The countries object from redux state(countryRegionRepository->shippingCountries) */
  shippingCountries: PropTypes.objectOf(
    PropTypes.shape({
      countryCode: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      repositoryId: PropTypes.string.isRequired,
      regions: PropTypes.shape.isRequired
    })
  )
};

GHWProfileAddressForm.defaultProps = {
  id: '',
  defaultShippingAddressId: undefined,
  onActionComplete: undefined,
  contactInfos: {},
  shippingCountries: {}
};

export default connect(getComponentData)(GHWProfileAddressForm);
