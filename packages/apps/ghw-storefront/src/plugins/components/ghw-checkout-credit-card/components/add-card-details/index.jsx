/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React from 'react';
import CheckoutBillingAddress from '../checkout-billing-address';
import CheckoutCardDetails from '../checkout-card-details';
import CheckoutSaveCardToProfile from '../checkout-save-card-to-profile';

// Add new card details component containing card details, billing address and save card to profile component
const AddCardDetails = props => {
  // Get the card details,billing address and save card to profile if there is a applied credit card payment group
  const {appliedCreditCardPaymentGroup, ...remainingProps} = props;
  let appliedPaymentGroupBillingAddress, appliedPaymentGroupSaveCardToProfile, appliedPaymentGroupCardDetails;
  if (appliedCreditCardPaymentGroup && !appliedCreditCardPaymentGroup.savedCardId) {
    const {billingAddress, saveCard, ...remainingCardDetails} = appliedCreditCardPaymentGroup;
    appliedPaymentGroupCardDetails = remainingCardDetails;
    appliedPaymentGroupBillingAddress = billingAddress;
    appliedPaymentGroupSaveCardToProfile = saveCard === 'true' ? true : false;
  }

  return (
    <React.Fragment>
      <CheckoutCardDetails {...remainingProps} appliedPaymentGroupCardDetails={appliedPaymentGroupCardDetails} />
      <CheckoutSaveCardToProfile
        {...remainingProps}
        appliedPaymentGroupSaveCardToProfile={appliedPaymentGroupSaveCardToProfile}
      />
      <CheckoutBillingAddress
        {...remainingProps}
        appliedPaymentGroupBillingAddress={appliedPaymentGroupBillingAddress}
      />
    </React.Fragment>
  );
};

export default AddCardDetails;
