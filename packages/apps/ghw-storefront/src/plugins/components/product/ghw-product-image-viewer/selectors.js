/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {useContext} from 'react';
import {ProductContext, ContainerContext} from '@oracle-cx-commerce/react-ui/contexts';
/**
 * Returns data required by the component by invoking selectors
 *
 * @param  {String} widgetId Widget Id
 * @param  {Object} product Product
 * @return {Object} Object
 */
export const useComponentData = () => {
  // context
  const {selections: {variantOptions = {}} = {}} = useContext(ContainerContext);
  const {
    listingVariantKeyId = null,
    listingVariantValues = {},
    mediumImageURLs = [],
    primaryImageTitle,
    thumbImageURLs = []
  } = useContext(ProductContext);
  let activeImages = mediumImageURLs;
  let thumbImages = thumbImageURLs;

  if (!isEmptyObject(variantOptions)) {
    const listingVariant = variantOptions[listingVariantKeyId] || {};
    const {selectedValue = null} = listingVariant;

    if (selectedValue !== null && selectedValue !== undefined) {
      const key = `${listingVariantKeyId}=${selectedValue}`;
      if (listingVariantValues[key]) {
        activeImages = listingVariantValues[key].mediumImageURLs;
        thumbImages = listingVariantValues[key].thumbImageURLs;
      }
    }
  }

  return {
    primaryImageTitle,
    activeImages,
    thumbImages
  };
};
