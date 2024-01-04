import React, {useContext, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@oracle-cx-commerce/react-components/dropdown';
import {getDefaultCountry, getSortedArray} from '@oracle-cx-commerce/react-components/utils/address';
import {ACHDirectDebitContext} from '../../context';

const AccountAddressForm = ({
  countryList = {},
  defaultCountry,
  id,
  labelAddress,
  labelBusinessName,
  labelCity,
  labelFirstName,
  labelLastName,
  labelPostCode,
  labelState
}) => {
  const {
    formValues: {
      firstName,
      lastName,
      businessName,
      ownershipType,
      streetAddress,
      extendedAddress,
      locality,
      region,
      postalCode
    },
    setFormFieldValue
  } = useContext(ACHDirectDebitContext);

  const handleInputChange = event => {
    setFormFieldValue(event.target.name, event.target.value);
  };

  const [regions, setRegions] = useState([]);

  /**
   * Sets the valid country
   */
  const country = useMemo(() => {
    return getDefaultCountry(countryList, defaultCountry);
  }, [countryList, defaultCountry]);

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
  }, [country, countryList, defaultCountry]);

  return (
    <div className="AddressSection__Container">
      {ownershipType === 'personal' ? (
        <>
          <div className="AddressSection__Name">
            <label htmlFor={`firstname-${id}`}>{labelFirstName}</label>
            <input
              id={`firstname-${id}`}
              aria-label={labelFirstName}
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleInputChange}
              required
              maxLength="254"
            ></input>
            <span className="validationMessage"></span>
          </div>
          <div className="AddressSection__Name">
            <label htmlFor={`lastname-${id}`}>{labelLastName}</label>
            <input
              id={`lastname-${id}`}
              aria-label={labelLastName}
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleInputChange}
              required
              maxLength="254"
            />
            <span className="validationMessage"></span>
          </div>
        </>
      ) : (
        <div className="AddressSection__Name">
          <label htmlFor={`business-${id}`}>{labelBusinessName}</label>
          <input
            id={`businessName-${id}`}
            aria-label={labelBusinessName}
            type="text"
            name="businessName"
            value={businessName}
            onChange={handleInputChange}
            required
            maxLength="254"
          ></input>
          <span className="validationMessage"></span>
        </div>
      )}
      <div className="AddressSection__Street">
        <label htmlFor={`street1-${id}`}>{labelAddress}</label>
        <input
          id={`street1-${id}`}
          aria-label={labelAddress}
          type="text"
          name="streetAddress"
          value={streetAddress}
          onChange={handleInputChange}
          required
          maxLength="254"
        />
        <input
          id={`street2-${id}`}
          aria-label={labelAddress}
          type="text"
          name="extendedAddress"
          value={extendedAddress}
          onChange={handleInputChange}
          required
          maxLength="254"
        />
        <span className="validationMessage"></span>
      </div>
      <div className="AddressSection__City">
        <label htmlFor={`city-${id}`}>{labelCity}</label>
        <input
          id={`city-${id}`}
          aria-label={labelCity}
          type="text"
          name="locality"
          value={locality}
          onChange={handleInputChange}
          required
        />
        <span className="validationMessage"></span>
      </div>
      <div className="AddressSection__State">
        <Dropdown
          label={labelState}
          id={`region-${id}`}
          data-testid={`region-${id}`}
          name="region"
          value={region}
          onChange={handleInputChange}
          onBlur={handleInputChange}
          required
          autoComplete="address-level1"
        >
          {getSortedOptions(regions, 'abbreviation')}
        </Dropdown>
        <span className="validationMessage"></span>
      </div>
      <div className="AddressSection__PostalCode">
        <label htmlFor={`postalCode-${id}`}>{labelPostCode}</label>
        <input
          id={`postalCode-${id}`}
          aria-label={labelPostCode}
          type="text"
          name="postalCode"
          value={postalCode}
          onChange={handleInputChange}
          required
        />
        <span className="validationMessage"></span>
      </div>
    </div>
  );
};

AccountAddressForm.propTypes = {
  defaultCountry: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  labelBusinessName: PropTypes.string.isRequired,
  labelFirstName: PropTypes.string.isRequired,
  labelLastName: PropTypes.string.isRequired,
  labelAddress: PropTypes.string.isRequired,
  labelCity: PropTypes.string.isRequired,
  labelState: PropTypes.string.isRequired,
  labelPostCode: PropTypes.string.isRequired
};

export default AccountAddressForm;
