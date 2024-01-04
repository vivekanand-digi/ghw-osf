import {PAGE_CHECKOUT_PAYMENT_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import Link from '@oracle-cx-commerce/react-components/link';
import Card from '@oracle-cx-commerce/react-components/card';
import {getSelectedPaymentInfo} from '../helpers/payment-info-data';
import css from './styles.css';
import paymentIcons from '../helpers/icons';

const icons = {
  'apple-pay': paymentIcons.applePayIcon,
  'google-pay': paymentIcons.googlePayIcon,
  paypal: paymentIcons.paypalIcon,
  'credit-card': paymentIcons.creditCardIcon,
  venmo: paymentIcons.venmoIcon,
  'secure-remote-commerce': paymentIcons.srcIcon,
  'local-payment': paymentIcons.generic,
  ach: paymentIcons.usBankBTSrc
};

const SelectedPaymentInfo = props => {
  const {showEditLink = false, header, labelEdit} = props;
  const {
    applePaySelectedText = 'Paying with Apple Pay',
    googlePaySelectedText = 'Paying with Google Pay',
    paypalSelectedText = 'Paying with PayPal',
    creditCardSelectedText = 'Paying with Credit Card',
    venmoSelectedText = 'Paying with Venmo',
    srcSelectedText = 'Paying with Secure Remote Commerce',
    localPaymentText = 'Paying with Local Payment method',
    savedPaymentText = 'Paying with saved payment method',
    textPayingWithUSBankAccount = 'Paying with ACH US bank account'
  } = props;
  const labels = {
    'apple-pay': applePaySelectedText,
    'google-pay': googlePaySelectedText,
    paypal: paypalSelectedText,
    'credit-card': creditCardSelectedText,
    venmo: venmoSelectedText,
    'secure-remote-commerce': srcSelectedText,
    'local-payment': localPaymentText,
    'saved-payment': savedPaymentText,
    ach: textPayingWithUSBankAccount
  };
  const info = getSelectedPaymentInfo();
  if (info) {
    if (!Object.keys(icons).includes(info.paymentType)) {
      info.paymentType = 'credit-card';
    }
  }

  return (
    <Styled id="SelectedPaymentInfo" css={css}>
      <div className="SelectedPaymentInfo">
        <div className="SelectedPaymentInfo__HeadingContainer">
          <h2>{header}</h2>
          {showEditLink && (
            <div className="SelectedPaymentInfo__EditPayment">
              <Link href={PAGE_CHECKOUT_PAYMENT_LINK}>{labelEdit}</Link>
            </div>
          )}
        </div>
        <Card className="SelectedPaymentInfo__Card">
          {info.imageUrl ? <img src={info.imageUrl}></img> : icons[info.paymentType]()}
          <span className="payment-type-label">{labels[info.paymentType]}</span>
        </Card>
      </div>
    </Styled>
  );
};

export default SelectedPaymentInfo;
