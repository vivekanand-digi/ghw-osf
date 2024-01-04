/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  getCatalogRepository,
  getRequestContext,
  getSearchRepository
} from '@oracle-cx-commerce/commerce-utils/selector';

export const getPageData = state => {
  const {pages} = getSearchRepository(state);
  const {productId} = getRequestContext(state);
  const {products, categories} = getCatalogRepository(state);

  return {
    pages,
    productId,
    products,
    categories
  };
};
