/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {useContext, useState, useEffect} from 'react';
import {getCurrentProduct} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {useSelector} from '@oracle-cx-commerce/react-components/provider';
import fetchCurrentProductDetails from '@oracle-cx-commerce/fetchers/product/fetch-current-product-details';
import {updateProductSocialTagsForClient} from '@oracle-cx-commerce/commerce-utils/social';

/*
 * Hook to fetchCurrentProductDetails and update social tags
 */
const usePDPFetcher = store =>
  useEffect(() => {
    if (isEmptyObject(getCurrentProduct(store.getState()))) {
      fetchCurrentProductDetails(store).then(() => {
        // Updates product social tags after fetching current product
        updateProductSocialTagsForClient(window, store.getState());
      });
    }
  }, [store]);

/**
 * Returns data required by the component by invoking selectors
 *
 * @param  {String} widgetId Widget Id
 * @param  {String} productId Product Id
 * @return {Object} Object
 */
export const useComponentData = () => {
  // state
  const [selections, setSelections] = useState({});

  const store = useContext(StoreContext);
  const product = useSelector(getCurrentProduct);
  const isProductFound = !isEmptyObject(product);
  usePDPFetcher(store);

  const skuNotInProducts = (childSKUs, skuId) => {
    const sku = childSKUs.find(chidSKU => chidSKU === skuId);

    return sku === undefined ? true : false;
  };

  if (isProductFound) {
    // setSelections only when there is valid product/sku

    const {variantOptionsSeed, variantToSkuLookup = [], childSKUs = []} = product;

    // For products with no variant options, the skuId is set in the initial state.
    const skuId = isEmptyObject(variantOptionsSeed) ? variantToSkuLookup[''] : null;
    if (
      isEmptyObject(selections) ||
      (isEmptyObject(variantOptionsSeed) && skuId !== selections.skuId) ||
      (!isEmptyObject(variantOptionsSeed) && selections.skuId && skuNotInProducts(childSKUs, selections.skuId))
    ) {
      setSelections({
        skuId,
        variantOptions: {},
        freq: null,
        qty: 1
      });
    }
  }

  const productSelection = {
    productId: product.id,
    skuId: selections.skuId,
    quantity: selections.qty
  };

  return {
    isProductFound,
    product,
    selections,
    setSelections,
    productSelection
  };
};
