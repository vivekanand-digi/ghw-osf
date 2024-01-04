/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext, useEffect, useState} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {useCardTypesFetcher} from '@oracle-cx-commerce/fetchers/payments/hooks';
import {getPageData} from './selectors';
import css from './styles.css';
import NoSavedPaymentView from './components/no-saved-payment-view';
import DefaultSavedPaymentView from './components/default-saved-payment-view';
import {useInitializeWidget} from '../../../fetchers/hooks';

/**
 * Component to display default saved card or first saved card if default card is not present.
 * If no saved card available then displays expected message.
 * It includes default saved card and no saved card sub components.
 * @param {Object} props the props object
 */
const ProfileSavedPaymentSummary = props => {
  const {clientToken, headingSavedPayments, isUserLoggedIn} = props;
  const {defaultPayment} = props;
  const store = useContext(StoreContext);
  const {action} = store;
  const [actionCompletedSuccessfully, setActionCompletedSuccessfully] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);

  // Fetches the list of card types
  useCardTypesFetcher(store);
  useInitializeWidget(store);

  //triggers action to list saved cards for the profile
  useEffect(() => {
    if (clientToken && isUserLoggedIn && !actionCompletedSuccessfully && !errorOccured) {
      action('getShopperProfile').then(response => {
        console.log(response);
        if (response.ok) {
          setActionCompletedSuccessfully(true);
        }
        if (!response.ok) {
          setErrorOccured(true);
        }
      });
    }
  }, [action, actionCompletedSuccessfully, clientToken, errorOccured, isUserLoggedIn]);

  return (
    <Styled id="ProfileSavedPaymentSummary" css={css}>
      {isUserLoggedIn && actionCompletedSuccessfully && !errorOccured && (
        <div className="ProfileSavedPaymentSummary">
          <h2>{headingSavedPayments}</h2>
          {defaultPayment ? <DefaultSavedPaymentView {...props} /> : <NoSavedPaymentView {...props} />}
        </div>
      )}
    </Styled>
  );
};

export default connect(getPageData)(ProfileSavedPaymentSummary);
