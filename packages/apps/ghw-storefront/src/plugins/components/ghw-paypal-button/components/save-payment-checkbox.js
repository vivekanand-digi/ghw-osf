import React from 'react';
import Checkbox from '@oracle-cx-commerce/react-components/checkbox';

const SavePaymentCheckbox = ({id, isUserLoggedIn, savePayment, savePaymentLabel, isPaymentSuccess, setSavePayment}) => {
  return (
    <>
      {isUserLoggedIn && (
        <div>
          <Checkbox
            id={`PayPalButton-save-payment-option-${id}`}
            name={`PayPalButton-save-payment-option-${id}`}
            value={savePayment}
            labelText={savePaymentLabel}
            disabled={isPaymentSuccess.current}
            onChange={e => {
              setSavePayment(e.currentTarget.checked);
            }}
          ></Checkbox>
        </div>
      )}
    </>
  );
};

export default SavePaymentCheckbox;
