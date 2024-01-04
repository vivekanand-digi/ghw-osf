/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getCurrentProfileId,
  getProfile,
  isAuthenticated,
  getCurrentOrderId,
  getPage,
  getOrder
} from '@oracle-cx-commerce/commerce-utils/selector';
import {useSelector} from '@oracle-cx-commerce/react-components/provider';
import {ORDER_STATE_QUOTED} from '@oracle-cx-commerce/commerce-utils/constants';

export const useComponentData = () => {
  const currOrderId = useSelector(getCurrentOrderId);
  const contextOrderId = useSelector(getPage).contextId;
  const currentOrderId = contextOrderId ? contextOrderId : currOrderId;
  const currentOrder = useSelector(getOrder, {id: currentOrderId});
  const quotePage = currentOrder.state === ORDER_STATE_QUOTED;

  const currentProfileId = useSelector(getCurrentProfileId);
  const currentProfile = useSelector(getProfile);
  const isUserLoggedIn = useSelector(isAuthenticated) && currentProfileId !== 'anonymous';
  const {shippingGroups = {}} = currentOrder;

  return {
    isUserLoggedIn,
    shippingGroups,
    currentOrderId,
    quotePage,
    currentProfile,
    currentOrder
  };
};
