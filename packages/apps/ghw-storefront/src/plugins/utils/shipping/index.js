/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {
  ORDER_STATE_QUOTED,
  SHIPPING_GROUP_HARDGOOD,
  SHIPPING_GROUP_IN_STORE_PICKUP
} from '@oracle-cx-commerce/commerce-utils/constants';
import {getCurrentOrder, getOrderShippingMethods} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject, isObject} from '@oracle-cx-commerce/utils/generic';
import {isAddressValid, getListShippingMethodsPayload} from '../address';

/**
 * Method to check if the shipping information for an order is complete or not
 * @param {Object} order an order object
 * @returns {boolean} true if the shipping information for an order is complete
 */
export const isShippingDetailsComplete = (order, isB2BUser) => {
  const {shippingGroups = {}} = order;

  if (!isObject(order) || isEmptyObject(order) || Object.keys(shippingGroups).length === 0) {
    return false;
  }

  for (const shippingGroup of Object.values(shippingGroups)) {
    if (shippingGroup.items.length === 0) {
      continue;
    }

    if (shippingGroup.type === SHIPPING_GROUP_HARDGOOD) {
      // for 'hardgoodShippingGroup', if the shipping address and the shipping method are not valid, then return false
      if (
        !isAddressValid(shippingGroup.shippingAddress, isB2BUser) ||
        !shippingGroup.shippingMethod.value ||
        shippingGroup.shippingMethod.value === SHIPPING_GROUP_HARDGOOD
      ) {
        return false;
      }
    } else if (shippingGroup.type === SHIPPING_GROUP_IN_STORE_PICKUP) {
      if (shippingGroup.store && !shippingGroup.store.locationId) {
        // for 'inStorePickupShippingGroup', if the location is not selected, then return false
        return false;
      }
    }
  }

  return true;
};

/**
 * Function to filter out all the shipping groups of type 'hardgoodShippingGroup'
 * @param {Object} shippingGroups list of shipping groups
 * @returns {Array} returns an array of shipping group of type 'hardgoodShippingGroup'
 */
export const getHardgoodShippingGroups = (shippingGroups = {}) => {
  const hardgoodShippingGroups = (Object.values(shippingGroups || {}) || []).filter(shippingGroup => {
    return shippingGroup.type === SHIPPING_GROUP_HARDGOOD;
  });

  return hardgoodShippingGroups;
};

/**
 * Function to filter out the shipping groups of type 'hardgoodShippingGroup' that has cart items
 * @param {Object} shippingGroups list of shipping groups
 * @returns {Array} returns an array of shipping group of type 'hardgoodShippingGroup'
 */
export const getHardgoodShippingGroupsWithItems = (shippingGroups = {}) => {
  const hardgoodShippingGroups = (Object.values(shippingGroups || {}) || []).filter(shippingGroup => {
    return shippingGroup.type === SHIPPING_GROUP_HARDGOOD && shippingGroup.items.length > 0;
  });

  return hardgoodShippingGroups;
};
/**
 * Function to filter out the shipping groups of type 'hardgoodShippingGroup' that has cart items
 * @param {Object} shippingGroups list of shipping groups
 * @returns {Array} returns an array of shipping group of type 'hardgoodShippingGroup'
 */
export const getInStorePickUpShippingGroupWithItems = (shippingGroups = {}) => {
  const inStorePickUpShippingGroups = (Object.values(shippingGroups || {}) || []).filter(shippingGroup => {
    return shippingGroup.type === SHIPPING_GROUP_IN_STORE_PICKUP && shippingGroup.items.length > 0;
  });

  return inStorePickUpShippingGroups;
};
/**
 * Function to filter out ids of shipping groups of type 'hardgoodShippingGroup'
 * @param {Object} shippingGroups list of shipping groups
 * @returns {Array} returns an array of ids
 */
export const getHardgoodShippingGroupIds = (shippingGroups = {}) => {
  const hardgoodShippingGroupIds = (Object.keys(shippingGroups || {}) || []).filter(shippingGroupId => {
    return (
      shippingGroups[shippingGroupId].type === SHIPPING_GROUP_HARDGOOD &&
      shippingGroups[shippingGroupId].items.length > 0
    );
  });

  return hardgoodShippingGroupIds;
};

