export const convertSelectedSavedPaymentToFormValues = selectedSavedAccount => {
  return {
    firstName: selectedSavedAccount.firstName,
    lastName: selectedSavedAccount.lastName,
    businessName: selectedSavedAccount.businessName,
    accountType: selectedSavedAccount.accountType,
    accountNumber: selectedSavedAccount.last4,
    routingNumber: selectedSavedAccount.routingNumber,
    ownershipType: selectedSavedAccount.ownershipType,
    makeDefault: selectedSavedAccount.default
  };
};
