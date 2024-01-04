import {OWNERSHIP_FIELDS_VALUES} from '../contants/account-fields';

const getAddress = formData => {
  return {
    billingAddress: {
      streetAddress: formData.streetAddress,
      extendedAddress: formData.extendedAddress,
      locality: formData.locality,
      region: formData.region,
      postalCode: formData.postalCode
    }
  };
};

const getNames = formData => {
  if (!formData.ownershipType) {
    return;
  }

  const personalProfile = {
    firstName: formData.firstName,
    lastName: formData.lastName
  };

  if (formData.ownershipType === OWNERSHIP_FIELDS_VALUES.PERSONAL) {
    if (!formData.firstName && !formData.lastName) {
      return;
    }

    return {
      ...personalProfile
    };
  }

  if (formData.businessName) {
    return {
      businessName: formData.businessName
    };
  }
};

export const getTransformedBankDetails = formData => ({
  ...formData,
  ...getNames(formData),
  ...getAddress(formData)
});
