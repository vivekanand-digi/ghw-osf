/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {
  isAuthenticated,
  getCurrentProfile,
  getPaymentConfigurations,
  getSavedCardsForProfile,
  getCurrentOrder,
  getCurrentProfileId,
  getPage,
  getOrder
} from '@oracle-cx-commerce/commerce-utils/selector';
import {
  PAYMENT_TYPE_CARD,
  PAYMENT_STATE_INITIAL,
  PAYMENT_METHOD_CREDIT_CARD,
  PAYMENT_METHOD_TOKENIZED_CREDIT_CARD
} from '@oracle-cx-commerce/commerce-utils/constants';
import {
  isPaymentDisabled,
  isZeroValueOrder,
  isPaymentEnabledForApproval,
  getPaymentEnabledForScheduledOrder
} from '@oracle-cx-commerce/react-components/utils/payment';

export const getCheckoutCreditCardData = state => {
  const isLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';

  // get saved cards of the user
  const {currentSiteSavedCardIds = []} = getSavedCardsForProfile(state);
  const paymentMethods = getPaymentConfigurations(state).paymentMethods || [];

  const contextOrderId = getPage(state).contextId;
  const currentOrder = contextOrderId ? getOrder(state, {id: contextOrderId}) : getCurrentOrder(state);

  const {paymentGroups = {}} = currentOrder;
  // Get the applied credit card payment group from the order
  // Do not show Applied credit card payment group if it is expired or its amount is 0.
  // Display the applied payment group if amount is zero and only payment group exists in the order(applicable for zero value order)
  const appliedCreditCardPaymentGroup = Object.values(paymentGroups).find(paymentGroup => {
    return (
      (paymentGroup.paymentMethod === PAYMENT_METHOD_CREDIT_CARD ||
        paymentGroup.paymentMethod === PAYMENT_METHOD_TOKENIZED_CREDIT_CARD) &&
      paymentGroup.paymentState === PAYMENT_STATE_INITIAL &&
      !paymentGroup.default_initial &&
      !paymentGroup.paymentExpired &&
      (paymentGroup.amount !== 0 || (paymentGroup.amount === 0 && Object.keys(paymentGroups).length === 1))
    );
  });

  return {
    appliedCreditCardPaymentGroup,
    isCardPaymentDisabled: isPaymentDisabled(currentOrder) && !isZeroValueOrder(currentOrder),
    isDisplayCreditCard: paymentMethods.findIndex(paymentMethod => paymentMethod === PAYMENT_TYPE_CARD) > -1,
    isLoggedIn,
    savedCardExists: currentSiteSavedCardIds.length > 0,
    isPaymentMethodEnabledForApproval: isPaymentEnabledForApproval(state, PAYMENT_TYPE_CARD),
    isApprovalEnabled: getCurrentProfile(state).derivedApprovalRequired,
    PaymentInfoForScheduledOrder: getPaymentEnabledForScheduledOrder(state, PAYMENT_TYPE_CARD)
  };
};
