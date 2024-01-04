/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useEffect, useMemo, useState} from 'react';
import {getDefaultCountry, getSortedArray} from '@oracle-cx-commerce/react-components/utils/address';
import Phone from '@oracle-cx-commerce/react-components/icons/phone';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './address-input.css';
import Dropdown from '../dropdown';

/**
 * Component for common address form fields.
 * @param {Object} props the properties object
 */
const AddressInput = props => {
  const {labelCountry, labelZipCode, labelState, labelStreetAddress, labelTownCity, labelPhoneNumberOptional} = props;
  const {
    id = '',
    className = '',
    address = {},
    validationConfig = {},
    onInputChange,
    onInputBlur,
    defaultCountry,
    countryList = {},
    showPhoneNumberField = true
  } = props;
  const [regions, setRegions] = useState([]);
  const [ghwAddress, sethwAddress] = useState(address);
  /**
   * Sets the valid country
   */
  const country = useMemo(() => {
    return address.country || getDefaultCountry(countryList, defaultCountry);
  }, [address.country, countryList, defaultCountry]);

  /**
   * Function return options array sorted by displayName
   * @param {Object} items The array of countries/ regions
   * @param {String} valueField field name on which the sort is performed
   * @returns {Array} sorted array of options
   */
  const getSortedOptions = (items, valueField) => {
    const sortBy = 'displayName';

    return getSortedArray(items, sortBy).map(item => (
      <option value={item[valueField]} key={item[valueField]} aria-label={item[sortBy]}>
        {item[sortBy]}
      </option>
    ));
  };

  /**
   * Sets the regions based on country/ default-country
   */
  useEffect(() => {
    if (country && Object.keys(countryList).length) {
      setRegions(countryList[country].regions);
    }
  }, [address, country, countryList, defaultCountry]);

  return (
    <Styled css={css} id="AddressInput">
      <div className="form-field form-fullwidth">
        
        <input
          id={`address1-${id}`}
          data-testid={`address1-${id}`}
          type="text"
          name="address1"
          className="form-field__input"
          value={address.address1 || ''}
          onChange={onInputChange}
          placeholder="&nbsp;"
          onBlur={onInputBlur}
          required
          autoComplete="street-address"
          maxLength={(validationConfig.address1 && validationConfig.address1.maxLength) || '60'}
          disabled={(validationConfig.address1 && validationConfig.address1.disabled) || false}
        />
        <label htmlFor={`address1-${id}`} aria-label={labelStreetAddress} className='form-field__label'>
          Address 1*
        </label>
        <span className="validationMessage focus-bg"></span>
      </div>
      <div className="form-field">
       
        <input
          id={`city-${id}`}
          data-testid={`city-${id}`}
          type="text"
          className="form-field__input"
          name="city"
          value={address.city || ''}
          onChange={onInputChange}
          placeholder="&nbsp;"
          onBlur={onInputBlur}
          required
          autoComplete="address-level2"
          maxLength={(validationConfig.city && validationConfig.city.maxLength) || '50'}
          disabled={(validationConfig.city && validationConfig.city.disabled) || false}
        />
         <label htmlFor={`city-${id}`} aria-label={labelTownCity} className='form-field__label'>
          City*
        </label>
        <span className="validationMessage focus-bg"></span>
      </div>
      <div className="form-field">
      {/* <label htmlFor={`state-${id}`} aria-label={labelTownCity}>
          State
        </label> */}
        <Dropdown
          label={labelState}
          id={`state-${id}`}
          data-testid={`state-${id}`}
          name="state"
          value={address.state}
          onChange={onInputChange}
          onBlur={onInputBlur}
          required
          autoComplete="address-level1"
          disabled={(validationConfig.state && validationConfig.state.disabled) || regions.length === 0 || false}
        >
          {getSortedOptions(regions, 'abbreviation')}
        </Dropdown>
      </div>
      <div className="form-field">
        
        <input
          id={`postalCode-${id}`}
          data-testid={`postalCode-${id}`}
          type="text"
          name="postalCode"
          className="form-field__input"
          value={address.postalCode || ''}
          placeholder="&nbsp;"
          onChange={onInputChange}
          onBlur={onInputBlur}
          required
          autoComplete="postal-code"
          maxLength={(validationConfig.postalCode && validationConfig.postalCode.maxLength) || '10'}
          disabled={(validationConfig.postalCode && validationConfig.postalCode.disabled) || false}
        />
        <label htmlFor={`postalCode-${id}`} aria-label={labelZipCode} className='form-field__label'>
          {labelZipCode}*
        </label>
        <span className="validationMessage focus-bg"></span>
      </div>
      <div className="form-field">
      {/* <label htmlFor={`country-${id}`} aria-label={labelTownCity}>
          Country*
        </label> */}

        <Dropdown
          label={labelCountry}
          id={`country-${id}`}
          data-testid={`country-${id}`}
          name="country"
          value={address.country || country}
          onChange={onInputChange}
          onBlur={onInputBlur}
          required
          autoComplete="country-name"
          disabled={(validationConfig.country && validationConfig.country.disabled) || false}
        >
          {getSortedOptions(countryList, 'countryCode')}
        </Dropdown>
      </div>
      {showPhoneNumberField && (
        <div className="form-field">
            <input
            id={`phoneNumber-${id}`}
            type="tel"
            name="phoneNumber"
            className="form-field__input"
            value={address.phoneNumber || ''}
            onChange={onInputChange}
            placeholder="&nbsp;"
            onBlur={onInputBlur}
            autoComplete="tel"
            maxLength={(validationConfig.phoneNumber && validationConfig.phoneNumber.maxLength) || '15'}
            disabled={(validationConfig.phoneNumber && validationConfig.phoneNumber.disabled) || false}
            pattern={(validationConfig.phoneNumber && validationConfig.phoneNumber.pattern) || '[0-9]*'}
          />
          <label htmlFor={`phoneNumber-${id}`} aria-label={labelPhoneNumberOptional} className="form-field__label">
            Phone
          </label>
        
          <span className="validationMessage focus-bg"></span>
        </div>
      )}
    </Styled>
  );
};

export default AddressInput;
