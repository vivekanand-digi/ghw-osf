/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  ACCOUNT_ADDRESS_MANAGER,
  ADMIN,
  BUYER,
  APPROVER,
  PROFILE_ADDRESS_MANAGER,
  SHIPPING_GROUP_HARDGOOD,
  ORDER_STATE_QUOTED
} from '@oracle-cx-commerce/commerce-utils/constants';
import {
  getContactInfos,
  getCurrentOrder,
  getCurrentOrderId,
  getCurrentProfileId,
  getOrder,
  getOrders,
  getOrderShippingMethods,
  getPage,
  getProfile,
  isAuthenticated,
  isCurrentUserB2B
} from '@oracle-cx-commerce/commerce-utils/selector';

import {WARNING_ICON_HTML} from '@oracle-cx-commerce/react-components/form/constants';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';

/**
 * Checks whether an account address object contains all the required field
 * @param {Object} address The address object
 * @returns {Boolean} true if valid else false
 */
export const isAccountAddressValid = address => {
  if (
    !isEmptyObject(address) &&
    address.address1 &&
    address.city &&
    address.state &&
    address.country &&
    address.postalCode
  ) {
    return true;
  }

  return false;
};

/**
 * Checks whether an address object contains all the required field
 * @param {Object} address The address object
 * @returns {Boolean} true if valid else false
 */
export const isAddressValid = (address, isB2BUser, excludeNameValidation = false) => {
  if (isB2BUser) {
    return isAccountAddressValid(address);
  }
  if (
    !isEmptyObject(address) &&
    (excludeNameValidation || (address.firstName && address.lastName)) &&
    address.address1 &&
    address.city &&
    address.state &&
    address.country &&
    address.postalCode
  ) {
    return true;
  }

  return false;
};

/**
 * Function to find a defaultCountry or the first country in the countries list
 * @param {Object} countryList The country list object
 * @param {String} defaultCountry The default country if available
 * @returns {String} a valid country code
 */
export const getDefaultCountry = (countryList, defaultCountry) => {
  let country = '';
  if (countryList) {
    const countries = Object.keys(countryList);
    if (countries.includes(defaultCountry)) {
      country = defaultCountry;
    } else if (countries.length > 0) {
      [country] = countries;
    }
  }

  return country;
};

/** Function to return an object address to display in drop-down
 * @param {Array} address address object
 * @returns {Object} consist of label and value
 */
export const getAddressDropdownItem = (address = {}) => {
  const {firstName, lastName, address1, city, state, postalCode} = address;

  return {
    label: `${firstName} ${lastName}, ${address1}, ${city}, ${state} ${postalCode}`,
    value: JSON.stringify(address)
  };
};

/**
 * To get the available roles of a logged in user
 * @param {Object} roles object of available user roles
 * @returns {Object} consist flag for each role
 */
export const getAddressManagerRoles = roles => {
  const addressManagerRoles = [];
  roles &&
    Object.values(roles).forEach(role => {
      addressManagerRoles.push(role.function);
    });

  const isAccountAddrManager = addressManagerRoles.includes(ACCOUNT_ADDRESS_MANAGER);
  const isProfileAddrManager = addressManagerRoles.includes(PROFILE_ADDRESS_MANAGER);
  const isAdmin = addressManagerRoles.includes(ADMIN);
  const isBuyer = addressManagerRoles.includes(BUYER);
  const isApprover = addressManagerRoles.includes(APPROVER);

  return {
    isAccountAddrManager,
    isProfileAddrManager,
    isAdmin,
    isBuyer,
    isApprover
  };
};

/**
 * Validates required field
 * @param {String} fieldValue The field value
 * @param {String} requiredMessage The message to be displayed for required error
 * @returns {String} The validation message
 */
export const validateRequiredField = (fieldValue, requiredMessage) => {
  let validationMessage = '';
  if (!fieldValue) {
    validationMessage = requiredMessage;
  }

  return validationMessage;
};

/**
 * Validates postalCode
 * @param {String} postalCode The postalCode
 * @param {String} country The selected country
 * @param {Object} errorMessages The error messages object containing messages to be displayed for invalid and required
 * @returns {String} The validation message
 */
