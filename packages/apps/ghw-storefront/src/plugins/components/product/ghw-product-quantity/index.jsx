import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useContext, useCallback, useEffect, useState} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {t, isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {getTotalItemQuantityFromOtherSGs} from '@oracle-cx-commerce/react-components/utils/cart';
import {usePrevious} from '@oracle-cx-commerce/react-components/utils/hooks';
import Quantity from './component/quantity';
import {useComponentData} from './selectors';
import css from './styles.css';

//constants
const ZERO_QTY = 0;

/**
 * Product Quantity widget
 */
const GHWProductQuantity = props => {
  // contexts
  const {action, getState} = useContext(StoreContext);
  const [validationMsg, setValidationMsg] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isStockLoading, setStockLoading] = useState(false);

  //resources
  const {labelProductQuantity, textMaxOrderQtyExceeded, textMinOrderQtyRequired, alertTotalItemQuantityExceeded} =
    props;

  // selectors
  const {
    shippingGroups,
    selectedStore,
    isPickupInStoreOptionSelected,
    skuId,
    orderableQuantity,
    orderLimit,
    previousQty = 1,
    productId,
    setSelections,
    skuInventory
  } = useComponentData(getState());

  //Storing previous skuId and resetting quantity to 1 when the skuId changes
  const previousSkuId = usePrevious(skuId);
  useEffect(() => {
    if (previousSkuId && previousSkuId !== skuId) {
      setQuantity(1);
    }
  }, [previousSkuId, skuId]);

  /**
   * Validates the quantity and updates the context.
   * @param  {Number} parsedQty
   */
  const validateAndNotifyQtyUpdate = useCallback(
    parsedQty => {
      if (skuId && !isStockLoading) {
        let validationText = null;
        const qtyAvailable = orderableQuantity && orderableQuantity > ZERO_QTY ? orderableQuantity : 1;
        const maxQtyAllowed = orderLimit && orderLimit < qtyAvailable ? orderLimit : qtyAvailable;
        const itemQtyInCart = getTotalItemQuantityFromOtherSGs({
          skuId,
          selectedStore,
          isPickupInStoreOptionSelected,
          shippingGroups
        });
        let qtyToUpdate = ZERO_QTY;
        if (parsedQty <= 0) {
          validationText = t(textMinOrderQtyRequired, {quantity: 1});
        } else if (parsedQty > maxQtyAllowed) {
          validationText = t(textMaxOrderQtyExceeded, {quantity: maxQtyAllowed});
        } else if (parsedQty + itemQtyInCart > maxQtyAllowed) {
          validationText = t(alertTotalItemQuantityExceeded, {
            stockAvailable: maxQtyAllowed,
            itemQuantityInCart: itemQtyInCart
          });
        } else {
          qtyToUpdate = parsedQty;
        }
        // update Quantity only when it is changed
        if (previousQty !== qtyToUpdate) {
          setSelections(prevState => {
            return {
              ...prevState,
              qty: qtyToUpdate
            };
          });
        }
        if (validationMsg !== validationText) {
          setValidationMsg(validationText);
        }
      }
    },
    [
      alertTotalItemQuantityExceeded,
      isPickupInStoreOptionSelected,
      isStockLoading,
      orderLimit,
      orderableQuantity,
      previousQty,
      selectedStore,
      setSelections,
      shippingGroups,
      skuId,
      textMaxOrderQtyExceeded,
      textMinOrderQtyRequired,
      validationMsg
    ]
  );

  /**
   * Handler for quantity changed
   * @param  {Event} event
   */
  const handleQuantityChanged = useCallback(
    parsedQty => {
      setQuantity(parsedQty);
      setSelections(prevState => {
        return {
          ...prevState,
          selectedQuantity: parsedQty
        };
      });
      if (isEmptyObject(skuInventory)) {
        // Fetches stock status for sku if not available in store
        setStockLoading(true);
        action('getStockStatus', {
          products: [`${productId}:${skuId}`],
          actualStockStatus: true
        }).then(response => {
          if (response.ok === true) {
            setStockLoading(false);
          }
        });
      } else {
        validateAndNotifyQtyUpdate(parsedQty);
      }
    },
    [action, productId, setSelections, skuId, skuInventory, validateAndNotifyQtyUpdate]
  );

  useEffect(() => {
    validateAndNotifyQtyUpdate(quantity);
  }, [quantity, validateAndNotifyQtyUpdate]);

  return (
    <Styled id="GHWProductQuantity" css={css}>
      <div className="GHWProductQuantity__Wrapper">
        <Quantity
          label={labelProductQuantity}
          id={`GHWProductQuantity-${productId}`}
          name={`GHWProductQuantity-${productId}`}
          data-testid={`GHWProductQuantity-${productId}`}
          disabled={!skuId}
          handleQuantityChanged={handleQuantityChanged}
          className="GHWProductQuantity"
          value={quantity}
        />
        <div className="validationMsgContainer">
          {validationMsg &&
            skuId &&
            (isPickupInStoreOptionSelected === false ||
              (isPickupInStoreOptionSelected === true && selectedStore.locationId)) && (
              <span className="validationMsg" aria-label={validationMsg} role="alert" aria-live="assertive">
                {validationMsg}
              </span>
            )}
        </div>
      </div>
    </Styled>
  );
};

export default GHWProductQuantity;
