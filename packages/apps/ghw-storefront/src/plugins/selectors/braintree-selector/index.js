import {getCardTypes} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';

/**
 * Selector to extract repositories from a state object.
 */
export const getBraintreeRepository = state => state.braintreeRepository || {};

/**
 * Selector to extract repositories.tables from a state object.
 */
export const getWidgetInfo = state => getBraintreeRepository(state).widgetInfo || {};

/**
 * Selector to extract repositories.tables.entities from a state object.
 */
export const getWidgetInfoEntity = (state, {entityName}) => getWidgetInfo(state)[entityName] || {};

export const getCardData = state => {
  const cardTypes = getCardTypes(state);

  return {
    //an empty object is always treated as new object and causes render of widget so explicitly
    //check if card types is not empty object then only return it otherwise return undefined
    cardTypes: !isEmptyObject(cardTypes) ? cardTypes : undefined
  };
};
