import {t} from '@oracle-cx-commerce/utils/generic';

export const getPaymentType = savedPayment => {
  if (!savedPayment) {
    return null;
  }

  if (savedPayment.email) {
    return 'paypal';
  }

  if (savedPayment.venmoUserId) {
    return 'venmo';
  }

  if (savedPayment.bankName) {
    return 'ach';
  }

  return 'credit-card';
};

export const getPaymentDescription = (savedPayment, {textSavedPaymentBankDescription}) => {
  if (!savedPayment) {
    return null;
  }
  if (savedPayment.email) {
    return savedPayment.email;
  }

  if (savedPayment.venmoUserId) {
    return savedPayment.venmoUserId;
  }

  if (savedPayment.maskedNumber) {
    return savedPayment.maskedNumber;
  }

  if (savedPayment.bankName) {
    return t(textSavedPaymentBankDescription, {bankName: savedPayment.bankName, last4: savedPayment.last4});
  }
};
