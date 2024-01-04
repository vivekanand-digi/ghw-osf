import PropTypes from 'prop-types';
import React from 'react';

import AccountAddressForm from '../account-address-form';
import AccountDetailsForm from '../account-details-form';

const NonTokenizedCheckForm = ({
  defaultCountry,
  id,
  labelAccountNumber,
  labelAccountType,
  labelAddress,
  labelAddressHeader,
  labelBusinessName,
  labelCheckingAccountType,
  labelCity,
  labelFirstName,
  labelHeader,
  labelLastName,
  labelOwnershipBusiness,
  labelOwnershipPersonal,
  labelOwnershipType,
  labelPostCode,
  labelRoutingNumber,
  labelSavingsAccountType,
  labelState,
  shippingCountries
}) => {
  return (
    <>
      <h3>{labelHeader}</h3>
      <AccountDetailsForm
        id={id}
        labelAccountNumber={labelAccountNumber}
        labelAccountType={labelAccountType}
        labelCheckingAccountType={labelCheckingAccountType}
        labelOwnershipBusiness={labelOwnershipBusiness}
        labelOwnershipPersonal={labelOwnershipPersonal}
        labelOwnershipType={labelOwnershipType}
        labelRoutingNumber={labelRoutingNumber}
        labelSavingsAccountType={labelSavingsAccountType}
      />
      <h3>{labelAddressHeader}</h3>
      <AccountAddressForm
        countryList={shippingCountries}
        defaultCountry={defaultCountry}
        labelBusinessName={labelBusinessName}
        labelAddress={labelAddress}
        labelCity={labelCity}
        labelState={labelState}
        labelPostCode={labelPostCode}
        labelFirstName={labelFirstName}
        labelLastName={labelLastName}
        id={id}
      />
    </>
  );
};

NonTokenizedCheckForm.propTypes = {
  id: PropTypes.string.isRequired,
  labelAccountNumber: PropTypes.string.isRequired,
  labelOwnershipType: PropTypes.string.isRequired,
  labelAccountType: PropTypes.string.isRequired,
  labelAddress: PropTypes.string.isRequired,
  labelBusinessName: PropTypes.string.isRequired,
  labelCity: PropTypes.string.isRequired,
  labelFirstName: PropTypes.string.isRequired,
  labelLastName: PropTypes.string.isRequired,
  labelPostCode: PropTypes.string.isRequired,
  labelRoutingNumber: PropTypes.string.isRequired,
  labelState: PropTypes.string.isRequired
};

export default NonTokenizedCheckForm;
