const paypalFundingOptions = [
  'card',
  'credit',
  'paylater',
  'bancontact',
  'blik',
  'eps',
  'giropay',
  'ideal',
  'mercadopago',
  'mybank',
  'p24',
  'sepa',
  'sofort'
];

export const setSelectedPaymentInfo = data => {
  if (localStorage) {
    const paymentType = paypalFundingOptions.includes(data.paymentType) ? 'paypal' : data.paymentType;
    localStorage.setItem('__BRAINTREE-SELECTED-PAYMENT__', JSON.stringify({paymentType}));
  }
};

export const getSelectedPaymentInfo = () => {
  if (localStorage) {
    const data = localStorage.getItem('__BRAINTREE-SELECTED-PAYMENT__');
    if (data) {
      return JSON.parse(data);
    }
  }
  return null;
};
