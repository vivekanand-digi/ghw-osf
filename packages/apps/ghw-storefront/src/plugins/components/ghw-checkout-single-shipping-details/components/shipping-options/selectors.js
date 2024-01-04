/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getCurrentOrderShippingMethods,
  getShippingMethods,
  getClientRequest,
  getOrder,
  getPage,
  getCurrentOrder
} from '@oracle-cx-commerce/commerce-utils/selector';
import {useSelector} from '@oracle-cx-commerce/react-components/provider';
import {ORDER_STATE_QUOTED} from '@oracle-cx-commerce/commerce-utils/constants';

export const useComponentData = ({shippingGroupId}) => {
  const contextOrderId = useSelector(getPage).contextId;
  const currentOrder = useSelector(state =>
    contextOrderId ? getOrder(state, {id: contextOrderId}) : getCurrentOrder(state)
  );
  const quotePage = currentOrder.state === ORDER_STATE_QUOTED ? true : false;

  let shippingMethodIds = useSelector(getCurrentOrderShippingMethods)[shippingGroupId] || [];
  const shippingMethodsForQuote = useSelector(getClientRequest).shippingMethods || {};
  const shippingMethodIdsForQuote = shippingMethodsForQuote ? shippingMethodsForQuote[shippingGroupId] || [] : [];
  const shippingMethodsState = useSelector(getShippingMethods);

  if (quotePage) {
    shippingMethodIds = shippingMethodIdsForQuote;
  }

  const shippingMethodsDetails = shippingMethodIds.reduce((shippingMethods, shippingMethodId) => {
    shippingMethods[shippingMethodId] = shippingMethodsState[shippingMethodId] || {};

    return shippingMethods;
  }, {});

  return {
    shippingMethodsDetails,
    shippingMethodIds
  };
};
