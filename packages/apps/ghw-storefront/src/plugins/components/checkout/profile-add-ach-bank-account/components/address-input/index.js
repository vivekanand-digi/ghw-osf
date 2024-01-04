/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useEffect, useMemo, useState} from 'react';
import {getDefaultCountry, getSortedArray} from '@oracle-cx-commerce/react-components/utils/address';
import Dropdown from '@oracle-cx-commerce/react-components/dropdown';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';

/**
 * Component for common address form fields.
 * @param {Object} props the properties object
 */
const AddressInput = props => {
  const {labelZipCode, labelState, labelStreetAddress, labelStreetAddress2, labelTownCity} = props;
  const {
    id = '',
    className = '',
    formValues = {},
    validationConfig = {},
    onInputChange,
    onInputBlur,
    defaultCountry,
    countryList = {}
  } = props;
  const [regions, setRegions] = useState([]);

  /**
   * Sets the valid country
   */
  const country = useMemo(() => {
    return formValues.country || getDefaultCountry(countryList, defaultCountry);
  }, [formValues.country, countryList, defaultCountry]);

  /**
   * Function return options array sorted by displayName
   * @param {Object} items The array of countries/ regions
   * @param {String} valueField field name on which the sort is performed
   * @returns {Array} sorted array of options
   */
  const getSortedOptions = (items, valueField) => {
    const sortBy = 'displayName';

    return getSortedArray(items, sortBy).map(item => (
      <option tabIndex={0} value={item[valueField]} key={item[valueField]} aria-label={item[sortBy]}>
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
  }, [formValues, country, countryList, defaultCountry]);

  return (
    <Styled css={css} id="AddressInput">
      <div className={`AddressInput ${className}`}>
        <div className="AddressInput__Field AddressInput__StreetAddressTownCityContainer">
          <div className="AddressInput__Field AddressInput__StreetAddress">
            <label htmlFor={`streetAddress-${id}`} aria-label={labelStreetAddress}>
              {labelStreetAddress}
            </label>
            <input
              id={`streetAddress-${id}`}
              data-testid={`streetAddress-${id}`}
              type="text"
              name="streetAddress"
              value={formValues.streetAddress || ''}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              autoCapitalize="words"
              autoComplete="street-address"
            />
            <span className="validationMessage"></span>
            <label htmlFor={`extendedAddress-${id}`} aria-label={labelStreetAddress2}>
              {labelStreetAddress2}
            </label>
            <input
              id={`extendedAddress-${id}`}
              data-testid={`extendedAddress-${id}`}
              type="text"
              name="extendedAddress"
              value={formValues.extendedAddress || ''}
              onChange={onInputChange}
              onBlur={onInputBlur}
              autoCapitalize="words"
              autoComplete="street-address-2"
            />
          </div>
          <div className="AddressInput__Field AddressInput__TownCity">
            <label htmlFor={`locality-${id}`} aria-label={labelTownCity}>
              {labelTownCity}
            </label>
            <input
              id={`locality-${id}`}
              data-testid={`locality-${id}`}
              type="text"
              name="locality"
              value={formValues.locality || ''}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              autoCapitalize="words"
              autoComplete="city"
            />
            <span className="validationMessage"></span>
          </div>
        </div>
        <div className="AddressInput__Field AddressInput__CountryStateZipCodeContainer">
          <div className="AddressInput__ZipCode">
            <label htmlFor={`postalCode-${id}`} aria-label={labelZipCode}>
              {labelZipCode}
            </label>
            <input
              id={`postalCode-${id}`}
              data-testid={`postalCode-${id}`}
              type="text"
              name="postalCode"
              value={formValues.postalCode || ''}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              autoComplete="postal-code"
              maxLength={(validationConfig.postalCode && validationConfig.postalCode.maxLength) || '10'}
            />
            <span className="validationMessage"></span>
          </div>
          <div className="AddressInput__State">
            <Dropdown
              label={labelState}
              id={`region-${id}`}
              data-testid={`region-${id}`}
              name="region"
              value={formValues.region}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              autoComplete="address-level1"
            >
              {getSortedOptions(regions, 'abbreviation')}
            </Dropdown>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default AddressInput;
