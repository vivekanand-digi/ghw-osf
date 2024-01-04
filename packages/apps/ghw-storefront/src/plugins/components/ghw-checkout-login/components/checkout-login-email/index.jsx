/*
 ** Copyright (c) 2022 Oracle and/or its affiliates.
 */
import Link, {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {PAGE_CHECKOUT_SHIPPING_LINK, PAGE_RESET_PASSWORD_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import React, {useCallback, useContext, useState} from 'react';

import Alert from '@oracle-cx-commerce/react-components/alert';
import EmailIcon from '@oracle-cx-commerce/react-components/icons/email';
import Form from '@oracle-cx-commerce/react-components/form';
import PasswordIcon from '@oracle-cx-commerce/react-components/icons/password';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {getComponentData} from '@oracle-cx-commerce/react-widgets/checkout/checkout-login/selectors';
import PropTypes from 'prop-types';
import {isOTPVerificationInProgress, isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';
import css from './styles.css';
import CheckoutGuestAccountCreation from '../checkout-guest-account-creation';

const CheckoutEmailFrom = props => {
  //resources
  const {
    id,
    actionCheckout,
    actionCheckoutAsGuest,
    alertLoginSuccessful,
    alertLoginUnSuccessful = 'unauth client',
    headingReturningCustomer,
    labelEmailAddress,
    labelPassword,
    textForgottenPassword = 'Forgot password link',
    alertEnterVerificationCode,
    setShowEmailForm,
    setEmailLogin
  } = props;

  const goToPage = useNavigator();
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const {action, getState} = useContext(StoreContext);
  const [alertMessage, setAlertMessage] = useState('');
  const [email, setEmail] = useState('');

  const onOk = useCallback(
    data => {
      const email = document.querySelector('#guestUeserEmail').value;
      if (data.status === 200) {
        if (data.delta.myRepository.myTable.myProperty.total) {
          if (!data.delta.myRepository.myTable.myProperty.items[0].x_blacklistCustomerProfile) {
            setEmailLogin(email);
            setShowEmailForm(false);
          } else {
            setAlertMessage(
              'We are unable to process your request at this time as your account has been blacklisted. Please contact our customer support for further assistance.'
            );
            window.alert(
              'We are unable to process your request at this time as your account has been blacklisted. Please contact our customer support for further assistance.'
            );
          }
        } else {
          setEmail(email);
        }
      }
    },
    [action, alertLoginSuccessful, getState, goToPage, setShowEmailForm, alertEnterVerificationCode]
  );

  const onNotOk = useCallback(
    ({error = {}}) => {
      error.status === '500'
        ? action('notify', {level: 'error', message: error.message})
        : setLoginErrorMessage(error.message === 'unauthorized_client' ? error.message : error.message);
    },
    [action, alertLoginUnSuccessful]
  );

  return (
    <Styled id="CheckoutEmailFrom" css={css}>
      <div className="contact-info">
        <Form action="accountVerification" onOk={onOk} onNotOk={onNotOk} setInProgress={setInProgress} noValidate>
          <div className="email-image">
            <img src="/file/general/email-icon.svg" alt="" height="48" />
          </div>
          <div className="form_contact">
            {loginErrorMessage && <Alert id="CheckoutLoginForm_Alert" type="error" message={loginErrorMessage}></Alert>}
            <div className="form-field">
              <input
                className="form-field__input"
                id="guestUeserEmail"
                type="email"
                name="email"
                required
                placeholder="&nbsp;"
              />
              <span className="form-field__label">Email Address</span>
              <span className="focus-bg validationMessage"></span>
            </div>
            {email === '' ? (
              <div className="form-field action-btn-cnr">
                <button className="loginBtn" type="submit" disabled={inProgress}>
                  Next
                </button>
              </div>
            ) : null}
          </div>
          {alertMessage && <div className="alertMessage">{alertMessage}</div>}
        </Form>
        {email !== '' ? <CheckoutGuestAccountCreation email={email} /> : null}
      </div>
    </Styled>
  );
};

CheckoutEmailFrom.propTypes = {
  id: PropTypes.string.isRequired
};

export default connect(getComponentData)(CheckoutEmailFrom);
