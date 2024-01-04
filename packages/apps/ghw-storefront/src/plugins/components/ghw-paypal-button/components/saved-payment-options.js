import React from 'react';
import PaymentOption from './payment-option';

const SavedPaymentOptions = ({
  showSavedPayments,
  setShowSavedPayments,
  onSelect,
  labelUseSavedPayment = 'Pay with saved PayPal account',
  labelNewPayment = 'Pay with another PayPal account',
  savedPayments = [],
  paymentSelectedLabel,
  selectButtonLabel,
  defaultPayPalId
}) => {
  return (
    <>
      <div>
        {!showSavedPayments && (
          <button
            type="button"
            onClick={() => {
              onSelect(defaultPayPalId);
              setShowSavedPayments(true);
            }}
          >
            {labelUseSavedPayment}
          </button>
        )}
        {!!showSavedPayments && (
          <button
            type="button"
            onClick={() => {
              onSelect();
              setShowSavedPayments(false);
            }}
          >
            {labelNewPayment}
          </button>
        )}
      </div>
      {!!showSavedPayments && (
        <div>
          {savedPayments.map(s => (
            <PaymentOption
              key={s.paypal_id}
              savedPayment={s}
              onSelect={onSelect}
              paymentSelectedLabel={paymentSelectedLabel}
              selectButtonLabel={selectButtonLabel}
            ></PaymentOption>
          ))}
        </div>
      )}
    </>
  );
};

export default SavedPaymentOptions;
