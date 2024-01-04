/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  CartItemContext,
  ProductSelectionContext,
  StoreContext,
  ContainerContext
} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useMemo, useState, useContext, useRef, useCallback} from 'react';

import Styled from '@oracle-cx-commerce/react-components/styled';
import {useCartItemState} from '@oracle-cx-commerce/react-components/utils/cart/hooks';
import {ORDER_STATE_QUOTED} from '@oracle-cx-commerce/commerce-utils/constants';
import CartAddOnItems from '@oracle-cx-commerce/react-widgets/cart/cart-item-details/components/cart-add-on-items';
import {debounce, t, isEmptyObject, noop} from '@oracle-cx-commerce/utils/generic';
import {IN_STOCK, PREORDERABLE, BACKORDERABLE, OUT_OF_STOCK} from '@oracle-cx-commerce/commerce-utils/constants/cart';
import {getLocationBasedItemQtyFromSGs} from '@oracle-cx-commerce/react-widgets/product/product-delivery-options/utils';
import {
  SHIPPING_GROUP_HARDGOOD,
  SHIPPING_GROUP_IN_STORE_PICKUP
} from '@oracle-cx-commerce/commerce-utils/constants/shipping';
import {
  setInvalidItemsQtyAndErrorMessage,
  removeCurrentItemFromInvalidItems,
  updateInvalidCommerceItemsQty
} from '@oracle-cx-commerce/react-components/utils/cart';
import {getCurrentOrder} from '@oracle-cx-commerce/commerce-utils/selector';
import Minus from '@oracle-cx-commerce/react-components/icons/minus';
import Plus from '@oracle-cx-commerce/react-components/icons/plus';
import css from './ghw-mini-cart-item.css';
import {
  CommerceItemName,
  CommerceItemTotalPrice,
  CommerceItemQty,
  CommerceItemImage,
  GetSizeAndFreqDetails,
  CommerceItemPrice,
  CommerceItemPriceGroup
} from '../mini-commerce-item-components';
import {CartItemRemoveLink} from '../ghw-min-cart-line-item';

/**
 * It display each cart item in shopping cart based on the current viewport.
 *
 * @param {*} props
 */

