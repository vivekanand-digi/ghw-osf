import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import Card from '@oracle-cx-commerce/react-components/card';
import Badge from '@oracle-cx-commerce/react-components/badge';
import css from './payment-option.css';

const PaymentOption = ({savedPayment, onSelect, paymentSelectedLabel, selectButtonLabel}) => {
  const {paypal_id, selected} = savedPayment;

  return (
    <Styled id="PaymentOption" css={css}>
      <Card className="PaymentOption">
        <div className="PaymentOption__PaymentDetails">
          <span className="PaymentOption__Name">{paypal_id}</span>
          <div className="PaymentOption__PaymentActionsContainer">
            <div className="PaymentOption__SelectedPaymentContainer">
              {selected ? (
                <Badge badgeText={paymentSelectedLabel} ariaLabel={paymentSelectedLabel} />
              ) : (
                <>
                  <button
                    type="button"
                    className="PaymentOption__SelectPayment"
                    onClick={() => {
                      onSelect(paypal_id);
                    }}
                  >
                    {selectButtonLabel}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Styled>
  );
};

export default PaymentOption;
