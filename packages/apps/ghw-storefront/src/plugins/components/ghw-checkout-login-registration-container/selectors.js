/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {
  getOrder,
  getPage,
  getCurrentOrder,
  getCurrentOrderId,
  getCurrentProfileId,
  getCartEndpointStatus,
  getGiftWithPurchaseMessages,
  getRoles,
  getSkuInventoryItems,
  isAuthenticated,
  isCurrentUserB2B
} from '@oracle-cx-commerce/commerce-utils/selector';

export const getComponentData = state => {
  const currentOrderId = getCurrentOrderId(state);
  const contextOrderId = getPage(state).contextId;
  const currentOrder = contextOrderId ? getOrder(state, {id: contextOrderId}) : getCurrentOrder(state);
  const orderId = contextOrderId ? contextOrderId : currentOrderId;
  const isB2BUser = isCurrentUserB2B(state);
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  const roles = getRoles(state);
  const skuInventory = getSkuInventoryItems(state);
  const totalGwpMessages = getGiftWithPurchaseMessages(state) || {};
  const giftWithPurchaseMessages = totalGwpMessages[getCurrentOrderId(state)]
    ? totalGwpMessages[getCurrentOrderId(state)].messages
    : [];
  const isGetCartInProgress = getCartEndpointStatus(state);

  return {
    orderId,
    currentOrder,
    isB2BUser,
    isUserLoggedIn,
    roles,
    skuInventory,
    giftWithPurchaseMessages,
    isGetCartInProgress,
    isCurrentOrder: orderId === currentOrderId
  };
};
