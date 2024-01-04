import {put} from 'redux-saga/effects';
import {createReducer, endpointSaga, takeEvery} from '@oracle-cx-commerce/store/utils';
import {getShopperProfile} from '../../selectors/shopper-profile-selector';

/**
 * Saga that updates the application state. The code runs saga when the reducer flag is not supplied.
 * There are three options to consider:
 * 1. Create a custom action by default
 *    example: yarn occ create-action —-action-name getCurrency
 * 2. Create a custom action which invokes an endpoint with the same name as the action-name
 *    example: yarn occ create-action —-action-name getCurrency —-endpoint
 * 3. Create a custom action which invokes an endpoint with a different name as the action-name
 *    example: yarn occ create-action —-action-name testCurrency —-endpoint getCurrency
 */

// TODO: Add reducer to update list on success response of action below

const UPDATE_SHOPPER_PROFILE = 'updateShopperProfile';

const updateShopperProfileReducer = (state, payload) => {
  const {paymentMethods, ...profile} = getShopperProfile(state);

  return {
    ...state,
    shopperProfileRepository: {
      profile: {
        ...profile,
        paymentMethods: payload.paymentMethods
      }
    }
  };
};

function* addAchPaymentActionSaga(action) {
  const response = yield endpointSaga({action, payload: action.payload, endpointId: 'addSavedPayment'});

  if (response.ok) {
    const shopperProfileResponse = yield endpointSaga({
      action,
      payload: action.payload,
      endpointId: 'retrieveShopperProfile'
    });
    yield put({
      type: UPDATE_SHOPPER_PROFILE,
      paymentMethods: shopperProfileResponse.delta.shopperProfileRepository.profile.paymentMethods
    });
  }

  return response;
}

/**
 * The addAchPaymentAction action.
 *
 * This exports a generator function named "saga", whose presence signals OSF to pass
 * the generator function to Redux-Saga's middleware. Run API the first time the action
 * is dispatched via the store API.
 *
 * The generator function results in an asynchronous endpoint invocation
 * when the action is dispatched.
 */
export default {
  reducer: createReducer({
    [UPDATE_SHOPPER_PROFILE]: updateShopperProfileReducer
  }),
  *saga() {
    yield takeEvery('addAchPaymentAction', addAchPaymentActionSaga);
  }
};