export const validatePostalCode = (postalCode, country, {messageZipCodeRequired = '', messageZipCodeInvalid = ''}) => {
  let validationMessage = '';
  if (!postalCode) {
    validationMessage = messageZipCodeRequired;
  } else {
    let postalCodePattern = /^[0-9a-zA-Z]{1,}([ -][0-9a-zA-Z]{1,})?$/;
    if (country === 'US') {
      postalCodePattern = /^[0-9]{5}([ -][0-9]{4})?$/;
    } else if (country === 'CA') {
      postalCodePattern = /^[abceghjklmnprstvxyABCEGHJKLMNPRSTVXY]{1}[0-9]{1}[a-zA-Z]{1} *[0-9]{1}[a-zA-Z]{1}[0-9]{1}$/;
    }

    if (!postalCode.match(postalCodePattern)) {
      validationMessage = messageZipCodeInvalid;
    }
  }

  return validationMessage;
};

/**
 * Validates phoneNumber field
 * @param {String} fieldValue The field value
 * @param {String} messagePhoneNumberInvalid The message to be displayed for error
 * @returns {String} The validation message
 */
export const validatePhoneNumber = (fieldValue, messagePhoneNumberInvalid = '') => {
  if (fieldValue.match(/^[0-9]+$/)) {
    return '';
  }

  return messagePhoneNumberInvalid;
};

/**
 * Validation method for various form fields
 * @param {String} textRequiredField Required field error message
 * @param {String} textInvalidField Invalid field error message
 * @returns {Object} Validation methods
 */
export const addressFormValidators = (textInvalidField, textRequiredField) => ({
  addressType: elementValue => validateRequiredField(elementValue, textRequiredField),
  companyName: elementValue => validateRequiredField(elementValue, textRequiredField),
  firstName: elementValue => validateRequiredField(elementValue, textRequiredField),
  lastName: elementValue => validateRequiredField(elementValue, textRequiredField),
  country: elementValue => validateRequiredField(elementValue, textRequiredField),
  postalCode: (elementValue, country) =>
    validatePostalCode(elementValue, country, {
      messageZipCodeInvalid: textInvalidField,
      messageZipCodeRequired: textRequiredField
    }),
  state: elementValue => validateRequiredField(elementValue, textRequiredField),
  address1: elementValue => validateRequiredField(elementValue, textRequiredField),
  city: elementValue => validateRequiredField(elementValue, textRequiredField)
});

/**
 * Sorts the array of objects
 * @param {Object} items The array of objects
 * @param {String} sortBy field on which the sort to be performed
 * @returns {Array} sorted array
 */
export const getSortedArray = (items, sortBy) => {
  return [].concat(Object.values(items) || []).sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
};

/**
 * Sets the validity for given element
 * @param {Object} element The target element
 * @param {Function} validate function which will be executed
 * @param {String} country country
 */
export const setElementValidity = (element, validator, country) => {
  element.setCustomValidity('');
  element.classList.remove('AddressInput__Invalid');

  if (validator) {
    if (element.name === 'postalCode') {
      element.setCustomValidity(validator(element.value, country));
    } else {
      element.setCustomValidity(validator(element.value));
    }
  }

  if (element.validationMessage) {
    element.classList.add('AddressInput__Invalid');
  }

  const {nextElementSibling} = element;
  if (element.willValidate && nextElementSibling && nextElementSibling.matches('.validationMessage')) {
    nextElementSibling.textContent = element.validationMessage;
    if (element.validationMessage) {
      nextElementSibling.insertAdjacentHTML('afterbegin', WARNING_ICON_HTML);
    }
  }
};

/**
 * Clears the validity for given element
 * @param {Object} element The target element
 */
export const clearElementValidity = element => {
  element.setCustomValidity('');
  element.classList.remove('AddressInput__Invalid');
  const {nextElementSibling} = element;
  if (nextElementSibling && nextElementSibling.matches('.validationMessage')) {
    nextElementSibling.textContent = '';
  }
};

/**
 * Sets the validity or clear the validity for given element
 * @param {Object} element The target element
 * @param {String} textRequiredField Required field error message
 * @param {String} textInvalidField Invalid field error message
 * @param {String} country country
 */
export const setCustomValidity = (element, textInvalidField, textRequiredField, country) => {
  const validators = addressFormValidators(textInvalidField, textRequiredField);
  if (element) {
    const validator = validators[element.name];
    if (element.required) {
      setElementValidity(element, validator, country);
    } else {
      clearElementValidity(element);
    }
  }
};

/**
 * Success callback for the updateCartShippingGroup action
 */
const onOk = (action, message) => {
  action('notify', {level: 'success', message});
};

/**
 * Failure callback for the updateCartShippingGroup action
 */
const onNotOk = (action, {error: {message = ''} = {}} = {}) => {
  action('notify', {level: 'error', message});
};

