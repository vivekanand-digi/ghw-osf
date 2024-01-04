/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext} from 'react';

import Badge from '@oracle-cx-commerce/react-components/badge';
import Card from '@oracle-cx-commerce/react-components/card';
import Link from '@oracle-cx-commerce/react-components/link';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {formatCardNumber} from '@oracle-cx-commerce/react-components/utils/payment';
import {getCurrentProfileId, getCurrentSiteId} from '@oracle-cx-commerce/commerce-utils/selector';
import {t} from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';
import {getWidgetInfoEntity} from '../../../../../selectors/braintree-selector';
import {PROFILE_ADD_ACH_PAYMENT} from '../../constants';

//constants
const CONFIRM_DELETE_SAVED_PAYMENT = 'confirm-delete-saved-payment/',
  SUCCESS = 'success',
  ERROR = 'error';

/**
 * UI component for a card.
 * It show basic detail of card like mask car number, name on card expiry date etc.
 * @param {*} props the required properties
 */
const ProfileSavedPayment = props => {
  const {action, getState} = useContext(StoreContext);
  const {
    actionDeleteCard,
    actionView,
    actionMakeDefault,
    alertMarkedDefaultCardPayment,
    alertMarkedDefaultACHPayment,
    alertMarkedDefaultPaypalPayment,
    id,
    labelDeleteCardLink,
    labelMakeDefaultCardLink,
    labelSavedCard,
    textDefaultCard,
    textExpiryDate,
    textACHLast4Digit,
    setSavedPayments
  } = props;

  const {
    email,
    accountHolderName,
    accountType,
    bankName,
    last4,
    venmoUserId,
    imageUrl,
    default: isDefault,
    cardholderName,
    maskedNumber: cardNumber,
    token,
    expirationMonth: expiryMonth = '',
    expirationYear: expiryYear = '',
    cardType = ''
  } = props.paymentDetails;
  const isUSBank = bankName && accountHolderName;
  const state = getState();

  const getSuccessMessage = () => {
    if (isUSBank) {
      return t(alertMarkedDefaultACHPayment, {bankName, last4});
    }

    if (cardNumber && cardType) {
      return t(alertMarkedDefaultCardPayment, {cardType, cardNumber});
    }

    if (email) {
      return t(alertMarkedDefaultPaypalPayment, {email});
    }
  };

  /**
   * This method will trigger update action to make given card as default card
   * @param {String} token - the saved token of the card which is going to be default card
   */
  const onMarkDefaultCard = async token => {
    const payload = {
      basicAuth: getWidgetInfoEntity(state, {entityName: 'basicAuth'}),
      profileId: getCurrentProfileId(state),
      site: getCurrentSiteId(state),
      token
    };

    const setError = response => {
      props.setActionResponse({type: ERROR, message: response.error.message});
      props.setInProgress(false);
    };

    props.setInProgress(true);
    const response = await action('updateSavedPaymentDefault', payload);
    if (response.ok) {
      const {paymentMethods} = response.delta.shopperProfileRepository.profile;
      console.log(response);
      props.setActionResponse({type: SUCCESS, message: getSuccessMessage()});
      props.setInProgress(false);
      setSavedPayments(paymentMethods);
    } else {
      setError(response);
    }
  };

  return (
    <Styled id="ProfileSavedPayment" css={css}>
      <Card className="ProfileSavedPayment">
        <div className="ProfileSavedPayment__ImageContainer">
          <div className="ProfileSavedPayment__PaymentImage">
            <img src={imageUrl} alt="payment method logo"></img>
          </div>
        </div>
        <div className="ProfileSavedPayment__PaymentDetails">
          {!!isUSBank && <span className="ProfileSavedPayment__PaymentText">{accountHolderName}</span>}
          {!!bankName && <span className="ProfileSavedPayment__PaymentText">{bankName}</span>}
          {!!isUSBank && (
            <span className="ProfileSavedPayment__PaymentText">
              {t(textACHLast4Digit, {accountType, last4Digit: last4})}
            </span>
          )}
          {!!email && <span className="ProfileSavedPayment__PaymentText">{email}</span>}
          {!!venmoUserId && <span className="ProfileSavedPayment__PaymentText">{venmoUserId}</span>}
          {!!cardholderName && <span className="ProfileSavedPayment__PaymentText">{cardholderName}</span>}
          {!!cardNumber && !!cardType && (
            <span className="ProfileSavedPayment__PaymentText">{formatCardNumber(cardNumber, cardType)}</span>
          )}
          {!!expiryMonth && !!expiryYear && (
            <span className="ProfileSavedPayment__PaymentText">
              {t(textExpiryDate, {month: expiryMonth, year: expiryYear})}
            </span>
          )}
          <div
            className={`ProfileSavedPayment__PaymentActionsContainer ${
              isUSBank ? 'ProfileSavedPayment__PaymentActionsContainer--hasEdit' : ''
            }`}
          >
            <div className="ProfileSavedPayment__MakeDefaultContainer">
              {isDefault ? (
                <Badge badgeText={textDefaultCard} ariaLabel={textDefaultCard} />
              ) : (
                <>
                  <button
                    type="button"
                    className="ProfileSavedPayment__MakeDefault"
                    onClick={() => onMarkDefaultCard(token)}
                    aria-describedby={`makeDefault-${id}${token}`}
                    disabled={props.inProgress}
                  >
                    {actionMakeDefault}
                  </button>
                  <span className="ProfileSavedPayment__MakeDefault__HelpText" id={`makeDefault-${id}${token}`}>{`${t(
                    labelSavedCard,
                    {
                      paymentMethod: cardNumber || venmoUserId || `PayPal (${email})`
                    }
                  )}${labelMakeDefaultCardLink}`}</span>
                </>
              )}
            </div>
            {!isDefault && (
              <div className="ProfileSavedPayment__DeleteLinkContainer">
                <span
                  aria-label={`${t(labelSavedCard, {
                    paymentMethod: cardNumber || venmoUserId || `PayPal (${email})`
                  })}${isDefault ? ` ${textDefaultCard} ` : ' '}${labelDeleteCardLink}`}
                >
                  <Link href={`${CONFIRM_DELETE_SAVED_PAYMENT}${token}`}>{actionDeleteCard}</Link>
                </span>
              </div>
            )}
            {isUSBank && (
              <div className="ProfileSavedPayment__DeleteLinkContainer">
                <Link href={`${PROFILE_ADD_ACH_PAYMENT}/${token}`}>{actionView}</Link>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Styled>
  );
};

export default ProfileSavedPayment;
