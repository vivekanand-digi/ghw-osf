/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

 import {
  ContainerContext,
  StoreContext,ProductContext 
} from "@oracle-cx-commerce/react-ui/contexts";
import React, { useContext, useState } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
import { formToJson } from "@oracle-cx-commerce/react-components/utils";
import { t } from "@oracle-cx-commerce/utils/generic";
import {
  PREORDERABLE,
  OUT_OF_STOCK,
} from "@oracle-cx-commerce/commerce-utils/constants/cart";
import { getTotalItemQuantityFromOtherSGs } from "@oracle-cx-commerce/react-components/utils/cart";
import PropTypes from "prop-types";
import { useComponentData } from "../../selectors";
import css from "./styles.css";

/**
 * A widget for adding an item to the cart.
 * Validates stock status before adding item to the cart.
 * The quantity and order limits validations are performed in quantity widget
 * Displays the last item added to the cart in the mini cart.
 */
 
// constants
const stockStatuses = {
  OUT_OF_STOCK,
  PREORDERABLE,
};

/**
 * Performs simple quantity validation.
 * qty is zero if validations fail in product Qty Widget.
 * @param  {Number} qty Quantity
 * @return {Boolean} true if quantity is valid
 */
const isValidQty = (qty) => {
  return qty > 0;
};

