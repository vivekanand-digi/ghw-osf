/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getUUID, getContext, getPage, getOrder} from '@oracle-cx-commerce/commerce-utils/selector';

export const getComponentData = state => {
  let uuid = getUUID(state);

  //Reloading on confirmation page will not have uuid in request. So, get the value from page context
  const contextId = getPage(state).contextId || null;
  const order = getContext(state).uuidToOrder || {};
  uuid = uuid || contextId;
  const orderId = order[uuid] || null;
  const {
    state: orderState = '',
    approvalSystemMessages = {},
    paymentGroups: paymentData = {},
    shippingGroups: shippingAddress = {},
    billingAddress = {},
    commerceItems = {},
    submittedDate: orderSubmittedDate = {},
    dynamicProperties = []
  } = getOrder(state, {id: orderId}) || {};

  return {
    uuid,
    orderId,
    orderState,
    approvalSystemMessages,
    paymentData,
    shippingAddress,
    billingAddress,
    commerceItems,
    orderSubmittedDate,
    dynamicProperties
  };
};
