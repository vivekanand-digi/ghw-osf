import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import Radio from '@oracle-cx-commerce/react-components/radio';
import {ACHDirectDebitContext} from '../../context';

const AccountDetailsForm = ({
  id,
  labelAccountNumber,
  labelAccountType,
  labelCheckingAccountType,
  labelOwnershipType,
  labelRoutingNumber,
  labelSavingsAccountType,
  labelOwnershipBusiness,
  labelOwnershipPersonal
}) => {
  const {
    formValues: {accountNumber, routingNumber, ownershipType, accountType},
    setFormFieldValue
  } = useContext(ACHDirectDebitContext);

  const handleInputChange = event => {
    setFormFieldValue(event.target.name, event.target.value);
  };

  const handleRadioChange = name => event => {
    setFormFieldValue(name, event.target.value);
  };

  return (
    <div className="AccountDetailsForm">
      <div className="AccountDetailsForm__Field">
        <label htmlFor={`account-${id}`}>{labelAccountNumber}</label>
        <input
          id={`account-${id}`}
          aria-label={labelAccountNumber}
          type="number"
          name="accountNumber"
          onChange={handleInputChange}
          value={accountNumber}
          required
        />
        <span className="validationMessage"></span>
      </div>
      <div className="AccountDetailsForm__Field">
        <label htmlFor={`routing-${id}`}>{labelRoutingNumber}</label>
        <input
          id={`routing-${id}`}
          aria-label={labelRoutingNumber}
          type="number"
          name="routingNumber"
          value={routingNumber}
          onChange={handleInputChange}
          required
        />
        <span className="validationMessage"></span>
      </div>
      <div className="AccountDetailsForm__Field Options">
        <div className="AccountDetailsForm__Field Options__Container">
          <label htmlFor={`type-${id}`}>{labelAccountType}</label>
          <div className="Options__RadioButtons">
            <Radio
              id={`${id}_accountType`}
              name="checking"
              value="checking"
              onChange={() => undefined}
              onClick={handleRadioChange('accountType')}
              checked={accountType === 'checking'}
              labelText={labelCheckingAccountType}
            />
            <Radio
              id={`${id}_accountType`}
              name="savings"
              value="savings"
              onChange={() => undefined}
              onClick={handleRadioChange('accountType')}
              checked={accountType === 'savings'}
              labelText={labelSavingsAccountType}
            />
          </div>
        </div>
        <div className="AccountDetailsForm__Field Options__Container">
          <label htmlFor={`type-${id}`}>{labelOwnershipType}</label>
          <div className="Options__RadioButtons">
            <Radio
              id={`${id}_ownership`}
              name="personal"
              value="personal"
              onChange={() => undefined}
              onClick={handleRadioChange('ownershipType')}
              checked={ownershipType === 'personal'}
              labelText={labelOwnershipPersonal}
            />
            <Radio
              id={`${id}_ownership`}
              name="business"
              value="business"
              onChange={() => undefined}
              onClick={handleRadioChange('ownershipType')}
              checked={ownershipType === 'business'}
              labelText={labelOwnershipBusiness}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

AccountDetailsForm.propTypes = {
  id: PropTypes.string.isRequired,
  labelAccountNumber: PropTypes.string.isRequired,
  labelAccountType: PropTypes.string.isRequired,
  labelRoutingNumber: PropTypes.string.isRequired,
  labelOwnershipType: PropTypes.string.isRequired
};

export default AccountDetailsForm;

// 135 / 87;
// 128 / 90;
