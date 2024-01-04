/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {ORDER_STATE_QUOTED} from '@oracle-cx-commerce/commerce-utils/constants';
import {getCardTypes, getCurrentOrder, getPage, getOrder} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';

export const getCardDetailsData = state => {
  const cardTypes = getCardTypes(state);
  const orderId = getPage(state).contextId;
  const currentOrder = orderId ? getOrder(state, {id: orderId}) : getCurrentOrder(state);
  const quotedOrder = currentOrder.state === ORDER_STATE_QUOTED ? true : false;

  return {
    cardTypes: !isEmptyObject(cardTypes) ? cardTypes : undefined,
    quotedOrder
  };
};
