/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {
  getCardTypes,
  getSavedCardsForProfile,
  isAuthenticated,
  getCurrentOrder
} from '@oracle-cx-commerce/commerce-utils/selector';
import {isPayLaterSelected, compareCards, isZeroValueOrder} from '@oracle-cx-commerce/react-components/utils/payment';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {
  PAYMENT_METHOD_CREDIT_CARD,
  PAYMENT_METHOD_TOKENIZED_CREDIT_CARD,
  PAYMENT_STATE_INITIAL
} from '@oracle-cx-commerce/commerce-utils/constants';

export const getCheckoutSavedCardsData = state => {
  const cardTypes = getCardTypes(state);

  // get saved cards of the user and set the default saved card
  const {savedCardsMap, currentSiteSavedCardIds} = getSavedCardsForProfile(state);
  const savedCards = [];
  let defaultSavedCardId;
  if (currentSiteSavedCardIds) {
    currentSiteSavedCardIds.forEach(cardId => {
      if (!savedCardsMap[cardId].hasExpired) {
        savedCards.push(savedCardsMap[cardId]);
        if (!defaultSavedCardId) {
          defaultSavedCardId = savedCardsMap[cardId].isDefault ? cardId : undefined;
        }
      }
    });
    if (!defaultSavedCardId && savedCards.length > 0) {
      defaultSavedCardId = savedCards[0].savedCardId;
    }
  }
  //Pay After Approval detail is stored as part of componentData in session.
  const isPayAfterApprovalSelected = isPayLaterSelected(state);
  // Check if there are other applied payment groups other then credit card.
  // or the order is a zero value order
  const order = getCurrentOrder(state);
  const {paymentGroups = {}} = order;
  const hasOtherAppliedPayments =
    isZeroValueOrder(order) ||
    Object.values(paymentGroups).some(
      paymentGroup =>
        paymentGroup.paymentState === PAYMENT_STATE_INITIAL &&
        !paymentGroup.paymentExpired &&
        paymentGroup.amount !== 0 &&
        paymentGroup.paymentMethod !== PAYMENT_METHOD_CREDIT_CARD &&
        paymentGroup.paymentMethod !== PAYMENT_METHOD_TOKENIZED_CREDIT_CARD
    ) ||
    isPayAfterApprovalSelected;

  return {
    cardTypes: !isEmptyObject(cardTypes) ? cardTypes : undefined,
    savedCards: savedCards.sort(compareCards),
    defaultSavedCardId,
    hasOtherAppliedPayments,
    isLoggedIn: isAuthenticated(state)
  };
};
