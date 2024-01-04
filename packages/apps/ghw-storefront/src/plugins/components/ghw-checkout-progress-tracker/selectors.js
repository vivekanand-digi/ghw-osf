/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getCurrentOrder,
  getCurrentOrderId,
  getPage,
  getUUID,
  isCurrentUserB2B,
  getOrder
} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {isPayLaterSelected} from '@oracle-cx-commerce/react-components/utils/payment';

export const getComponentData = state => {
  const orderId = getPage(state).contextId;
  const currentOrder = orderId ? getOrder(state, {id: orderId}) : getCurrentOrder(state);
  const currentOrderId = orderId ? orderId : getCurrentOrderId(state);
  const isPlaceOrderInProgress = getUUID(state) !== '';
  const currentPage = getPage(state);
  const isB2BUser = isCurrentUserB2B(state);

  return {
    currentOrderId,
    currentOrder: !isEmptyObject(currentOrder) ? currentOrder : undefined,
    currentPageType: currentPage.pageType,
    isB2BUser,
    isPlaceOrderInProgress,
    isPayAfterApprovalSelected: isPayLaterSelected(state)
  };
};
