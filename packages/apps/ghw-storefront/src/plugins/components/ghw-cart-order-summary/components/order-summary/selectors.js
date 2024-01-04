/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getSite, isCurrentOrderScheduled} from '@oracle-cx-commerce/commerce-utils/selector';

export const getSiteData = state => {
  const currentSite = getSite(state);
  const currentOrderScheduled = isCurrentOrderScheduled(state);

  return {
    showTaxSummary: currentSite.showTaxSummary,
    isCurrentOrderScheduled: currentOrderScheduled
  };
};