/**
 * Function to delete the shipping group that doesn't have any commerce item
 * @param {Object} action the store action
 * @param {Object} shippingGroups list of shipping groups
 */
export const deleteEmptyShippingGroups = async (action, shippingGroups = {}) => {
  const emptyShippingGroups = (Object.keys(shippingGroups || {}) || []).filter(shippingGroupId => {
    return shippingGroups[shippingGroupId].items.length === 0;
  });

  let response = {ok: true};
  if (emptyShippingGroups.length > 0) {
    response = await action('deleteShippingGroupsFromCart', {shippingGroupIds: emptyShippingGroups});
  }

  return response;
};

/**
 * Function to relate the two shipping groups after a cart item is split to a new shipping group
 * Invokes the 'relateShippingGroupsToCartItems' action to update the quantities to correct values
 * @param {Object} action store action
 * @param {String} commerceId commerce item id
 * @param {String} currentShippingGroupId id of the shipping group from which the item is split
 * @param {Number} currentShippingGroupQuantity item quantity to be updated in the current shipping group after splitting
 * @param {String} newShippingGroupId shipping group id of the newly added SG
 * @param {Number} newShippingGroupQuantity item quantity for the newly create shipping group after splitting
 */
const splitItemRelateShippingGroups = async (
  action,
  {commerceId, currentShippingGroupId, currentShippingGroupQuantity, newShippingGroupId, newShippingGroupQuantity}
) => {
  const relationships = [
    {
      quantity: currentShippingGroupQuantity,
      shippingGroupId: currentShippingGroupId,
      commerceItemId: commerceId
    },
    {
      quantity: newShippingGroupQuantity,
      shippingGroupId: newShippingGroupId,
      commerceItemId: commerceId
    }
  ];
  const payload = {relationships};

  const response = await action('relateShippingGroupsToCartItems', payload);

  return response;
};

/**
 * Function to split an item to a new shipping group
 * @param {Object} store store context
 * @param {Object} shippingGroups shipping groups list
 * @param {String} commerceId commerce item id
 * @param {String} shippingGroupId id of the shipping group from which the item is split
 * @param {Number} currentShippingGroupQuantity item quantity to be updated in the current shipping group after splitting
 * @param {Number} newShippingGroupQuantity item quantity for the newly create shipping group after splitting
 * @param {Object} shippingAddress shipping address
 */
export const splitItemToNewShippingGroup = async (
  store,
  {
    shippingGroups = {},
    commerceId,
    shippingGroupId,
    currentShippingGroupQuantity,
    newShippingGroupQuantity,
    shippingAddress = {}
  }
) => {
  const {action} = store;
  const items = [];
  const shippingGroupItem = {};
  shippingGroupItem.type = SHIPPING_GROUP_HARDGOOD;
  if (!isEmptyObject(shippingAddress)) {
    shippingGroupItem.shippingAddress = shippingAddress;
  }
  items.push(shippingGroupItem);

  const payload = {};
  payload.items = items;

  let response = await action('addShippingGroupsToCart', payload);

  if (response.ok === true) {
    const latestOrder = getCurrentOrder(store.getState());
    // newly created shipping group
    const newShippingGroupId = Object.keys(latestOrder.shippingGroups).find(shippingGroupId => {
      return !(shippingGroupId in shippingGroups);
    });

    if (Object.keys(shippingGroups).length > 0) {
      response = await splitItemRelateShippingGroups(action, {
        commerceId,
        currentShippingGroupId: shippingGroupId,
        currentShippingGroupQuantity,
        newShippingGroupId,
        newShippingGroupQuantity
      });
    }
  }

  return response;
};

/**
 * Function to move all the cart items to the target shipping group.
 * On success of the 'relateShippingGroupsToCartItems' action, it deletes other shipping groups except the target shipping group
 * @param {Object} action store action
 * @param {Object} targetShippingGroup target shipping group
 * @param {Object} shippingGroups shipping groups list
 */
