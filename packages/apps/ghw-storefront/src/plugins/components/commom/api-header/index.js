import {getSessionContext, getGlobalContext} from '@oracle-cx-commerce/commerce-utils/selector';

export const getReqHeaders = store => {
  const {token} = getSessionContext(store.getState());
  const {lang, site} = getGlobalContext(store.getState());
  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'x-ccasset-language': lang,
    'x-ccsite': site
  };
  if (token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  }

  return {
    headers
  };
};
