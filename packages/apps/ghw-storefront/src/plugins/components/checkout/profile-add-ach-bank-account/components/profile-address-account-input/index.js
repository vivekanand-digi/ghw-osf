/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import formCss from '@oracle-cx-commerce/react-components/form/styles.css';
import Checkbox from '@oracle-cx-commerce/react-components/checkbox';
import AddressInput from '../address-input';
import css from './styles.css';
import AccountInput from '../account-input';
import {OWNERSHIP_FIELDS_VALUES} from '../../contants/account-fields';

const ProfileAddressAccountInput = props => {
  const {labelFirstName, labelLastName, labelBusinessName, labelMakeDefault = 'Use this as payment method'} = props;
  const {
    id = '',
    className = '',
    formValues = {},
    validationConfig = {},
    onInputChange,
    onInputBlur,
    hasSavedPayment
  } = props;

  return (
    <Styled
      id="ProfileAddressAccountInput"
      css={`
        ${css} ${formCss}
      `}
    >
      <div className={`ProfileAddressAccountInput ${className}`}>
        <AccountInput {...props} />
        {formValues.ownershipType === OWNERSHIP_FIELDS_VALUES.PERSONAL ? (
          <div className="ProfileAddressAccountInput__Field ProfileAddressAccountInput__FirstNameLastNameContainer">
            <div className="ProfileAddressAccountInput__Field ProfileAddressAccountInput__FirstName">
              <label htmlFor={`firstName-${id}`} aria-label={labelFirstName}>
                {labelFirstName}
              </label>
              <input
                id={`firstName-${id}`}
                type="text"
                name="firstName"
                value={formValues.firstName || ''}
                onChange={onInputChange}
                onBlur={onInputBlur}
                tabIndex="0"
                required
                autoCapitalize="words"
                autoComplete="given-name"
                maxLength={(validationConfig.firstName && validationConfig.firstName.maxLength) || '60'}
                disabled={hasSavedPayment}
              />
              <span className="validationMessage"></span>
            </div>
            <div className="ProfileAddressAccountInput__Field ProfileAddressAccountInput__LastName">
              <label htmlFor={`lastName-${id}`} aria-label={labelLastName}>
                {labelLastName}
              </label>
              <input
                id={`lastName-${id}`}
                type="text"
                name="lastName"
                value={formValues.lastName || ''}
                onChange={onInputChange}
                onBlur={onInputBlur}
                required
                autoCapitalize="words"
                autoComplete="family-name"
                maxLength={(validationConfig.lastName && validationConfig.lastName.maxLength) || '60'}
                disabled={hasSavedPayment}
              />
              <span className="validationMessage"></span>
            </div>
          </div>
        ) : (
          <div className="ProfileAddressAccountInput__Field">
            <div className="ProfileAddressAccountInput__Field ProfileAddressAccountInput__BusinessName">
              <label htmlFor={`businessName-${id}`} aria-label={labelLastName}>
                {labelBusinessName}
              </label>
              <input
                id={`businessName-${id}`}
                type="text"
                name="businessName"
                value={formValues.businessName || ''}
                onChange={onInputChange}
                onBlur={onInputBlur}
                required
                autoCapitalize="words"
                autoComplete="off"
                disabled={hasSavedPayment}
              />
              <span className="validationMessage"></span>
            </div>
          </div>
        )}
        {!hasSavedPayment && <AddressInput {...props}></AddressInput>}
        <div className="ProfileAddressAccountInput__Field">
          <div className="ProfileAddressAccountInput__Field">
            <Checkbox
              labelText={labelMakeDefault}
              id={`makeDefault-${id}`}
              name="makeDefault"
              value={formValues.makeDefault}
              onChange={onInputChange}
              onBlur={onInputBlur}
              disabled={hasSavedPayment}
              checked={formValues.makeDefault}
            />
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default ProfileAddressAccountInput;