export const CartItemQuantityDisplayAndUpdate = props => {
  // resources.
  const {
    messageInsufficientStock,
    messageInsufficientStockAtStore,
    messageItemNoLongerAvailable,
    messageQuantityManditory,
    labelProductQuantity,
    messagePartialBackOrder,
    messagePartialPreOrder,
    currentOrder: {shippingGroups, state},
    setInvalidItemsOnQuantityChange = noop,
    isSplitShipping = false
  } = props;

  /* Store Context */
  const store = useContext(StoreContext);
  const {action} = store;
  const {
    shippingGroupCommerceItem,
    shippingGroupId,
    setErrorMessage,
    setQuantity = noop,
    errorMessage,
    commerceItem = {},
    skuInventory = {},
    setInvalidItems,
    itemLocation
  } = useContext(CartItemContext);
  console.log('cart---> ', useContext(CartItemContext));
  const [itemQty, setItemQty] = useState(parseInt(shippingGroupCommerceItem.quantity, 10));

  /** Container Context Data */
  const {selections = {}, setSelections = noop} = useContext(ContainerContext) || {};

  const updateQuantityInput = useRef(null);
  const qtyValidationErrorMsg = useRef('');

  /**
   * Call back method to handle when an action response is a failure.
   */
  const onNotOk = useCallback(
    ({error = {}}) => {
      action('notify', {level: 'error', message: error.message});
    },
    [action]
  );

  // checks if the entered quantity is valid and sets error message accordingly
  // returns : boolean : true if quantity satisfy the stock status else false
  const checkValidation = useCallback(
    quantity => {
      if (quantity > 0) {
        // Reset error message when quantity got updated
        // setErrorMessage('');
        setQuantity(quantity);
        let temporaryItemLocation = itemLocation;
        if (isSplitShipping && selections && !selections.isPickupInStoreOptionSelected) {
          temporaryItemLocation = 'default';
        }
        const cartItem = skuInventory[temporaryItemLocation] || {};

        if (
          cartItem.stockStatus === IN_STOCK ||
          cartItem.stockStatus === PREORDERABLE ||
          cartItem.stockStatus === BACKORDERABLE
        ) {
          if (quantity <= cartItem.orderableQuantity) {
            if (cartItem.inStockQuantity > 0 && quantity < cartItem.inStockQuantity) {
              setErrorMessage('');
            } else if (cartItem.inStockQuantity > 0 && quantity > cartItem.inStockQuantity) {
              if (cartItem.backOrderableQuantity > 0) {
                setErrorMessage(t(messagePartialBackOrder, {MAXQUANTITY: cartItem.inStockQuantity}));
                qtyValidationErrorMsg.current = t(messagePartialBackOrder, {MAXQUANTITY: cartItem.inStockQuantity});
              } else if (cartItem.preOrderableQuantity > 0) {
                setErrorMessage(t(messagePartialPreOrder, {MAXQUANTITY: cartItem.inStockQuantity}));
                qtyValidationErrorMsg.current = t(messagePartialPreOrder, {MAXQUANTITY: cartItem.inStockQuantity});
              }
            }

            return true;
          }
          if (temporaryItemLocation === 'default') {
            setErrorMessage(t(messageInsufficientStock, {MAXQUANTITY: cartItem.inStockQuantity}));
            qtyValidationErrorMsg.current = t(messageInsufficientStock, {MAXQUANTITY: cartItem.inStockQuantity});
          } else {
            setErrorMessage(t(messageInsufficientStockAtStore, {MAXQUANTITY: cartItem.inStockQuantity}));
            qtyValidationErrorMsg.current = t(messageInsufficientStockAtStore, {MAXQUANTITY: cartItem.inStockQuantity});
          }

          return false;
        }
        if (cartItem.stockStatus === OUT_OF_STOCK) {
          setErrorMessage(t(messageItemNoLongerAvailable));
          qtyValidationErrorMsg.current = t(messageItemNoLongerAvailable);
        } else if (isEmptyObject(cartItem)) {
          return true;
        }
      } else if (quantity === '' || quantity === 0 || isNaN(quantity)) {
        setErrorMessage(messageQuantityManditory);
        qtyValidationErrorMsg.current = t(messageQuantityManditory);
      }

      return false;
    },
    [
      isSplitShipping,
      itemLocation,
      messageInsufficientStock,
      messageInsufficientStockAtStore,
      messageItemNoLongerAvailable,
      messagePartialBackOrder,
      messagePartialPreOrder,
      messageQuantityManditory,
      selections,
      setErrorMessage,
      setQuantity,
      skuInventory
    ]
  );

  /* It returns whether an item has relationshipType as SHIPPINGQUANTITY
  If found, it means there is some change happened to the SGs */
  const isRelationshipTypeShippingQuantityFound = useCallback(() => {
    return shippingGroups[shippingGroupId]['items'].find(item => item.relationshipType === 'SHIPPINGQUANTITY');
  }, [shippingGroups, shippingGroupId]);

  // It handle quantity change event and triggers update cart item action
  // const updateQuantity = useCallback(
  //   (event, data) => {
  //     // const quantity = parseInt(event.target.value, 10);
  //     const {val, shippingGroupCommerceItem, eventType} = data;
  //     const item = shippingGroupCommerceItem;
  //     const quantity = val;

  //     let totalQuantity = quantity;
  //     if (isSplitShipping) {
  //       let invalidItemsOnQuantityChange = {};
  //       const itemRef = `${shippingGroupId}${item.commerceId}`;
  //       //Take All Invalid Items into a local variable.

  //       setInvalidItemsOnQuantityChange(prevInvalidItemsOnQuantityChangeState => {
  //         const prevInvalidQuantityItemsNewState =
  //           prevInvalidItemsOnQuantityChangeState && prevInvalidItemsOnQuantityChangeState.invalidItemsQtyAndErrorMsg
  //             ? {...prevInvalidItemsOnQuantityChangeState.invalidItemsQtyAndErrorMsg}
  //             : {};
  //         delete prevInvalidQuantityItemsNewState[itemRef];

  //         invalidItemsOnQuantityChange =
  //           prevInvalidItemsOnQuantityChangeState && prevInvalidItemsOnQuantityChangeState.invalidItemsQtyAndErrorMsg
  //             ? {...prevInvalidItemsOnQuantityChangeState.invalidItemsQtyAndErrorMsg}
  //             : {};
  //         delete invalidItemsOnQuantityChange[itemRef];

  //         return {
  //           ...prevInvalidItemsOnQuantityChangeState,
  //           invalidItemsQtyAndErrorMsg: {...prevInvalidQuantityItemsNewState}
  //         };
  //       });

  //       setInvalidItems(prevState => {
  //         let itemRefArrayNewState = prevState && prevState.length > 0 ? [...prevState] : [];
  //         itemRefArrayNewState = itemRefArrayNewState.filter(value => {
  //           return value !== itemRef;
  //         });

  //         return [...itemRefArrayNewState];
  //       });

  //       // For multi-shipping case: when item is split in multiple-shipping-groups,
  //       // total item quantity should be validated
  //       totalQuantity =
  //         quantity +
  //         getLocationBasedItemQtyFromSGs({
  //           locationId: itemLocation,
  //           shippingGroups,
  //           skuId: item.catRefId,
  //           shippingGroupId,
  //           isSplitShipping,
  //           invalidItemsOnQuantityChange
  //         });
  //       // Temporarily store selected quantity value in selections object for validation purpose.
  //       setSelections(prevState => {
  //         return {
  //           ...prevState,
  //           selectedQuantity: quantity,
  //           isQuantityValidated: true
  //         };
  //       });
  //     }

  //     if (event && event.target && item && quantity !== '' && checkValidation(totalQuantity, item)) {
  //       // call update cart
  //       const payload = {
  //         commerceItemId: item.commerceId,
  //         quantity
  //       };

  //       //if number of SGs is one then invoke updateCartItem action else invoke relateShippingGroupsToCartItems action.
  //       if (
  //         Object.keys(shippingGroups).length === 1 &&
  //         !isRelationshipTypeShippingQuantityFound() &&
  //         shippingGroups[shippingGroupId].type === SHIPPING_GROUP_HARDGOOD
  //       ) {
  //         action('updateCartItem', payload).then(response => {
  //           if (!response.ok && response.error) {
  //             setErrorMessage(response.error.message);
  //           } else {
  //             removeCurrentItemFromInvalidItems({
  //               shippingGroupId,
  //               commerceId: commerceItem.id,
  //               setInvalidItems,
  //               setInvalidItemsOnQuantityChange
  //             });
  //             if (Object.keys(selections).length !== 0) {
  //               const {selectedStore = {}, isPickupInStoreOptionSelected = false} = selections;
  //               if (isPickupInStoreOptionSelected && !selectedStore.locationId) {
  //                 setInvalidItemsQtyAndErrorMessage({
  //                   setInvalidItems,
  //                   setInvalidItemsOnQuantityChange,
  //                   shippingGroupId,
  //                   commerceId: commerceItem.id,
  //                   quantity: 0
  //                 });
  //               }
  //             }
  //           }
  //         });
  //       } else {
  //         const newRelationship = {
  //           quantity,
  //           commerceItemId: item.commerceId,
  //           shippingGroupId,
  //           updateItemQuantity: true
  //         };

  //         const relationships = [];
  //         relationships.push(newRelationship);

  //         if (shippingGroups[shippingGroupId].type === SHIPPING_GROUP_IN_STORE_PICKUP) {
  //           const payload = {relationships};
  //           action('relateShippingGroupsToCartItems', payload).then(response => {
  //             if (!response.ok) {
  //               onNotOk(response);
  //             } else {
  //               setSelections(prevState => {
  //                 return {
  //                   ...prevState,
  //                   isPickupInStoreOptionSelected: true,
  //                   selectedStore: shippingGroups[shippingGroupId].store
  //                 };
  //               });
  //               removeCurrentItemFromInvalidItems({
  //                 shippingGroupId,
  //                 commerceId: item.commerceId,
  //                 setInvalidItems,
  //                 setInvalidItemsOnQuantityChange
  //               });
  //             }
  //           });
  //         }

  //         if (shippingGroups[shippingGroupId].type === SHIPPING_GROUP_HARDGOOD) {
  //           const defaultSkuInventory = skuInventory['default'] || {};
  //           //Pass current order object which has new shipping groups.
  //           const currentOrder = getCurrentOrder(store.getState());
  //           console.log('currentOrder --4-- ', currentOrder);
  //           //Now Check with same Commerce Item if any Invalid Quantity Object key exists in Invalid Items.
  //           updateInvalidCommerceItemsQty({
  //             relationships,
  //             setInvalidItems,
  //             commerceId: commerceItem.id,
  //             shippingGroupId,
  //             setSelections,
  //             currentOrder,
  //             totalQtyAvailable: defaultSkuInventory['orderableQuantity'],
  //             setErrorMessage,
  //             setInvalidItemsOnQuantityChange,
  //             action,
  //             onNotOk
  //           });
  //           setSelections(prevState => {
  //             return {
  //               ...prevState,
  //               isPickupInStoreOptionSelected: false,
  //               selectedStore: {}
  //             };
  //           });
  //           removeCurrentItemFromInvalidItems({
  //             shippingGroupId,
  //             commerceId: item.commerceId,
  //             setInvalidItems,
  //             setInvalidItemsOnQuantityChange
  //           });
  //         }
  //       }
  //     } else {
  //       setInvalidItemsQtyAndErrorMessage({
  //         setInvalidItems,
  //         setInvalidItemsOnQuantityChange,
  //         shippingGroupId,
  //         commerceId: commerceItem.id,
  //         quantity,
  //         errorMsg: qtyValidationErrorMsg.current
  //       });
  //       qtyValidationErrorMsg.current = '';
  //     }
  //   },
  //   [
  //     action,
  //     checkValidation,
  //     commerceItem.id,
  //     isSplitShipping,
  //     itemLocation,
  //     onNotOk,
  //     selections,
  //     setErrorMessage,
  //     setInvalidItemsOnQuantityChange,
  //     isRelationshipTypeShippingQuantityFound,
  //     setInvalidItems,
  //     setSelections,
  //     shippingGroupId,
  //     shippingGroups,
  //     skuInventory,
  //     store
  //   ]
  // );
  const updateQuantity = useCallback(
    (event, data) => {
      const {val, shippingGroupCommerceItem, eventType} = data;
      const item = shippingGroupCommerceItem;
      const quantity = val;

      // CXCDEV-987
      const ga4Items = [item];
      // CXCDEV-987

      let totalQuantity = quantity;
      if (isSplitShipping) {
        let invalidItemsOnQuantityChange = {};
        const itemRef = `${shippingGroupId}${item.commerceId}`;
        //Take All Invalid Items into a local variable.

        setInvalidItemsOnQuantityChange(prevInvalidItemsOnQuantityChangeState => {
          const prevInvalidQuantityItemsNewState =
            prevInvalidItemsOnQuantityChangeState && prevInvalidItemsOnQuantityChangeState.invalidItemsQtyAndErrorMsg
              ? {...prevInvalidItemsOnQuantityChangeState.invalidItemsQtyAndErrorMsg}
              : {};
          delete prevInvalidQuantityItemsNewState[itemRef];

          invalidItemsOnQuantityChange =
            prevInvalidItemsOnQuantityChangeState && prevInvalidItemsOnQuantityChangeState.invalidItemsQtyAndErrorMsg
              ? {...prevInvalidItemsOnQuantityChangeState.invalidItemsQtyAndErrorMsg}
              : {};
          delete invalidItemsOnQuantityChange[itemRef];

          return {
            ...prevInvalidItemsOnQuantityChangeState,
            invalidItemsQtyAndErrorMsg: {...prevInvalidQuantityItemsNewState}
          };
        });

        setInvalidItems(prevState => {
          let itemRefArrayNewState = prevState && prevState.length > 0 ? [...prevState] : [];
          itemRefArrayNewState = itemRefArrayNewState.filter(value => {
            return value !== itemRef;
          });

          return [...itemRefArrayNewState];
        });

        // For multi-shipping case: when item is split in multiple-shipping-groups,
        // total item quantity should be validated
        totalQuantity =
          quantity +
          getLocationBasedItemQtyFromSGs({
            locationId: itemLocation,
            shippingGroups,
            skuId: item.catRefId,
            shippingGroupId,
            isSplitShipping,
            invalidItemsOnQuantityChange
          });
        // Temporarily store selected quantity value in selections object for validation purpose.
        setSelections(prevState => {
          return {
            ...prevState,
            selectedQuantity: quantity,
            isQuantityValidated: true
          };
        });
      }

      // if (event && event.target && item && quantity !== '' && checkValidation(totalQuantity, item)) {
      if (item && quantity !== '' && checkValidation(totalQuantity, item)) {
        // call update cart
        const payload = {
          commerceItemId: item.commerceId,
          quantity
        };

        //if number of SGs is one then invoke updateCartItem action else invoke relateShippingGroupsToCartItems action.
        if (
          Object.keys(shippingGroups).length === 1 &&
          !isRelationshipTypeShippingQuantityFound() &&
          shippingGroups[shippingGroupId].type === SHIPPING_GROUP_HARDGOOD
        ) {
          action('updateCartItem', payload).then(response => {
            if (!response.ok && response.error) {
              setErrorMessage(response.error.message);
            } else {
              removeCurrentItemFromInvalidItems({
                shippingGroupId,
                commerceId: commerceItem.id,
                setInvalidItems,
                setInvalidItemsOnQuantityChange
              });
              if (Object.keys(selections).length !== 0) {
                const {selectedStore = {}, isPickupInStoreOptionSelected = false} = selections;
                if (isPickupInStoreOptionSelected && !selectedStore.locationId) {
                  setInvalidItemsQtyAndErrorMessage({
                    setInvalidItems,
                    setInvalidItemsOnQuantityChange,
                    shippingGroupId,
                    commerceId: commerceItem.id,
                    quantity: 0
                  });
                }
              }

              // Get extra properties from the state to pass to GA4
              const catalog = getCatalogRepository(state);
              const productsExtraData = Object.values(ga4Items).map(item => {
                const product = getProductBySKU(catalog, item.catRefId);

                return {
                  ...item,
                  sku: item.catRefId,
                  productId: hasValue(product) ? product?.id : '',
                  brand: hasValue(product) ? product.brand : '',
                  categories:
                    hasValue(categories) && hasValue(product) && hasValue(product?.parentCategories)
                      ? getCategoryNames(Object.values(categories), product.parentCategories)
                      : []
                };
              });
              // CXCDEV-987: add_to_cart and remove_from_cart GA4 events
              if (window && window.dataLayer) {
                if (eventType === 'add_to_cart') {
                  sendAddToCartEvent(window.dataLayer, productsExtraData, response, true);
                } else {
                  sendRemoveFromCartEvent(window.dataLayer, productsExtraData, commerceItems, true);
                }
              } else {
                console.warn('No dataLayer found on the site!');
              }
            }
          });
        } else {
          const newRelationship = {
            quantity,
            commerceItemId: item.commerceId,
            shippingGroupId,
            updateItemQuantity: true
          };

          const relationships = [];
          relationships.push(newRelationship);

          if (shippingGroups[shippingGroupId].type === SHIPPING_GROUP_IN_STORE_PICKUP) {
            const payload = {relationships};
            action('relateShippingGroupsToCartItems', payload).then(response => {
              if (!response.ok) {
                onNotOk(response);
              } else {
                setSelections(prevState => {
                  return {
                    ...prevState,
                    isPickupInStoreOptionSelected: true,
                    selectedStore: shippingGroups[shippingGroupId].store
                  };
                });
                removeCurrentItemFromInvalidItems({
                  shippingGroupId,
                  commerceId: item.commerceId,
                  setInvalidItems,
                  setInvalidItemsOnQuantityChange
                });
              }
            });
          }

          if (shippingGroups[shippingGroupId].type === SHIPPING_GROUP_HARDGOOD) {
            const defaultSkuInventory = skuInventory['default'] || {};
            //Pass current order object which has new shipping groups.
            const currentOrder = getCurrentOrder(store.getState());
            //Now Check with same Commerce Item if any Invalid Quantity Object key exists in Invalid Items.
            updateInvalidCommerceItemsQty({
              relationships,
              setInvalidItems,
              commerceId: commerceItem.id,
              shippingGroupId,
              setSelections,
              currentOrder,
              totalQtyAvailable: defaultSkuInventory['orderableQuantity'],
              setErrorMessage,
              setInvalidItemsOnQuantityChange,
              action,
              onNotOk
            });
            setSelections(prevState => {
              return {
                ...prevState,
                isPickupInStoreOptionSelected: false,
                selectedStore: {}
              };
            });
            removeCurrentItemFromInvalidItems({
              shippingGroupId,
              commerceId: item.commerceId,
              setInvalidItems,
              setInvalidItemsOnQuantityChange
            });
          }
        }
      } else {
        setInvalidItemsQtyAndErrorMessage({
          setInvalidItems,
          setInvalidItemsOnQuantityChange,
          shippingGroupId,
          commerceId: commerceItem.id,
          quantity,
          errorMsg: qtyValidationErrorMsg.current
        });
        qtyValidationErrorMsg.current = '';
      }
    },
    //eslint-disable-next-line
    [
      // action,
      // checkValidation,
      // commerceItem.id,
      // isSplitShipping,
      // itemLocation,
      // onNotOk,
      // selections,
      // setErrorMessage,
      // setInvalidItemsOnQuantityChange,
      // isRelationshipTypeShippingQuantityFound,
      // setInvalidItems,
      // setSelections,
      // shippingGroupId,
      // shippingGroups,
      // skuInventory,
      // store
    ]
  );

  /**
   * maxLength Check for number input
   * @param  {Event} event
   */
  const maxLengthCheck = event => {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/\D/g, '');
    if (inputValue && inputValue.length > 3) {
      event.target.value = inputValue.slice(0, 3);
    }
  };

  // widget will return null if the item is GWP
  if (commerceItem.giftWithPurchaseCommerceItemMarkers && commerceItem.giftWithPurchaseCommerceItemMarkers.length > 0) {
    return null;
  }

  const debouncedUpdateQuantity = useMemo(() => {
    // console.log('data-- ', data, data1);

    return debounce(updateQuantity, 250);
  }, [updateQuantity]);

  const getOrderLimit = () => {
    const cartItem = skuInventory[itemLocation] || {};
    if (cartItem.orderLimit !== undefined) {
      return cartItem.orderLimit;
    }

    return 99;
  };
  const orderableQuantity = getOrderLimit();

  const increaseItemQty = () => {
    const orderableQuantity = getOrderLimit();
    if (itemQty < orderableQuantity) {
      const val = itemQty + 1;
      setItemQty(val);
      // CXCDEV-987: Adding new "eventType" property to discriminate accordingly in order to send the correct GA4 Event
      debouncedUpdateQuantity(noop, {val, shippingGroupCommerceItem, eventType: 'add_to_cart'});
    }
  };

  const decreaseItemQty = () => {
    if (itemQty > 1) {
      const val = itemQty - 1;
      setItemQty(val);
      // CXCDEV-987: Adding new "eventType" property to discriminate accordingly in order to send the correct GA4 Event
      debouncedUpdateQuantity(noop, {val, shippingGroupCommerceItem, eventType: 'remove_from_cart'});
    }
  };

  //TODO: PDP Quantity widget logic should be reused.
  return (
    <Styled id="GHWCartItemQuantityDisplayAndUpdate" css={css}>
      <div key={`${shippingGroupId + commerceItem.id}-${shippingGroupCommerceItem.quantity}`} className="quantity-cnr">
        {/* <input
          disabled={state === ORDER_STATE_QUOTED ? true : false}
          type="text"
          max="999"
          min="1"
          ref={updateQuantityInput}
          defaultValue={shippingGroupCommerceItem.quantity}
          onChange={event => debounce(updateQuantity, 2000)(event, shippingGroupCommerceItem)}
          onInput={maxLengthCheck}
          aria-label={labelProductQuantity}
          className={`GHWMiniCartItem__QuantityDisplayAndUpdate ${
            errorMessage !== '' ? 'GHWCartItemQuantityDisplayAndUpdateError' : ''
          }
        `}
        /> */}
        <>
          <label htmlFor="">Qty </label>
          <div className="qty-btn-cnr">
            <button
              type="button"
              disabled={itemQty > 1 ? false : true}
              className="pill-btn qty-dec"
              onClick={event => decreaseItemQty(event, {id: shippingGroupId + commerceItem.id})}
            >
              −
            </button>
          </div>
          <div className="qty-value">{itemQty}</div>

          <div className="qty-btn-cnr">
            <button
              type="button"
              disabled={itemQty < orderableQuantity ? false : true}
              className="pill-btn qty-inc"
              onClick={event => increaseItemQty(event, {id: shippingGroupId + commerceItem.id})}
            >
              +
            </button>
          </div>
        </>
      </div>
    </Styled>
  );
};