export const moveItemsToTargetShippingGroup = async (action, targetShippingGroup = {}, shippingGroups = {}) => {
  const relationsSet = new Set();
  const hardgoodCommerceItemsQtyMap = new Map();
  const shippingGroupsToBeDeleted = [];

  // Add the target shipping group items to the item->quantity map
  targetShippingGroup.items.forEach(item => {
    hardgoodCommerceItemsQtyMap.set(item.commerceId, {quantity: item.quantity});
  });

  Object.values(shippingGroups).forEach(shippingGroup => {
    if (shippingGroup.type === SHIPPING_GROUP_HARDGOOD) {
      if (shippingGroup.shippingGroupId !== targetShippingGroup.shippingGroupId) {
        shippingGroupsToBeDeleted.push(shippingGroup.shippingGroupId);

        shippingGroup.items.forEach(item => {
          // For each shipping group item,
          // update the existing item->quantity map if the item is already present, else add a new entry to the map
          if (hardgoodCommerceItemsQtyMap.has(item.commerceId)) {
            const existingCommerceItemCount = hardgoodCommerceItemsQtyMap.get(item.commerceId).quantity;
            hardgoodCommerceItemsQtyMap.set(item.commerceId, {
              quantity: existingCommerceItemCount + item.quantity
            });
          } else {
            hardgoodCommerceItemsQtyMap.set(item.commerceId, {quantity: item.quantity});
          }

          // Add to the relationSet payload for the shipping group commerceItem with the quantity 0
          const payload = {
            quantity: 0,
            shippingGroupId: shippingGroup.shippingGroupId,
            commerceItemId: item.commerceId,
            updateItemQuantity: true
          };
          relationsSet.add(payload);
        });
      }
    }
  });

  // Finally add the target shipping group relate items payload
  hardgoodCommerceItemsQtyMap.forEach((item, commerceId) => {
    const payload = {
      quantity: item.quantity,
      commerceItemId: commerceId,
      shippingGroupId: targetShippingGroup.shippingGroupId,
      updateItemQuantity: true
    };
    relationsSet.add(payload);
  });

  // Trigger the 'relateShippingGroupsToCartItems' action to update the shipping groups with correct quantities
  let response = await action('relateShippingGroupsToCartItems', {relationships: Array.from(relationsSet)});
  if (response.ok) {
    // Delete all the shipping groups except the target shipping group
    response = await action('deleteShippingGroupsFromCart', {shippingGroupIds: shippingGroupsToBeDeleted});
  }

  return response;
};

/**
 * Function to get a map of shipping groups corresponding to the same shipping address and shipping method values
 * It constructs a map with 'shippingAddress-shippingMethod' as the key and shippingGroups as the value
 * @param {Object} shippingGroups shipping groups
 * @returns {Map} returns a map of (shippingAddress-shippingMethod)->ShippingGroups
 */
const getAddressToShippingGroupsMap = (shippingGroups = {}) => {
  const addressToShippingGroupsMap = new Map();

  (Object.values(shippingGroups) || []).forEach(shippingGroup => {
    if (shippingGroup.type === SHIPPING_GROUP_HARDGOOD) {
      const shippingAddress = Object.values(shippingGroup.shippingAddress || {}).join('-');
      const shippingMethod = (shippingGroup.shippingMethod || {}).value || '';

      const key = `${shippingAddress}-${shippingMethod}`;

      if (addressToShippingGroupsMap.has(key)) {
        const shippingGroups = addressToShippingGroupsMap.get(key);
        shippingGroups.push(shippingGroup);
      } else {
        addressToShippingGroupsMap.set(key, [shippingGroup]);
      }
    }
  });

  return addressToShippingGroupsMap;
};

/**
 * Function to consolidate shipping groups that share the same address and shipping method
 * @param {Object} action store action
 * @param {Object} shippingGroups shipping groups
 * @returns {boolean} returns the action response
 */
export const mergeDuplicateShippingGroups = async (action, shippingGroups) => {
  // get the map of SGs corresponding to the same address and shipping method
  const addressToShippingGroupsMap = getAddressToShippingGroupsMap(shippingGroups);

  let response = {ok: true};
  for (const shippingGroupsSet of addressToShippingGroupsMap.values()) {
    if (shippingGroupsSet && shippingGroupsSet.length > 1) {
      // if multiple SGs have same address and shipping method,
      // then merge the SGs to a single SG (here, all SGs in shippingGroupsSet are merged to the first one, shippingGroupsSet[0])
      response = await moveItemsToTargetShippingGroup(action, shippingGroupsSet[0], shippingGroupsSet);
    }
  }

  return response;
};

