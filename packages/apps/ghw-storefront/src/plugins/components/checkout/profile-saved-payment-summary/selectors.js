/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {isAuthenticated, getCurrentProfileId} from '@oracle-cx-commerce/commerce-utils/selector';
import {compareCards} from '@oracle-cx-commerce/react-components/utils/payment';
import {getCreditCards, getSavedPayments} from '../../../selectors/shopper-profile-selector';
import {getWidgetInfo} from '../../../selectors';

/**
 * Returns data required by the component
 * @return {Object} state the application state
 */
export const getPageData = state => {
  const {clientToken} = getWidgetInfo(state);
  const cards = getCreditCards(state).sort(compareCards);
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  const cardType = !!cards && cards.length ? cards[0].cardType.replace(/\s+/g, '').toLowerCase() || 'generic' : null;
  const savedPayments = getSavedPayments(state);
  const defaultPayment = savedPayments.find(payment => payment.default) || {};

  // return default (or first card if no default card) card and corresponding card type object
  return {
    cardType,
    defaultPayment,
    isUserLoggedIn,
    clientToken
  };
};