/**
 * Returns shipping groups payload for 'updateQuotedOrder' action
 */
export const getQuoteOrderSGPayload = (currentOrder = {}, shippingGroup = {}, shippingAddress, shippingMethod) => {
  const shippingGroups = [];
  Object.entries(currentOrder.shippingGroups).forEach(([key, value]) => {
    const shippingGroupObject = {
      shippingGroupId: value.shippingGroupId,
      shippingAddress: value.shippingAddress,
      shippingMethod: value.shippingMethod
    };
    if (key === shippingGroup.shippingGroupId) {
      if (shippingAddress) {
        shippingGroupObject.shippingAddress = shippingAddress;
      }
      if (shippingMethod) {
        shippingGroupObject.shippingMethod = shippingMethod;
      }
    }
    shippingGroupObject.shippingMethod.relationships = [];
    value.items.forEach(item => {
      const itemRelationshipObject = {};
      itemRelationshipObject.commerceItemId = item.commerceItemId;
      itemRelationshipObject.quantity = item.quantity;
      shippingGroupObject.shippingMethod.relationships.push(itemRelationshipObject);
    });
    shippingGroups.push(shippingGroupObject);
  });

  return shippingGroups;
};

/**
 * Returns payload for 'listShippingMethods' action
 */
export const getListShippingMethodsPayload = (currentOrder = {}) => {
  const shoppingCart = {items: []};
  const shippingGroups = [];
  Object.entries(currentOrder.shippingGroups).forEach(([key, value]) => {
    if (value.shippingAddress) {
      const shippingGroupObject = {
        shippingGroupId: key,
        shippingAddress: {...value.shippingAddress, selectedCountry: value.shippingAddress.country},
        items: value.items
      };
      shoppingCart.items = [...shoppingCart.items, ...value.items];
      shippingGroups.push(shippingGroupObject);
    }
  });

  return {shoppingCart, shippingGroups};
};

export const loadShippingMethodsAndSetDefaultForSG = async (store, shippingGroup = {}) => {
  const {action} = store;
  const {shippingGroupId} = shippingGroup;
  const state = store.getState();
  const currentOrderId = getCurrentOrderId(state);
  const contextOrderId = getPage(state).contextId;
  const currentOrder = contextOrderId ? getOrder(state, {id: contextOrderId}) : getCurrentOrder(state);
  const orderId = contextOrderId ? contextOrderId : currentOrderId;

  let response = {ok: true};
  if (currentOrder.state === ORDER_STATE_QUOTED) {
    response = await action('listShippingMethods', getListShippingMethodsPayload(currentOrder));
  } else {
    response = await action('listShippingMethodsForCart', {shippingGroupIds: shippingGroupId});
  }
  if (response.ok) {
    const shippingMethodIds = getOrderShippingMethods(store.getState())[orderId][shippingGroupId] || [];
    const {shippingMethod = {}} = getOrders(store.getState())[orderId].shippingGroups[shippingGroupId] || {};
    if (shippingMethodIds.length > 0 && (!shippingMethod.value || shippingMethod.value === SHIPPING_GROUP_HARDGOOD)) {
      if (currentOrder.state === ORDER_STATE_QUOTED) {
        const payload = {
          shippingGroupId,
          shippingMethod: {value: shippingMethodIds[0]},
          orderId,
          type: SHIPPING_GROUP_HARDGOOD,
          shippingGroups: getQuoteOrderSGPayload(currentOrder, {shippingGroupId}, '', {value: shippingMethodIds[0]})
        };
        response = await action('updateQuotedOrder', payload);
      } else {
        const payload = {};
        payload.type = SHIPPING_GROUP_HARDGOOD;
        payload.shippingMethod = {value: shippingMethodIds[0]};
        payload.shippingGroupId = shippingGroupId;
        response = await action('updateCartShippingGroup', payload);
      }
    }
  }

  return response;
};

/**
 * Function updates the empty-shipping-method in shipping group
 * and load the available shipping-methods for the shipping-address
 */
