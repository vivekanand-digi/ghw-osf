/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext, useState, useEffect} from 'react';

import Alert from '@oracle-cx-commerce/react-components/alert';
import {PAGE_PROFILE_SAVED_CARDS_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import PropTypes from 'prop-types';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {t} from '@oracle-cx-commerce/utils/generic';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {getPageData} from './selectors';
import css from './styles.css';

//constants
const PROFILE_SAVED_CARDS = PAGE_PROFILE_SAVED_CARDS_LINK,
  PROFILE = 'profile',
  INFO = 'info',
  ERROR = 'error';

/**
 * Component for deleting a saved card
 * @param {object} props the required properties
 */
const ProfileDeleteSavedPayment = props => {
  const {action} = useContext(StoreContext);
  const {
    actionConfirm,
    actionCancel,
    alertPaymentDeleted,
    id,
    isUserLoggedIn,
    savedPaymentId,
    headingConfirmPaymentDeletion,
    textPaymentRemove,
    textConfirmPaymentDeletionMessage
  } = props;

  const [profileSavedPayments, setProfileSavedPayments] = useState([]);

  useEffect(() => {
    action('getShopperProfile').then(rs => {
      if (rs.ok) {
        const {paymentMethods} = rs.delta.shopperProfileRepository.profile;
        setProfileSavedPayments(paymentMethods);
      } else {
        setProfileSavedPayments([]);
      }
    });
  }, [action, savedPaymentId]);

  const goToPage = useNavigator();
  const [inProgress, setInProgress] = useState(false);
  // local state to show action result in alert
  const [actionResponse, setActionResponse] = useState({type: '', message: ''});

  /**
   * This method will navigate browser to profile saved card page
   */
  const gotoProfileSavedCardsPage = () => {
    goToPage(PROFILE_SAVED_CARDS);
  };

  /**
   * This method will navigate browser to profile page
   */
  const gotoProfilPage = () => {
    goToPage(PROFILE);
  };

  /**
   * Get saved card for the given saved card id
   * @param {savedPaymentId} - the saved card id
   */
  const getSavedPaymentDetails = savedPaymentId => {
    if (savedPaymentId) {
      return profileSavedPayments.find(({token}) => token === savedPaymentId);
    }
  };

  /**
   * This method will trigger action to remove a card.
   * @param {String} token - the saved card token of the card
   * @param {String} savedCardNumber - the saved card number
   */
  const onConfirmProfileDeleteSavedPayment = async (token, payment) => {
    setInProgress(true);
    const response = await action('deleteSavedPaymentAction', {token});
    if (response.ok) {
      action('notifyClearAll');
      action('notify', {level: INFO, message: t(alertPaymentDeleted, {payment})});
      setInProgress(false);
      if (getSavedPaymentDetails(savedPaymentId)) gotoProfileSavedCardsPage();
      else gotoProfilPage();
    } else {
      setActionResponse({type: ERROR, message: response.error.message});
      setInProgress(false);
    }
  };

  const savedPaymentDetails = getSavedPaymentDetails(savedPaymentId) || {};
  const payment = savedPaymentDetails.maskedNumber || savedPaymentDetails.email || savedPaymentDetails.bankName;

  return (
    <Styled id="ProfileDeleteSavedPayment" css={css}>
      {isUserLoggedIn && payment && (
        <div className="ProfileDeleteSavedPayment">
          <h1>{headingConfirmPaymentDeletion}</h1>
          {actionResponse.message && actionResponse.type && (
            <div className="ProfileDeleteSavedPayment__ActionResponse">
              <Alert
                id={`ProfileAddCreditCard__Alert-${props.id}`}
                type={actionResponse.type}
                message={actionResponse.message}
              />
            </div>
          )}
          <Alert
            id={`ProfileDeleteSavedPayment__Alert-${id}`}
            type={'warning'}
            message={
              <div className="ProfileDeleteSavedPayment__WarnMessageContainer">
                <div className="ProfileDeleteSavedPayment__WarnMessage">{t(textPaymentRemove, {payment})}</div>
                <div className="ProfileDeleteSavedPayment__WarnMessageHelp">
                  <p>{textConfirmPaymentDeletionMessage}</p>
                </div>
              </div>
            }
          />
          <div className="ProfileDeleteSavedPayment__ButtonContainer">
            <button
              type="button"
              className="ProfileDeleteSavedPayment__confirmButton"
              aria-label={`${t(textPaymentRemove, {payment})})} ${textConfirmPaymentDeletionMessage}`}
              onClick={() => onConfirmProfileDeleteSavedPayment(savedPaymentId, payment)}
              disabled={inProgress}
            >
              {actionConfirm}
            </button>
            <button
              type="button"
              className="secondary ProfileDeleteSavedPayment__cancelButton"
              disabled={inProgress}
              onClick={() => gotoProfileSavedCardsPage()}
            >
              {actionCancel}
            </button>
          </div>
        </div>
      )}
    </Styled>
  );
};

ProfileDeleteSavedPayment.propTypes = {
  /**
   * The unique id for the component
   */
  id: PropTypes.string.isRequired,

  /**
   * Flag to indicate if user is logged in or not
   */
  isUserLoggedIn: PropTypes.bool.isRequired,

  /**
   * savedPaymentId of credit/debit card
   */
  savedPaymentId: PropTypes.string.isRequired
};

export default connect(getPageData)(ProfileDeleteSavedPayment);