const GHWMiniCartItemRow = props => {
  const {
    shippingGroupCommerceItem = {},
    commerceItem = {},
    shippingGroupId,
    showItemPrice,
    currentOrder: {shippingGroups, state},
    setInvalidItems,
    setInvalidItemsOnQuantityChange,
    messageInsufficientStock,
    messageInsufficientStockAtStore,
    pdpUrlNotRequired,
    showAddOnItems = true
  } = props;
  const [triggerRemoveItem, setTriggerRemoveItem] = useState(false);

  // const formatCurrency = useNumberFormatter({style: 'currency'}, props.priceListGroup);

  /**
   * Filtering add-on items from child items using "addOnItem" flag
   */
  const addOnItems = useMemo(() => {
    if (showAddOnItems && shippingGroupCommerceItem.childItems && shippingGroupCommerceItem.childItems.length > 0) {
      return shippingGroupCommerceItem.childItems.filter(item => item.addOnItem === true);
    }

    return [];
  }, [shippingGroupCommerceItem, showAddOnItems]);

  /**
   * Cart Item status from the custom hook - useCartItemState
   */
  const {cartItemDetails, isItemInValid} = useCartItemState({
    commerceItem,
    shippingGroupCommerceItem,
    shippingGroups,
    shippingGroupId,
    showItemPrice,
    pdpUrlNotRequired,
    setInvalidItems,
    setInvalidItemsOnQuantityChange,
    messageInsufficientStock,
    triggerRemoveItem,
    messageInsufficientStockAtStore
  });

  // Product selection context data
  const productSelection = {
    commerceItem,
    shippingGroups,
    shippingGroupId,
    setTriggerRemoveItem
  };
  const {productId = ''} = commerceItem;

  const getSavedPercentage = () => {
    const str = 'You Save 17%';
  };

  return (
    <Styled id="GHWMiniCartItemRow" css={css}>
      <CartItemContext.Provider value={cartItemDetails}>
        <ProductSelectionContext.Provider value={{productSelection}}>
          <div
            className={`GHWMiniCartItemRow ${
              isItemInValid || state === ORDER_STATE_QUOTED ? 'GHWMiniCartItem__Disable' : ''
            }`}
          >
            <div className="row-item-cnr">
              {/* <div className="GHWMiniCartItemRow__ItemDetails">
                {state !== ORDER_STATE_QUOTED && <CartItemRemoveLink {...props} />}
                <div className="GHWMiniCartItemRow__Item GHWMiniCartItemRow__PartNumber">{productId}</div>
                <div className="GHWMiniCartItemRow__Item GHWMiniCartItemRow__Description">
                  <CommerceItemName />
                </div>
                <div className="GHWCartItemRow__Item GHWCartItemRow__Quantity GHWCartItemRow__Quantity">
                  {commerceItem.giftWithPurchaseCommerceItemMarkers &&
                  commerceItem.giftWithPurchaseCommerceItemMarkers.length > 1 ? (
                    <CommerceItemQty />
                  ) : (
                    <CartItemQuantityDisplayAndUpdate {...props} />
                  )}
                </div>
                <div className="GHWMiniCartItemRow__Item GHWMiniCartItemRow__Total">
                  <CommerceItemTotalPrice textFree={props.textFree} />
                </div>
              </div> */}
              <section className="product" id="SECTION_1">
                <div id="DIV_2" className='product-img'>
                  <CommerceItemImage />
                </div>
                <div className="product-info" id="DIV_4">
                  <CommerceItemName />
                  <div id="P_6" className='meta-info'>
                    {' '}
                    <GetSizeAndFreqDetails />
                  </div>
                  <div className="product-quantity">
                  {commerceItem.giftWithPurchaseCommerceItemMarkers &&
                  commerceItem.giftWithPurchaseCommerceItemMarkers.length > 1 ? (
                    <CommerceItemQty />
                  ) : (
                    <CartItemQuantityDisplayAndUpdate {...props} />
                    )}
                    {/* <span class="separator">|</span> */}
                  <CartItemRemoveLink {...props} />
                </div>
                  {/* <CartItemRemoveLink {...props} /> */}
                </div>
                
                <div className="product-quantity">
                  <CommerceItemPriceGroup {...props} />
                  {/* <fieldset id="FIELDSET_12">
                    <legend id="LEGEND_13">Qty</legend>
                    <div id="DIV_14">1</div>
                    <div id="DIV_15">
                      <div className="arrow-top" id="DIV_16" />
                      <div className="arrow-down" id="DIV_17" />
                    </div>
                  </fieldset> */}
                </div>
              </section>
              {addOnItems.length > 0 && (
                <CartAddOnItems
                  {...props}
                  addOnItems={addOnItems}
                  isEditable={true}
                  isChildItem={false}
                ></CartAddOnItems>
              )}
              <div className="CartItemDetails__BOPIS"></div>
            </div>
          </div>
        </ProductSelectionContext.Provider>
      </CartItemContext.Provider>
    </Styled>
  );
};

export default React.memo(GHWMiniCartItemRow);