const AddToCartButton = (props) => {
  // contexts
  const { action } = useContext(StoreContext);

  //resources
  const {
    actionAddToCart,
    alertAddToCartAdding,
    actionAddToCartPreOrder,
    alertTotalItemQuantityExceeded,
    onAddToCart,
  } = props;

  // selectors
  const {
    productId,
    shippingGroups,
    skuId,
    selectedStore,
    isPickupInStoreOptionSelected,
    qty = 1,
    childItems,
    stockStatus,
    orderableQuantity,
    orderLimit,
    configurable,
    xCycle1Skus,
    x_cycle1Skus_standalone,
    freq,
    mbg,
    x_erpPart,
    x_pamphlet,
    x_insertType,
    x_splitBundle,
    x_kitSKU,
    x_boxesSize,
    x_boxesCode
  } = useComponentData();

  // state
  const [addToCartInProgress, setAddToCartInProgress] = useState(false);

  // helpers

  /**
   * Returns the boolean value based on whether Add-On Items have an item with no Sku selected.
   */
  const addOnItemHasNoSkuSelected = () => {
    return childItems.some((selectedAddOn) => !selectedAddOn.catRefId);
  };

  /**
   * Returns true is Add To Cart button should be disabled
   * Disable add to cart button, when
   * Add to cart in progress,
   * No sku id is selected
   * Sku is Out of stock
   * Sku is externally configurable
   */
  const isAddToCartButtonDisabled = () => {
    return (
      addToCartInProgress ||
      (isPickupInStoreOptionSelected === true && !selectedStore.locationId) ||
      !skuId ||
      (skuId && stockStatus === stockStatuses.OUT_OF_STOCK) ||
      !isValidQty(qty) ||
      configurable ||
      addOnItemHasNoSkuSelected()
    );
  };

  /**
   * Returns the dynamic label for Add To Cart button
   */
  const getAddToCartButtonText = () => {
    if (addToCartInProgress) {
      return alertAddToCartAdding;
    }
    if (stockStatus === stockStatuses.PREORDERABLE) {
      return actionAddToCartPreOrder;
    }

    return actionAddToCart;
  };

  /**
   * Returns true if quantity of item added passes below rules
   * 1. more than 0
   * 2. less than qtyAvailable which is (Lower value of (Inventory Count - Stock Threshold Value) OR Order Limit )
   *
   * @param  {String} qty Quantity to be added to cart
   * @return {Object} Object with Quantity validation data
   */
  const validateQty = (qty) => {
    const qtyAdded = qty ? parseInt(qty, 10) : 0;
    const itemQtyInCart = getTotalItemQuantityFromOtherSGs({
      skuId,
      selectedStore,
      isPickupInStoreOptionSelected,
      shippingGroups,
    });
    const qtyAvailable =
      orderableQuantity && orderableQuantity > 0 ? orderableQuantity : 1;
    const maxQtyAllowed =
      orderLimit && orderLimit < qtyAvailable ? orderLimit : qtyAvailable;

    return {
      isQtyValid:
        qtyAdded && qtyAdded > 0 && qtyAdded + itemQtyInCart <= maxQtyAllowed,
      maxQtyAllowed,
      itemQtyInCart,
    };
  };

  /**
   * Failure handler for Add To Cart button
   */
  const onNotOk = ({ error: { message = "" } = {} } = {}) => {
    action("notify", { level: "error", message });
  };

  /**
   * When the action completes, clear add to cart progress state
   */
  const onComplete = () => {
    setAddToCartInProgress(false);
  };

  /**
   * Handler for Add to Cart click.
   * Dispatches action when add to cart is clicked.
   * Throws validation errors if quantity added is invalid
   * @param  {Event} event
   */
  const handleAddToCart = (event) => {
    event.preventDefault();
    action("notifyClearAll");
    const form = event.target;

    if (form.checkValidity()) {
      const payload = formToJson(form);
      if (isPickupInStoreOptionSelected === true && selectedStore.locationId) {
        payload.locationId = selectedStore.locationId;
      }
      if (childItems.length > 0) {
        payload.childItems = [...childItems];
      }
      const { isQtyValid, maxQtyAllowed, itemQtyInCart } = validateQty(
        payload.quantity
      );
      if (isQtyValid) {
        payload.x_MBG_ct = mbg;
        payload.x_erpPartNo = x_erpPart;
        payload.ghwPamphlet = x_pamphlet;
        payload.ghwInsertType = x_insertType;
        payload.ghwSplitBundle1 = x_splitBundle;
        payload.ghwKitSKU = x_kitSKU;
        payload.ghwBoxesSize = x_boxesSize;
        payload.ghwBoxesCode = x_boxesCode;

        // console.log("Arpit>> x_cycle1Skus_standalone sku data:",x_cycle1Skus_standalone,x_erpPart);

        if (x_cycle1Skus_standalone || typeof x_cycle1Skus_standalone !== "undefined") {
          payload.ghwOfferSkusC1 = x_cycle1Skus_standalone;
          console.log("Arpit>> sku details:",payload.ghwOfferSkusC1);
        }
        else{
          payload.ghwOfferSkusC1 = xCycle1Skus;
          console.log("Arpit>> sku details:",payload.ghwOfferSkusC1);
        }
        
        // if (xCycle1Skus || typeof xCycle1Skus !== "undefined") {
        //   payload.ghwOfferSkusC1 = xCycle1Skus;
        //   console.log("Arpit>> x_cycle1Skus_standalone",payload.ghwOfferSkusC1);
        // }
        if (freq != null) {
          console.log("add to cart freq -->", freq);
          payload.ghwSubscription = freq;
        } else {
          payload.ghwSubscription = "onetime";
        }
        console.log("payload: ", payload);

        setAddToCartInProgress(true);
        onAddToCart({ payload, onNotOk, onComplete });
      } else {
        action("notify", {
          level: "error",
          message: t(alertTotalItemQuantityExceeded, {
            stockAvailable: maxQtyAllowed,
            itemQuantityInCart: itemQtyInCart,
          }),
        });
      }
    }
  };

  return (
    <Styled id="AddToCartButton" css={css}>
      <div className="AddToCartButton__Wrapper">
        <form onSubmit={handleAddToCart}>
          <input
            type="hidden"
            name="productId"
            value={productId ? productId : ""}
          />
          <input type="hidden" name="catRefId" value={skuId ? skuId : ""} />
          <input type="hidden" name="quantity" value={qty} />
          <button
            data-testid="Add-To-Cart-Button"
            type="submit"
            disabled={isAddToCartButtonDisabled()}
          >
            {getAddToCartButtonText()}
          </button>
        </form>
      </div>
    </Styled>
  );
};

AddToCartButton.propTypes = {
  /*
   * Function to be invoked on add to cart trigger.
   */
  onAddToCart: PropTypes.func.isRequired,
};

export default React.memo(AddToCartButton);
