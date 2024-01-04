/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useState} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import formCss from '@oracle-cx-commerce/react-components/form/styles.css';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import css from './profile-address-input.css';
import AddressInput from '../address-input';
import GoogleTypeahead from '../google-typeahead';

/**
 * component to display profile address specific form fields.
 * @param {Object} props the properties object
 */
const ProfileAddressInput = props => {
  const {labelFirstName, labelLastName, labelNickName, labelCompanyName} = props;
  const {
    id = '',
    className = '',
    address = {},
    setAddress,
    isB2BUser,
    validationConfig = {},
    onInputChange,
    onInputBlur,
    showTitle = true,
    currentProfile
  } = props;
  const [newAddress, setNewAddress] = useState(address);
  const {firstName, lastName} = currentProfile;
  const fillInAddress = addressObject => {
    let address1 = '';
    const street_number = '';
    let postcode = '';
    let locality = '';
    let state = '';
    let country = '';
    let obj = {};

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    // address_components are google.maps.GeocoderAddressComponent objects
    // which are documented at http://goo.gle/3l5i5Mr
    for (const component of addressObject.address_components) {
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];

      switch (componentType) {
        case 'street_number': {
          address1 = `${component.long_name} ${address1}`;
          break;
        }

        case 'route': {
          address1 += component.short_name;
          break;
        }

        case 'postal_code': {
          postcode = `${component.long_name}${postcode}`;
          break;
        }

        // case 'postal_code_suffix': {
        //   postcode = `${postcode}-${component.long_name}`;
        //   break;
        // }
        case 'locality':
          locality = component.long_name;
          break;
        case 'administrative_area_level_1': {
          state = component.short_name;
          break;
        }
        case 'country':
          country = component.short_name;
          break;
        default:
          obj = component;
      }
    }

    const googleAddress = {
      address1,
      city: locality,
      country,
      postalCode: postcode,
      state
    };
    if(!isEmptyObject(address)){
      address.firstName = firstName;
      address.lastName = lastName;
    } else {
      googleAddress.firstName = firstName;
      googleAddress.lastName = lastName;
    }
    console.log('profile name--> ', address, newAddress);
    setAddress({
      ...address,
      ...googleAddress
    });
  };

  return (
    <Styled
      id="ProfileAddressInput"
      css={`
        ${css} ${formCss}
      `}
    >
      <div className={`shipping-form ${className}`}>
        {/* {showTitle ? (
          <h4 className="h4" id="ship">
            Shipping Information
          </h4>
        ) : (
          ''
        )} */}

        <GoogleTypeahead placeSelectHanlder={addressObject => fillInAddress(addressObject)} />
        {isB2BUser && (
          <div className="ProfileAddressInput__Field ProfileAddressInput__AddressType form-field">
            <input
              id={`addressType-${id}`}
              type="text"
              name="addressType"
              value={address.addressType || ''}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required={validationConfig.addressType && validationConfig.addressType.required}
              
              disabled={(validationConfig.addressType && validationConfig.addressType.disabled) || false}
              maxLength={(validationConfig.addressType && validationConfig.addressType.maxLength) || '50'}
            />
            <label htmlFor={`addressType-${id}`} aria-label={labelNickName} className="form-field__label">
              {labelNickName}
            </label>
            <span className="validationMessage focus-bg"></span>
            
          </div>
        )}
        <div className="form_shipping">
          <div className="form-field">
           
            <input
              id={`firstName-${id}`}
              type="text"
              name="firstName"
              className="form-field__input"
              value={address.firstName || ''}
              placeholder="&nbsp;"
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              
              autoComplete="given-name"
              disabled={(validationConfig.firstName && validationConfig.firstName.disabled) || false}
            />
             <label htmlFor={`firstName-${id}`} aria-label={labelFirstName} className='form-field__label'>
              {labelFirstName}*
            </label>
            <span className="validationMessage focus-bg"></span>
          </div>
          <div className="form-field">
            
            <input
              id={`lastName-${id}`}
              type="text"
              name="lastName"
              className="form-field__input"
              value={address.lastName || ''}
              onChange={onInputChange}
              placeholder="&nbsp;"
              onBlur={onInputBlur}
              required
              
              autoComplete="family-name"
              disabled={(validationConfig.lastName && validationConfig.lastName.disabled) || false}
              maxLength={(validationConfig.lastName && validationConfig.lastName.maxLength) || '60'}
            />
            <label htmlFor={`lastName-${id}`} aria-label={labelLastName} className='form-field__label'>
              {labelLastName}*
            </label>
            <span className="validationMessage focus-bg"></span>
          </div>
          <AddressInput {...props} address={!isEmptyObject(newAddress) ? newAddress : address}></AddressInput>
        </div>
      </div>
    </Styled>
  );
};

export default ProfileAddressInput;
