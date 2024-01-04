/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  isAuthenticated,
  getCurrentOrder,
  getCurrentOrderId,
  getCurrentProfile,
  getCurrentProfileId,
  getOrder,
  getPage
} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';

/**
 * Returns widget's required data
 * @param {Object} state the state object
 * @returns required data
 */
export const getCheckoutPaymentsContainerData = state => {
  const currentOrderId = getCurrentOrderId(state);
  const contextOrderId = getPage(state).contextId;
  const currentOrder = contextOrderId ? getOrder(state, {id: contextOrderId}) : getCurrentOrder(state);

  const orderId = contextOrderId ? contextOrderId : currentOrderId;

  return {
    isUserLoggedIn: isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous',
    isApprovalEnabled: getCurrentProfile(state).derivedApprovalRequired,
    isCurrentOrder: orderId === currentOrderId,
    orderId,
    isOrderExistInStore: isEmptyObject(currentOrder) ? false : true
  };
};