const resetShippingMethodInShippingGroup = async ({
  store,
  shippingGroup,
  shippingAddress,
  alertShippingGroupUpdated,
  handleCloseAction
}) => {
  const {action} = store;
  const state = store.getState();
  const currentOrderId = getCurrentOrderId(state);
  const contextOrderId = getPage(state).contextId;
  const currentOrder = contextOrderId ? getOrder(state, {id: contextOrderId}) : getCurrentOrder(state);
  const orderId = contextOrderId ? contextOrderId : currentOrderId;
  let response;
  if (currentOrder.state === ORDER_STATE_QUOTED) {
    const payload = {
      shippingAddress,
      shippingGroupId: shippingGroup.shippingGroupId,
      shippingMethod: {value: ''},
      orderId,
      shippingGroups: getQuoteOrderSGPayload(currentOrder, shippingGroup, shippingAddress, {value: ''})
    };
    response = await action('updateQuotedOrder', payload);
  } else {
    const payload = {
      shippingAddress,
      shippingGroupId: shippingGroup.shippingGroupId,
      shippingMethod: {value: ''}
    };
    response = await action('updateCartShippingGroup', payload);
  }
  if (response.ok === false) {
    onNotOk(action, response);
  } else {
    onOk(action, alertShippingGroupUpdated);
    if (handleCloseAction) {
      handleCloseAction();
    }
    response = await loadShippingMethodsAndSetDefaultForSG(store, shippingGroup);
    if (response.ok === false) {
      onNotOk(action, response);
    }
  }

  return response;
};

/**
 * Function to update the shipping address in a shipping group
 * FIX: if the action is failed due to invalid shipping method,
 * then update the shipping group with empty shipping method.
 * @param {*} store
 * @param {*} param
 */
export const updateShippingAddressInShippingGroup = async (
  store,
  {shippingAddress = {}, shippingGroup = {}, alertShippingGroupUpdated, handleCloseAction, fetchShippingMethods = false}
) => {
  const {action} = store;
  const state = store.getState();
  const currentOrderId = getCurrentOrderId(state);
  const contextOrderId = getPage(state).contextId;
  const currentOrder = contextOrderId ? getOrder(state, {id: contextOrderId}) : getCurrentOrder(state);
  const orderId = contextOrderId ? contextOrderId : currentOrderId;

  const prevAddress = shippingGroup.shippingAddress;
  if (
    fetchShippingMethods &&
    (prevAddress.country !== shippingAddress.country ||
      prevAddress.state !== shippingAddress.state ||
      prevAddress.postalCode !== shippingAddress.postalCode)
  ) {
    fetchShippingMethods = true;
  } else {
    fetchShippingMethods = false;
  }
  let response;
  if (currentOrder.state === ORDER_STATE_QUOTED) {
    response = await action('updateQuotedOrder', {
      shippingAddress,
      shippingGroupId: shippingGroup.shippingGroupId,
      orderId,
      shippingGroups: getQuoteOrderSGPayload(
        currentOrder,
        shippingGroup,
        shippingAddress,
        fetchShippingMethods ? {value: ''} : ''
      )
    });
  } else {
    response = await action('updateCartShippingGroup', {
      shippingAddress,
      shippingGroupId: shippingGroup.shippingGroupId
    });
  }
  if (response.ok === false) {
    if (response.error && response.error.errorCode === '28088') {
      resetShippingMethodInShippingGroup({
        store,
        shippingGroup,
        shippingAddress,
        alertShippingGroupUpdated,
        handleCloseAction
      });
    } else {
      onNotOk(action, response);
    }
  } else {
    // onOk(action, alertShippingGroupUpdated);
    if (handleCloseAction) {
      handleCloseAction();
    }
    if (fetchShippingMethods) {
      const listShippingMethodsResponse = await loadShippingMethodsAndSetDefaultForSG(store, shippingGroup);
      if (listShippingMethodsResponse.ok === false) {
        onNotOk(action, listShippingMethodsResponse);
      }
    }
  }

  return response;
};