/**
 * Function to select the first shipping method as default if the shipping method is not selected for any shipping group
 * Invokes the 'updateCartShippingGroups' action to update the shipping groups.
 * Checks if the selected shipping method is disabled for Quoted orders
 * @param {Object} store store context
 * @param {Object} shippingGroups list of shipping groups
 */
const selectDefaultShippingMethod = async (store, {shippingGroups = {}, id, state}, alertShippingMethodDisabled) => {
  const currentOrderShippingMethods = getOrderShippingMethods(store.getState())[id];
  const {action} = store;
  if (state === ORDER_STATE_QUOTED) {
    // check if the selected shipping method for quoted order is disabled
    const isShippingMethodDisabled = Object.values(shippingGroups).some(shippingGroup => {
      const shippingOptions = currentOrderShippingMethods[shippingGroup.shippingGroupId] || [];
      const selectedShippingMethod = shippingGroup.shippingMethod.value;
      // ignoring 'hardgoodShippingGroup' shipping method
      if (
        selectedShippingMethod === null ||
        selectedShippingMethod === SHIPPING_GROUP_HARDGOOD ||
        selectedShippingMethod === SHIPPING_GROUP_IN_STORE_PICKUP
      ) {
        return false;
      }

      return !shippingOptions.includes(selectedShippingMethod);
    });
    // displays error if the selected shipping method is disabled
    if (isShippingMethodDisabled) {
      action('notify', {level: 'error', message: alertShippingMethodDisabled});
    }
  } else {
    // check if any of the shipping groups doesn't have any shipping method selected
    const isInvalidShippingMethodPresent = Object.values(shippingGroups).some(shippingGroup => {
      const shippingOptions = currentOrderShippingMethods[shippingGroup.shippingGroupId] || [];
      const selectedShippingMethod = shippingGroup.shippingMethod.value;

      return (
        shippingGroup.items.length > 0 &&
        shippingOptions.length > 0 &&
        (!selectedShippingMethod ||
          selectedShippingMethod === SHIPPING_GROUP_HARDGOOD ||
          !shippingOptions.includes(selectedShippingMethod))
      );
    });

    if (isInvalidShippingMethodPresent) {
      let items = [];
      items = Object.values(shippingGroups).map(shippingGroup => {
        const item = {};
        item.shippingGroupId = shippingGroup.shippingGroupId;
        const shippingMethods = currentOrderShippingMethods[shippingGroup.shippingGroupId] || [];

        // If the shipping method is not selected for the shipping group,
        // then send the default shipping method (first one) in the payload. Otherwise just send the shippingGroupId
        if (
          shippingGroup.items.length > 0 &&
          shippingMethods.length > 0 &&
          (!shippingGroup.shippingMethod.value || shippingGroup.shippingMethod.value === SHIPPING_GROUP_HARDGOOD)
        ) {
          item.shippingMethod = {
            value: shippingMethods[0]
          };
        }

        return item;
      });

      const response = await action('updateCartShippingGroups', {items});

      return response;
    }
  }
};

/**
 * Function to load the shipping methods for all the shipping groups
 * and select the first shipping method as default if the shipping method is not selected for any shipping group
 * @param {Object} store store context
 * @param {Object} shippingGroups list of shipping groups
 */
export const loadShippingMethodsForAllSGs = async (store, currentOrder, alertShippingMethodDisabled) => {
  if (!currentOrder) {
    currentOrder = getCurrentOrder(store.getState());
  }
  const shippingGroupIds = getHardgoodShippingGroupIds(currentOrder.shippingGroups);
  let response = {ok: true};
  if (shippingGroupIds.length > 0) {
    const {action} = store;
    if (currentOrder.state === ORDER_STATE_QUOTED) {
      response = await action('listShippingMethods', getListShippingMethodsPayload(currentOrder));
    } else {
      response = await action('listShippingMethodsForCart', {shippingGroupIds: shippingGroupIds.join()});
    }
    // if (response.ok) {
    //   response = await selectDefaultShippingMethod(store, currentOrder, alertShippingMethodDisabled);
    // }
  }

  return response;
};
