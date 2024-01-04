/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

 import {
  ContainerContext,
  ProductContext,
} from "@oracle-cx-commerce/react-ui/contexts";
import {
  getCurrentOrder,
  getGiftWithPurchaseMessages,
  getProduct,
  getSku,
  getLocationBasedInventory,
  getCurrentOrderId,
  isAuthenticated,
} from "@oracle-cx-commerce/commerce-utils/selector";
import { useSelector } from "@oracle-cx-commerce/react-components/provider";
import { useContext } from "react";
/**
 * Returns data required by the component by invoking selectors
 *
 * @param  {String} widgetId Widget Id
 * @param  {String} productId Product Id
 * @return {Object} Object
 */
export const useComponentData = () => {
  // selectors
  const {
    id: productId,
    x_cycle1Skus: xCycle1Skus,
    x_mbg: mbg,
    x_pamphlet,
    x_insertType,
    x_splitBundle,
    x_kitSKU,
    x_boxesSize,
    x_boxesCode
  } = useContext(ProductContext);
  const {
    selections: {
      skuId = null,
      qty = 1,
      selectedStore = {},
      isPickupInStoreOptionSelected = false,
      childItems = [],
      freq = null,
    } = {},
  } = useContext(ContainerContext);

  const locationId =
    isPickupInStoreOptionSelected && selectedStore.locationId
      ? selectedStore.locationId
      : "";
  const { stockStatus, orderableQuantity } = useSelector(
    getLocationBasedInventory,
    {
      skuId,
      locationId,
    }
  );
  const {
    commerceItems = {},
    numberOfItems = 0,
    shippingGroups = {},
  } = useSelector(getCurrentOrder);
  const totalGwpMessages = useSelector(getGiftWithPurchaseMessages) || {};
  const currentOrderId = useSelector(getCurrentOrderId);
  const giftWithPurchaseMessages = totalGwpMessages[currentOrderId]
    ? totalGwpMessages[currentOrderId].messages
    : [];

  // get thumbImages from Sku or product
  const { configurable = false, x_erpPart, x_cycle1Skus_standalone} = useSelector(getSku, { skuId });

  const { orderLimit } = useSelector(getProduct, { productId });

  const isUserLoggedIn = useSelector(isAuthenticated);

  return {
    productId,
    commerceItems,
    shippingGroups,
    numberOfItems,
    skuId,
    selectedStore,
    isPickupInStoreOptionSelected,
    qty,
    childItems,
    stockStatus,
    orderableQuantity,
    orderLimit,
    configurable,
    giftWithPurchaseMessages,
    isUserLoggedIn,
    xCycle1Skus,
    x_cycle1Skus_standalone,
    freq,
    mbg,
    x_pamphlet,
    x_insertType,
    x_splitBundle,
    x_kitSKU,
    x_boxesSize,
    x_boxesCode,
    x_erpPart,
  };
};
