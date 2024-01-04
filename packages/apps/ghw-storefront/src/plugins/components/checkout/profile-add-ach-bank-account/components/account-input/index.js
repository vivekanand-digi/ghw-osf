/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import Radio from '@oracle-cx-commerce/react-components/radio';
import formCss from '@oracle-cx-commerce/react-components/form/styles.css';
import css from './styles.css';
import {ACCOUNT_TYPE_FIELDS_VALUES, OWNERSHIP_FIELDS_VALUES} from '../../contants/account-fields';

const AccountInput = props => {
  const {
    labelAccountNumber,
    labelRoutingNumber,
    labelAccountType,
    labelCheckingAccountType,
    labelSavingsAccountType,
    labelOwnership,
    labelOwnershipPersonal,
    labelOwnershipBusiness,
    labelAccountNumberLastFourDigit
  } = props;
  const {id = '', className = '', formValues = {}, hasSavedPayment, onInputChange, onInputBlur} = props;

  return (
    <Styled
      id="AccountInput"
      css={`
        ${css} ${formCss}
      `}
    >
      <div className={`AccountInput ${className}`}>
        <div className="AccountInput__Field AccountInput__ColumnContainer">
          <div className="AccountInput__Field AccountInput__ColumnFirst">
            <label htmlFor={`accountNumber-${id}`} aria-label={labelAccountNumber}>
              {hasSavedPayment ? labelAccountNumberLastFourDigit : labelAccountNumber}
            </label>
            <input
              id={`accountNumber-${id}`}
              type="text"
              name="accountNumber"
              value={formValues.accountNumber || ''}
              onChange={onInputChange}
              onBlur={onInputBlur}
              tabIndex="0"
              required
              autoComplete="off"
              disabled={hasSavedPayment}
            />
            <span className="validationMessage"></span>
          </div>
          <div className="AccountInput__Field AccountInput__ColumnEnd">
            <label htmlFor={`routingNumber-${id}`} aria-label={labelRoutingNumber}>
              {labelRoutingNumber}
            </label>
            <input
              id={`routingNumber-${id}`}
              type="text"
              name="routingNumber"
              value={formValues.routingNumber || ''}
              onChange={onInputChange}
              onBlur={onInputBlur}
              required
              autoComplete="off"
              maxLength={9}
              disabled={hasSavedPayment}
            />
            <span className="validationMessage"></span>
          </div>
        </div>
        <div className="AccountInput__Field AccountInput__ColumnContainer">
          <div className="AccountInput__Field AccountInput__ColumnFirst">
            <p className="AccountInput__FieldLabel">{labelAccountType}</p>
            <Radio
              labelText={labelCheckingAccountType}
              id={`accountType-checking-${id}`}
              name="accountType"
              value={ACCOUNT_TYPE_FIELDS_VALUES.CHECKING}
              onChange={onInputChange}
              onBlur={onInputBlur}
              checked={formValues.accountType === ACCOUNT_TYPE_FIELDS_VALUES.CHECKING}
              required
              disabled={hasSavedPayment}
            />
            <Radio
              labelText={labelSavingsAccountType}
              id={`accountType-savings-${id}`}
              name="accountType"
              value={ACCOUNT_TYPE_FIELDS_VALUES.SAVINGS}
              onChange={onInputChange}
              onBlur={onInputBlur}
              checked={formValues.accountType === ACCOUNT_TYPE_FIELDS_VALUES.SAVINGS}
              required
              disabled={hasSavedPayment}
            />
          </div>
          <div className="AccountInput__Field AccountInput__ColumnEnd">
            <p className="AccountInput__FieldLabel">{labelOwnership}</p>
            <Radio
              labelText={labelOwnershipPersonal}
              id={`ownershipType-personal-${id}`}
              name="ownershipType"
              value={OWNERSHIP_FIELDS_VALUES.PERSONAL}
              onChange={onInputChange}
              onBlur={onInputBlur}
              checked={formValues.ownershipType === OWNERSHIP_FIELDS_VALUES.PERSONAL}
              required
              disabled={hasSavedPayment}
            />
            <Radio
              labelText={labelOwnershipBusiness}
              id={`ownershipType-business-${id}`}
              name="ownershipType"
              value={OWNERSHIP_FIELDS_VALUES.BUSINESS}
              onChange={onInputChange}
              onBlur={onInputBlur}
              checked={formValues.ownershipType === OWNERSHIP_FIELDS_VALUES.BUSINESS}
              required
              disabled={hasSavedPayment}
            />
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default AccountInput;
