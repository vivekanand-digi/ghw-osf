import {all, put, select} from 'redux-saga/effects';
import {combineReducers, createReducer, endpointSaga, takeEvery} from '@oracle-cx-commerce/store/utils';
import {getCurrentProfileId, getCurrentSiteId} from '@oracle-cx-commerce/commerce-utils/selector';
import {getWidgetInfoEntity} from '../../selectors/braintree-selector';

const LOGOUT_SUCCESS = 'logoutSuccess';
const UNAUTHORIZED = '401';
const UPDATE_SHOPPER_PROFILE = 'updateShopperProfile';

const updateShopperProfileReducer = (state, payload) => {
  return {
    ...state,
    profile: {
      ...state.profile,
      paymentMethods: payload.paymentMethods
    }
  };
};

const expireShopperProfileReducer = state => ({
  ...state,
  profile: {}
});

const ADD_SUBSCRIPTION_BILLING_FREQUENCY = 'addSubscriptionBillingFrequency';
const CLEAR_RECURRING_SUBSCRIPTION = 'clearRecurringSubscription';

function clearSubscriptionReducer(state) {
  return {
    ...state,
    subscription: {}
  };
}

function addSubscriptionBillingFrequencyReducer(state, action) {
  const {billingFrequency} = action.payload;

  return {
    ...state,
    subscription: {
      ...state.subscription,
      billingFrequency
    }
  };
}

function* getShopperProfileSaga(action) {
  const basicAuth = yield select(state => getWidgetInfoEntity(state, {entityName: 'basicAuth'}));
  const profileId = yield select(getCurrentProfileId);
  const site = yield select(getCurrentSiteId);

  const response = yield endpointSaga({
    action,
    payload: {
      basicAuth,
      profileId,
      site
    },
    endpointId: 'retrieveShopperProfile'
  });

  if (response.ok) {
    yield put({
      type: UPDATE_SHOPPER_PROFILE,
      paymentMethods: response.delta.shopperProfileRepository.profile.paymentMethods
    });
  }

  return response;
}

/**
 * The getShopperProfile action.
 *
 * This exports a generator function named "saga", whose presence signals OSF to pass
 * the generator function to Redux-Saga's middleware. Run API the first time the action
 * is dispatched via the store API.
 *
 * The generator function results in an asynchronous endpoint invocation
 * when the action is dispatched.
 */
export default {
  reducer: combineReducers({
    shopperProfileRepository: createReducer({
      [UPDATE_SHOPPER_PROFILE]: updateShopperProfileReducer,
      [UNAUTHORIZED]: expireShopperProfileReducer,
      [LOGOUT_SUCCESS]: expireShopperProfileReducer,
      [ADD_SUBSCRIPTION_BILLING_FREQUENCY]: addSubscriptionBillingFrequencyReducer,
      [CLEAR_RECURRING_SUBSCRIPTION]: clearSubscriptionReducer
    })
  }),

  *saga() {
    yield takeEvery('getShopperProfile', getShopperProfileSaga);
  }
};
