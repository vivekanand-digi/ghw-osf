/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getProductPrice, getSkuPrice} from '@oracle-cx-commerce/commerce-utils/selector';
import {ProductContext, ContainerContext} from '@oracle-cx-commerce/react-ui/contexts';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {useSelector} from '@oracle-cx-commerce/react-components/provider';
import {useContext} from 'react';

/**
 * Returns data required by the component by invoking selectors
 *
 * @param  {String} widgetId Widget Id
 * @param  {String} productId Product Id
 * @return {Object} Object
 */
export const useComponentData = () => {
  // context
  const {id: productId} = useContext(ProductContext);
  const {selections: {skuId = null} = {}} = useContext(ContainerContext);

  const productPrices = useSelector(getProductPrice, {productId}) || {};
  // selectors
  const {
    listPrice: skuListPrice = null,
    salePrice: skuSalePrice = null,
    listVolumePrice = {},
    saleVolumePrice = {}
  } = useSelector(getSkuPrice, {skuId}) || {};

  const {
    priceMin = null,
    priceMax = null,
    priceRange = false,
    list: productListPrice,
    sale: productSalePrice = null
  } = productPrices;

  return {
    pricesLoaded: !isEmptyObject(productPrices),
    skuId,
    productId,
    skuListPrice,
    skuSalePrice,
    priceMin,
    priceMax,
    priceRange,
    productListPrice,
    productSalePrice,
    skuListVolumePrice:
      listVolumePrice.tieredPrice && listVolumePrice.tieredPrice.levels ? listVolumePrice.tieredPrice.levels : [],
    skuListVolumeBulkPrice:
      listVolumePrice.bulkPrice && listVolumePrice.bulkPrice.levels ? listVolumePrice.bulkPrice.levels : [],
    skuSaleVolumePrice:
      saleVolumePrice.tieredPrice && saleVolumePrice.tieredPrice.levels ? saleVolumePrice.tieredPrice.levels : [],
    skuSaleVolumeBulkPrice:
      saleVolumePrice.bulkPrice && saleVolumePrice.bulkPrice.levels ? saleVolumePrice.bulkPrice.levels : []
  };
};
