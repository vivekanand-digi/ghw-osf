/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  isAuthenticated,
  getCurrentOrderId,
  getCurrentOrderScheduleInfo
} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';

export const getComponentData = state => {
  const authenticated = isAuthenticated(state);
  const currentOrderId = getCurrentOrderId(state);
  let isCurrentOrderScheduled = false;
  const scheduleInfo = getCurrentOrderScheduleInfo(state);
  if (!isEmptyObject(scheduleInfo) && scheduleInfo.schedule) {
    isCurrentOrderScheduled = true;
  }

  return {
    authenticated,
    currentOrderId,
    isCurrentOrderScheduled,
    scheduleInfo
  };
};