export const updateSGWithProfileDefaultAddress = async (store, shippingGroup = {}) => {
  let response = {};
  const {action} = store;
  const state = store.getState();
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';

  if (isUserLoggedIn) {
    const contactInfos = getContactInfos(state);
    const isB2BUser = isCurrentUserB2B(state);
    const currentProfile = getProfile(state);

    const defaultAddressId = isB2BUser ? currentProfile.contactShippingAddress : currentProfile.shippingAddress;
    const defaultAddress = contactInfos[defaultAddressId] || {};

    if (!isEmptyObject(shippingGroup) && !isEmptyObject(defaultAddress)) {
      const currentOrderId = getCurrentOrderId(state);
      const contextOrderId = getPage(state).contextId;
      const currentOrder = contextOrderId ? getOrder(state, {id: contextOrderId}) : getCurrentOrder(state);
      const orderId = contextOrderId ? contextOrderId : currentOrderId;
      if (currentOrder.state === ORDER_STATE_QUOTED) {
        const payload = {
          shippingAddress: defaultAddress,
          shippingGroupId: shippingGroup.shippingGroupId,
          orderId,
          shippingGroups: getQuoteOrderSGPayload(currentOrder, shippingGroup, defaultAddress),
          type: SHIPPING_GROUP_HARDGOOD
        };
        payload.shippingAddress.firstName = payload.shippingAddress.firstName || currentProfile.firstName;
        payload.shippingAddress.lastName = payload.shippingAddress.lastName || currentProfile.lastName;
        response = await action('updateQuotedOrder', payload);
      } else {
        const payload = {
          shippingAddress: defaultAddress,
          type: SHIPPING_GROUP_HARDGOOD,
          shippingGroupId: shippingGroup.shippingGroupId
        };
        payload.shippingAddress.firstName = payload.shippingAddress.firstName || currentProfile.firstName;
        payload.shippingAddress.lastName = payload.shippingAddress.lastName || currentProfile.lastName;
        response = await action('updateCartShippingGroup', payload);
      }
      if (response.ok === false) {
        onNotOk(action, response);
      } else {
        const listShippingMethodsResponse = await loadShippingMethodsAndSetDefaultForSG(store, shippingGroup);
        if (listShippingMethodsResponse.ok === false) {
          onNotOk(action, listShippingMethodsResponse);
        }
      }
    }
  }

  return response;
};

export const getListProfileAddressesQueryFields = () => {
  return ['firstName', 'lastName', 'companyName', 'address1', 'postalCode'];
};
export const getListOrganizationAddressesQueryFields = () => {
  return ['companyName', 'address1', 'postalCode'];
};

export const listAddresses = async ({
  store,
  payload,
  isListProfileAddresses = false,
  searchTerm,
  searchField,
  addressIds,
  setAddressIds,
  setResetPage
}) => {
  if (searchTerm !== '') {
    if (searchField !== '') {
      payload.q = `${searchField} co "${searchTerm}"`;
    } else {
      const fieldNames = isListProfileAddresses
        ? getListProfileAddressesQueryFields()
        : getListOrganizationAddressesQueryFields();
      payload.q = fieldNames
        .map(field => {
          return `${field} co "${searchTerm}"`;
        })
        .join(' OR ');
    }
  }

  const {action} = store;
  setResetPage(false);
  const response = await action(isListProfileAddresses ? 'listProfileAddresses' : 'listOrganizationAddresses', payload);
  const recentListingItems = [];
  if (response && response.ok && response.json && response.json.items) {
    for (const item of response.json.items) {
      recentListingItems.push(item.address['repositoryId']);
    }
    setAddressIds([...new Set([...addressIds, ...recentListingItems])]);

    return {totalNumberOfItems: response.json.totalResults, currentItemsCount: recentListingItems.length};
  }

  return {};
};

/* Method will return a flag if searchTerm string is present in key-field of address */
export const filterDefaultAddresses = ({address, searchTerm, searchField}) => {
  if (searchTerm === '') {
    return true;
  }
  let arr = [];
  if (searchField !== '') {
    arr = [address[searchField] || ''];
  } else {
    arr = getListProfileAddressesQueryFields().map(field => {
      return address[field] || '';
    });
  }

  try {
    const regex = new RegExp(searchTerm, 'i');
    const match = element => regex.test(element.toString());
    const isMatch = arr.some(match);

    return isMatch;
  } catch (e) {
    return true;
  }
};

/* Returns address id's array sorted by lastName */
export const getSortedAddressIds = ({contactInfos, addressIds}) => {
  const sortedAddressIds = [];
  if (contactInfos) {
    const sortedIds = addressIds
      .filter(addressId => addressId)
      .sort((a, b) => {
        if (contactInfos[a] && contactInfos[a].lastName && contactInfos[b] && contactInfos[b].lastName) {
          if (contactInfos[a].lastName.toLowerCase() > contactInfos[b].lastName.toLowerCase()) {
            return 1;
          }
          if (contactInfos[a].lastName.toLowerCase() < contactInfos[b].lastName.toLowerCase()) {
            return -1;
          }
        }
        if (
          contactInfos[a] &&
          contactInfos[a].address1 &&
          contactInfos[b] &&
          contactInfos[b].address1 &&
          contactInfos[a].address1.toLowerCase() > contactInfos[b].address1.toLowerCase()
        ) {
          return 1;
        }

        return -1;
      });

    return sortedAddressIds.concat(sortedIds);
  }

  return addressIds;
};
