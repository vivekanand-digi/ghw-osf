/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext, useEffect, useState} from 'react';

import Alert from '@oracle-cx-commerce/react-components/alert';
import Card from '@oracle-cx-commerce/react-components/card';
import {PAGE_PROFILE_ADD_CREDIT_CARD_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {useCardTypesFetcher} from '@oracle-cx-commerce/fetchers/payments/hooks';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {getPageData} from './selectors';
import css from './styles.css';
import ProfileSavedPayment from './components/profile-saved-payment';
import {PROFILE_ADD_ACH_PAYMENT} from './constants';
import {useInitializeWidget} from '../../../fetchers/hooks';

//constants
const PROFILE_ADD_CREDIT_CARD = PAGE_PROFILE_ADD_CREDIT_CARD_LINK,
  ERROR = 'error';

/**
 * Top component for listing profile saved cards. It includes profile saved card sub component
 * It provides functionality to make a saved card as default card and provide
 * option to navigate to either add new card or delete existing card
 * @param {*} props the property object
 */
const ProfileSavedPayments = props => {
  const {
    clientToken,
    id,
    isUserLoggedIn,
    actionAddNewCard,
    actionAddAchPayment,
    headingSavedCreditCards,
    textProfileCardHelper1,
    textProfileCardHelper2
  } = props;
  const [actionCompletedSuccessfully, setActionCompletedSuccessfully] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const store = useContext(StoreContext);
  const {action} = store;
  // local state to show action result in alert
  const [actionResponse, setActionResponse] = useState({type: '', message: ''});

  // Fetches the list of card types
  useCardTypesFetcher(store);
  useInitializeWidget(store);
  const [savedPayments, setSavedPayments] = useState([]);

  //use effect to trigger list profile card actions
  useEffect(() => {
    if (clientToken && !actionCompletedSuccessfully && isUserLoggedIn && !errorOccured) {
      action('getShopperProfile').then(response => {
        const {paymentMethods} = response.delta.shopperProfileRepository.profile;
        if (response.ok) {
          setSavedPayments(paymentMethods);
          setActionCompletedSuccessfully(true);
        }
        if (!response.ok) {
          const {error} = response;
          setActionResponse({type: ERROR, message: error.message});
          setErrorOccured(true);
        }
      });
    }
  }, [action, actionCompletedSuccessfully, clientToken, errorOccured, isUserLoggedIn]);

  const goToPage = useNavigator();

  /**
   * Function to navigate to add new card page
   */
  const gotoNewCardPage = () => {
    goToPage(PROFILE_ADD_CREDIT_CARD);
  };

  const gotoAddAchPaymentPage = () => {
    goToPage(PROFILE_ADD_ACH_PAYMENT);
  };

  return (
    <Styled id="ProfileSavedPayments" css={css}>
      {isUserLoggedIn && (
        <div className="ProfileSavedPayments">
          <div>
            <h1>{headingSavedCreditCards}</h1>
          </div>
          {actionResponse.message && actionResponse.type && (
            <div className="ProfileSavedPayments__ActionResponse">
              <Alert
                id={`ProfileAddCreditCard__Alert-${props.id}`}
                type={actionResponse.type}
                message={actionResponse.message}
              />
            </div>
          )}
          {actionCompletedSuccessfully &&
            (savedPayments.length === 0 ? (
              <div>
                <Card type="primary" className="ProfileSavedPayments__NoSavedCards">
                  <span>{textProfileCardHelper1}</span>
                  <span>{textProfileCardHelper2}</span>
                </Card>
              </div>
            ) : (
              <ul id={`savedCardsList-${id}`} className="ProfileSavedPayments__Items">
                <ProfileSavedPaymentList
                  setActionResponse={setActionResponse}
                  inProgress={inProgress}
                  setInProgress={setInProgress}
                  savedPayments={savedPayments}
                  setSavedPayments={setSavedPayments}
                  {...props}
                />
              </ul>
            ))}
          <div className="ProfileSavedPayments__Footer">
            <button
              id={`addNewCard-${id}`}
              aria-labelledby={`noSavedCards-${id} addNewCard-${id}`}
              type="button"
              onClick={() => gotoNewCardPage()}
            >
              {actionAddNewCard}
            </button>
            {/* <button
              id={`addNewACHPayment-${id}`}
              aria-labelledby={`noSavedCards-${id} addNewACHPayment-${id}`}
              type="button"
              onClick={() => gotoAddAchPaymentPage()}
            >
              {actionAddAchPayment}
            </button> */}
          </div>
        </div>
      )}
    </Styled>
  );
};

/**
 * Displays list of saved cards
 * @param props the required properties
 */
const ProfileSavedPaymentList = props => {
  const savedPayments = props.savedPayments.map(savedPayment => (
    <li key={savedPayment.token} className="ProfileSavedPayments__Item">
      <ProfileSavedPayment {...props} paymentDetails={savedPayment} />
    </li>
  ));

  return savedPayments;
};

export default connect(getPageData)(ProfileSavedPayments);
