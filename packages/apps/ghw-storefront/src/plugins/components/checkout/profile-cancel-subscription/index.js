/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext, useState, useEffect} from 'react';

import Alert from '@oracle-cx-commerce/react-components/alert';
import PropTypes from 'prop-types';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {t} from '@oracle-cx-commerce/utils/generic';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {getPageData} from './selectors';
import css from './styles.css';

//constants
const PROFILE_SUBSCRIPTIONS_LIST_PAGE = 'profile-recurring-payment-subscriptions',
  INFO = 'info',
  ERROR = 'error';

/**
 * Component for deleting a saved card
 * @param {object} props the required properties
 */
const ProfileCancelSubscription = props => {
  const {action} = useContext(StoreContext);
  const {id, isUserLoggedIn, orderId} = props;
  const {
    actionConfirm,
    actionCancel,
    alertSubscriptionCancelled,
    headingConfirmCancelSubscription,
    textCancelSubscription,
    textConfirmCancelSubscriptionMessage
  } = props;

  const goToPage = useNavigator();
  const [inProgress, setInProgress] = useState(false);
  // local state to show action result in alert
  const [actionResponse, setActionResponse] = useState({type: '', message: ''});

  /**
   * This method will navigate browser to profile saved card page
   */
  const gotoProfileSubscriptionsPage = () => {
    goToPage(PROFILE_SUBSCRIPTIONS_LIST_PAGE);
  };

  /**
   * This method will trigger action to remove a card.
   * @param {String} token - the saved card token of the card
   * @param {String} savedCardNumber - the saved card number
   */
  const onConfirmProfileCancelSubscription = async orderId => {
    setInProgress(true);
    const response = await action('cancelSubscriptionAction', {orderId});
    if (response.ok) {
      action('notifyClearAll');
      action('notify', {level: INFO, message: t(alertSubscriptionCancelled, {orderId})});
      setInProgress(false);
      gotoProfileSubscriptionsPage();
    } else {
      setActionResponse({type: ERROR, message: response.error.message});
      setInProgress(false);
    }
  };

  return (
    <Styled id="ProfileCancelSubscription" css={css}>
      {isUserLoggedIn && (
        <div className="ProfileCancelSubscription">
          <h1>{headingConfirmCancelSubscription}</h1>
          {actionResponse.message && actionResponse.type && (
            <div className="ProfileCancelSubscription__ActionResponse">
              <Alert
                id={`ProfileCancelSubscription__Alert-${props.id}`}
                type={actionResponse.type}
                message={actionResponse.message}
              />
            </div>
          )}
          <Alert
            id={`ProfileCancelSubscription__Alert-${id}`}
            type={'warning'}
            message={
              <div className="ProfileCancelSubscription__WarnMessageContainer">
                <div className="ProfileCancelSubscription__WarnMessage">{t(textCancelSubscription, {orderId})}</div>
                <div className="ProfileCancelSubscription__WarnMessageHelp">
                  <p>{textConfirmCancelSubscriptionMessage}</p>
                </div>
              </div>
            }
          />
          <div className="ProfileCancelSubscription__ButtonContainer">
            <button
              type="button"
              className="ProfileCancelSubscription__confirmButton"
              aria-label={`${t(textCancelSubscription, {orderId})})} ${textConfirmCancelSubscriptionMessage}`}
              onClick={() => onConfirmProfileCancelSubscription(orderId)}
              disabled={inProgress}
            >
              {actionConfirm}
            </button>
            <button
              type="button"
              className="secondary ProfileCancelSubscription__cancelButton"
              disabled={inProgress}
              onClick={() => gotoProfileSubscriptionsPage()}
            >
              {actionCancel}
            </button>
          </div>
        </div>
      )}
    </Styled>
  );
};

ProfileCancelSubscription.propTypes = {
  /**
   * The unique id for the component
   */
  id: PropTypes.string.isRequired,

  /**
   * Flag to indicate if user is logged in or not
   */
  isUserLoggedIn: PropTypes.bool.isRequired,

  /**
   * orderId of credit/debit card
   */
  orderId: PropTypes.string.isRequired
};

export default connect(getPageData)(ProfileCancelSubscription);
