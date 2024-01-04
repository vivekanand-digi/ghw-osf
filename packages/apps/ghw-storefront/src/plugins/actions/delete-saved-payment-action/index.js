import {all, put, select} from 'redux-saga/effects';
import {endpointSaga, takeEvery, createReducer} from '@oracle-cx-commerce/store/utils';
import {getCurrentSiteId} from '@oracle-cx-commerce/commerce-utils/selector';
import {getWidgetInfoEntity} from '../../selectors/braintree-selector';
import {getCreditCards, getShopperProfile} from '../../selectors/shopper-profile-selector';

const REMOVE_CARD_FROM_PROFILE = 'removeCardFromShopperProfile';

const removeCardFromShopperProfileReducer = (state, payload) => {
  const profile = getShopperProfile(state);
  const filtered = profile.paymentMethods.filter(({token}) => token !== payload.token) || [];

  return {
    ...state,
    shopperProfileRepository: {
      profile: profile.paymentMethods.filter(({token}) => token !== payload.token) || []
    }
  };
};

function* deleteSavedPaymentActionSaga(action) {
  const basicAuth = yield select(state => getWidgetInfoEntity(state, {entityName: 'basicAuth'}));
  const site = yield select(getCurrentSiteId);
  const response = yield endpointSaga({
    action,
    payload: {
      ...action.payload,
      basicAuth,
      site
    },
    endpointId: 'deleteSavedPayment'
  });

  if (response.ok) {
    yield put({
      type: REMOVE_CARD_FROM_PROFILE,
      token: action.payload.token
    });
  }

  return response;
}

export default {
  reducer: createReducer({
    [REMOVE_CARD_FROM_PROFILE]: removeCardFromShopperProfileReducer
  }),
  *saga() {
    yield takeEvery('deleteSavedPaymentAction', deleteSavedPaymentActionSaga);
  }
};
