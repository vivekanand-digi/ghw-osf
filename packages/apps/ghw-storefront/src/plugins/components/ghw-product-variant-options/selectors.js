/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {ContainerContext} from '@oracle-cx-commerce/react-ui/contexts';
import {getSku} from '@oracle-cx-commerce/commerce-utils/selector';
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
  // selectors
  const {selections: {skuId = null} = {}} = useContext(ContainerContext);

  const {x_skuSubscriptionBenefits, x_returnPolicy} = useSelector(getSku, {skuId});
  // const SKU = useSelector(getSku, {skuId});
  // console.log('sku id -->', SKU);

  return {
    x_skuSubscriptionBenefits,
    x_returnPolicy
  };
};
