/* eslint-disable react-hooks/exhaustive-deps */
/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

/* eslint max-lines: ['error', {max: 1000, skipBlankLines: true, skipComments: true}] */
import {CartItemContext, ContainerContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {debounce, t, isEmptyObject, noop} from '@oracle-cx-commerce/utils/generic';
import {getCurrentOrder} from '@oracle-cx-commerce/commerce-utils/selector';
import {getLocationBasedItemQtyFromSGs} from '@oracle-cx-commerce/react-widgets/product/product-delivery-options/utils';
import Styled from '@oracle-cx-commerce/react-components/styled';
import Wishlist from '@oracle-cx-commerce/react-components/icons/wish-list';
import {useNumberFormatter, useDateFormatter} from '@oracle-cx-commerce/react-components/utils/hooks';
import {useCartItemErrorMessage, useGetCartItemSiteInfo} from '@oracle-cx-commerce/react-components/utils/cart/hooks';
import {IN_STOCK, PREORDERABLE, BACKORDERABLE, OUT_OF_STOCK} from '@oracle-cx-commerce/commerce-utils/constants/cart';
import {
  setInvalidItemsQtyAndErrorMessage,
  removeCurrentItemFromInvalidItems,
  updateInvalidCommerceItemsQty
} from '@oracle-cx-commerce/react-components/utils/cart';
import {
  SHIPPING_GROUP_HARDGOOD,
  SHIPPING_GROUP_IN_STORE_PICKUP
} from '@oracle-cx-commerce/commerce-utils/constants/shipping';
import TimesIcon from '@oracle-cx-commerce/react-components/icons/times';
import CheckIcon from '@oracle-cx-commerce/react-components/icons/check';
import Link from '@oracle-cx-commerce/react-components/link';
import {ORDER_STATE_QUOTED} from '@oracle-cx-commerce/commerce-utils/constants';
import css from './styles.css';
import Dropdown from '../mini-dropdown';

/**
 * It displays validation error message for each cart item.
 */
export const CartItemUpdateError = props => {
  // context
  const {
    errorMessage,
    setErrorMessage = noop,
    shippingGroupId,
    shippingGroupCommerceItem = {},
    skuInventory,
    itemLocation,
    quantity
  } = useContext(CartItemContext);
  const {
    currentOrder = {},
    invalidItemsOnQuantityChange = {},
    messageInsufficientStock,
    messageInsufficientStockAtStore,
    messagePartialPreOrder,
    messagePartialBackOrder,
    messageItemNoLongerAvailable
  } = props;
  const {shippingGroups = {}} = currentOrder;
  console.log('currentOrder --3-- ', currentOrder);

  useCartItemErrorMessage({
    setErrorMessage,
    invalidItemsOnQuantityChange,
    shippingGroups,
    shippingGroupId,
    shippingGroupCommerceItem,
    skuInventory,
    itemLocation,
    quantity,
    messageInsufficientStock,
    messageInsufficientStockAtStore,
    messagePartialPreOrder,
    messagePartialBackOrder,
    messageItemNoLongerAvailable
  });

  return (
    errorMessage && (
      <Styled id="GHWCartItemUpdateError" css={css}>
        <div className="GHWCartItemUpdateError">{errorMessage}</div>
      </Styled>
    )
  );
};

/**
 * It displays wish list link.
 * @param {*} props
 */
export const CartItemAddToWishListLink = props => {
  const {actionMoveToWishList} = props;

  return (
    <Styled id="GHWCartItemAddToWishListLink" css={css}>
      <div className="GHWCartItemAddToWishListLink">
        <Wishlist />
        <button type="button" className="GHWCartItemAddToWishListLink__WishlistText">
          {actionMoveToWishList}
        </button>
      </div>
    </Styled>
  );
};

/**
 * It displays remove item link for each cart item and invokes action to delete cart item.
 *
 * @param {*} props
 */
export const CartItemRemoveLink = props => {
  // resources.
  const {currentOrder, setInvalidItemsOnQuantityChange = noop} = props;
  const {shippingGroups} = currentOrder;

  /* Store Context */
  const store = useContext(StoreContext);
  const {action} = store;

  // shopping cart commerce line item
  const {
    commerceItem,
    skuInventory = {},
    setErrorMessage = noop,
    setInvalidItems = noop,
    shippingGroupId,
    triggerRemoveItem
  } = useContext(CartItemContext);

  /** Container Context Data */
  const {setSelections = noop} = useContext(ContainerContext) || {};
  const defaultSkuInventory = skuInventory['default'] || {};

  /**
   * Call back method to handle when an action response is a failure.
   */
  const onNotOk = useCallback(
    ({error = {}}) => {
      action('notify', {level: 'error', message: error.message});
    },
    [action]
  );

  const removeItem = useCallback(
    itemId => {
      const payload = {
        commerceItemId: itemId
      };
      let numberOfSGsWithSelectedItem = 0;
      Object.keys(shippingGroups).forEach(function (shippingGroupId) {
        shippingGroups[shippingGroupId].items.forEach(function (item) {
          if (
            item.catRefId === commerceItem.catRefId &&
            (shippingGroups[shippingGroupId].type === SHIPPING_GROUP_HARDGOOD ||
              shippingGroups[shippingGroupId].type === SHIPPING_GROUP_IN_STORE_PICKUP)
          ) {
            numberOfSGsWithSelectedItem++;
          }
        });
      });
      if (Object.keys(shippingGroups).length === 1 || numberOfSGsWithSelectedItem === 1) {
        action('deleteItemFromCart', payload).then(response => {
          if (!response.ok) {
            onNotOk(response);
          } else {
            const latestCommerceItems = getCurrentOrder(store.getState()).commerceItems;
            if (Object.keys(latestCommerceItems).length > 0) {
              removeCurrentItemFromInvalidItems({
                shippingGroupId,
                commerceId: itemId,
                setInvalidItems,
                setInvalidItemsOnQuantityChange
              });
            }
          }
        });
      } else {
        const newRelationship = {
          quantity: 0,
          commerceItemId: itemId,
          shippingGroupId,
          updateItemQuantity: true
        };

        const relationships = [];
        relationships.push(newRelationship);
        const payload = {relationships};
        action('relateShippingGroupsToCartItems', payload).then(response => {
          if (!response.ok) {
            onNotOk(response);
          } else {
            const latestCommerceItems = getCurrentOrder(store.getState()).commerceItems;
            if (Object.keys(latestCommerceItems).length > 0) {
              removeCurrentItemFromInvalidItems({
                shippingGroupId,
                commerceId: itemId,
                setInvalidItems,
                setInvalidItemsOnQuantityChange
              });
              updateInvalidCommerceItemsQty({
                relationships: [],
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
            }
          }
        });
      }
    },
    [
      shippingGroups,
      commerceItem.catRefId,
      commerceItem.id,
      action,
      onNotOk,
      store,
      shippingGroupId,
      setInvalidItems,
      setInvalidItemsOnQuantityChange,
      setSelections,
      currentOrder,
      defaultSkuInventory,
      setErrorMessage
    ]
  );

  useEffect(() => {
    if (triggerRemoveItem) {
      removeItem(commerceItem.id);
    }
  }, [commerceItem.id, removeItem, triggerRemoveItem]);

  return (
    <Styled id="CartItemRemoveLink" css={css}>
      <div className="GHWCartItemRemoveLink">
        <button
          type="button"
          onClick={() => {
            removeItem(commerceItem.id);
          }}
          className="link"
          onKeyDown={event => {
            if (event.key === 'Enter') removeItem(commerceItem.id);
          }}
        >
          remove
        </button>
      </div>
    </Styled>
  );
};

/**
 * It displays Quantity of commerce items in shopping cart. The quantity can be updated based on the property.
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

  const {orderableQuantity} = skuInventory[itemLocation] || {};

  /** Container Context Data */
  const {selections = {}, setSelections = noop} = useContext(ContainerContext) || {};

  const [showInput, setShowInput] = useState(false);
  const updateQuantityInput = useRef(null);
  const qtyValidationErrorMsg = useRef('');

  const DROP_DOWN_QTY_MAX = 10;

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
  const updateQuantity = useCallback(
    (event, item) => {
      const quantity = parseInt(event.target.value, 10);

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

      if (event && event.target && item && quantity !== '' && checkValidation(totalQuantity, item)) {
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
    [
      action,
      checkValidation,
      commerceItem.id,
      isSplitShipping,
      itemLocation,
      onNotOk,
      selections,
      setErrorMessage,
      setInvalidItemsOnQuantityChange,
      isRelationshipTypeShippingQuantityFound,
      setInvalidItems,
      setSelections,
      shippingGroupId,
      shippingGroups,
      skuInventory,
      store
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

  //TODO: PDP Quantity widget logic should be handled, this can be remove once it is integrated with PDP quantity widget
  const showInputAndSetFocus = () => {
    setShowInput(true);
    setTimeout(() => {
      if (updateQuantityInput && updateQuantityInput.current) updateQuantityInput.current.focus();
    }, 0);
  };

  //TODO: PDP Quantity widget logic should be handled, this can be remove once it is integrated with PDP quantity widget
  const onQuantityChange = useCallback(
    event => {
      event.target.value === '10+'
        ? showInputAndSetFocus()
        : debounce(updateQuantity, 2000)(event, shippingGroupCommerceItem);
    },
    [shippingGroupCommerceItem, updateQuantity]
  );

  // widget will return null if the item is GWP
  if (commerceItem.giftWithPurchaseCommerceItemMarkers && commerceItem.giftWithPurchaseCommerceItemMarkers.length > 0) {
    return null;
  }

  const SELECT_OPTIONS = (() => {
    const options = [];
    const maxValueAllowedForQtyDropDown = orderableQuantity < DROP_DOWN_QTY_MAX ? orderableQuantity : DROP_DOWN_QTY_MAX;
    for (let count = 1; count < maxValueAllowedForQtyDropDown; count++) {
      options.push(
        <option key={count} value={count}>
          {count}
        </option>
      );
    }
    if (maxValueAllowedForQtyDropDown === DROP_DOWN_QTY_MAX) {
      options.push(
        <option key={DROP_DOWN_QTY_MAX} value={`${DROP_DOWN_QTY_MAX}+`}>
          {DROP_DOWN_QTY_MAX} +
        </option>
      );
    } else {
      options.push(
        <option key={maxValueAllowedForQtyDropDown} value={maxValueAllowedForQtyDropDown}>
          {maxValueAllowedForQtyDropDown}
        </option>
      );
    }

    return options;
  })();

  //TODO: PDP Quantity widget logic should be reused.
  return (
    <Styled id="GHWCartItemQuantityDisplayAndUpdate" css={css}>
      <div key={`${shippingGroupId + commerceItem.id}-${shippingGroupCommerceItem.quantity}`}>
        {!(showInput || shippingGroupCommerceItem.quantity >= 10) ? (
          <Dropdown
            disabled={state === ORDER_STATE_QUOTED ? true : false}
            defaultValue={shippingGroupCommerceItem.quantity}
            aria-label={labelProductQuantity}
            onChange={onQuantityChange}
            id={shippingGroupId + commerceItem.id}
            dataTestId={shippingGroupId + commerceItem.id}
            className={`GHWCartItemQuantityDisplayAndUpdate ${
              errorMessage !== '' ? 'GHWCartItemQuantityDisplayAndUpdateError' : ''
            }
          `}
          >
            {SELECT_OPTIONS}
          </Dropdown>
        ) : (
          <input
            disabled={state === ORDER_STATE_QUOTED ? true : false}
            type="text"
            max="999"
            min="1"
            ref={updateQuantityInput}
            defaultValue={shippingGroupCommerceItem.quantity}
            onChange={event => debounce(updateQuantity, 2000)(event, shippingGroupCommerceItem)}
            onInput={maxLengthCheck}
            aria-label={labelProductQuantity}
            className={`GHWCartItemQuantityDisplayAndUpdate ${
              errorMessage !== '' ? 'GHWCartItemQuantityDisplayAndUpdateError' : ''
            }
          `}
          />
        )}
      </div>
    </Styled>
  );
};

/**
 * It displays each cart item shipping surcharge if it exists.
 *
 * @param {*} props
 */
export const CartItemSurcharge = props => {
  // resources
  const {shippingSurchargeText} = props;
  const formatCurrency = useNumberFormatter({style: 'currency'}, props.priceListGroup);
  const {shippingGroupCommerceItem = {}} = useContext(CartItemContext);

  const surcharge = shippingGroupCommerceItem.shippingSurchargeValue;

  return (
    <Styled id="CartItemSurcharge" css={css}>
      {surcharge && surcharge > 0 ? (
        <div className="CartItemSurcharge">{t(shippingSurchargeText, {price: formatCurrency(surcharge)})}</div>
      ) : (
        ''
      )}
    </Styled>
  );
};

/**
 * It displays each applied promotion information of cart item.
 */
export const CartItemPromotion = () => {
  //context
  const {shippingGroupCommerceItem} = useContext(CartItemContext);

  return (
    <Styled id="CartItemPromotion">
      {shippingGroupCommerceItem.discountInfo &&
        shippingGroupCommerceItem.discountInfo.map(discoutInfo => (
          <div className="CartItemPromotion" key={discoutInfo.promotionDesc}>
            {discoutInfo.promotionDesc}
          </div>
        ))}
    </Styled>
  );
};

/**
 * It displays stock status of cart item based on the inventory data
 */
export const CartItemStockStatus = props => {
  //context
  const {skuInventory = {}, itemLocation} = useContext(CartItemContext);
  const formatDate = useDateFormatter();
  const cartItemInventory = skuInventory[itemLocation] || {};

  const stockStatusData = {
    IN_STOCK: {
      className: 'CartItemStockStatus__InStock',
      message: props.textInStock,
      icon: CheckIcon
    },
    PREORDERABLE: {
      className: 'CartItemStockStatus__PreOrderable',
      message: cartItemInventory.availabilityDate
        ? t(props.messageStatusPreOrder, {
            AVAILABLEDATE: cartItemInventory.availabilityDate
              ? formatDate(new Date(cartItemInventory.availabilityDate))
              : ''
          })
        : ''
    },
    BACKORDERABLE: {
      className: 'CartItemStockStatus__BackOrderable',
      message: cartItemInventory.availabilityDate
        ? t(props.messageStatusBackOrder, {
            AVAILABLEDATE: cartItemInventory.availabilityDate
              ? formatDate(new Date(cartItemInventory.availabilityDate))
              : ''
          })
        : ''
    },
    OUT_OF_STOCK: {
      className: 'CartItemStockStatus__OutOfStock',
      message: props.textOutOfStock,
      icon: TimesIcon
    }
  };

  const defaultStatusValue = {
    className: '',
    message: ''
  };

  const currentStatuObject = stockStatusData[cartItemInventory.stockStatus] || defaultStatusValue;

  const getIcon = Icon => {
    return <Icon></Icon>;
  };

  return (
    <Styled id="CartItemStockStatus">
      {cartItemInventory && cartItemInventory.stockStatus && (
        <div className={`CartItemStockStatus ${currentStatuObject.className}`}>
          {currentStatuObject.icon && getIcon(currentStatuObject.icon)}
          <span>{currentStatuObject.message}</span>
        </div>
      )}
    </Styled>
  );
};

/**
 * It displays site information for the cart item in case of shared cart.
 */
export const CartItemSiteInformation = props => {
  //resources
  const {textSiteIcon} = props;
  const {siteName, favicon} = useGetCartItemSiteInfo();
  const {pdpUrl} = useContext(CartItemContext);

  return (
    <Styled id="CartItemSiteInformation" css={css}>
      <div className="CartItemSiteInformation">
        <Link href={pdpUrl}>
          <img className="CartItemSiteInformation__Image" src={favicon} alt={textSiteIcon} />
          <span className="CartItemSiteInformation__Text">{siteName}</span>
        </Link>
      </div>
    </Styled>
  );
};
