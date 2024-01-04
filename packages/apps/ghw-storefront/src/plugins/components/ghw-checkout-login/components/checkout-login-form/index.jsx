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
import css from '@oracle-cx-commerce/react-widgets/checkout/checkout-login/components/checkout-login-form/styles.css';
import {getComponentData} from '@oracle-cx-commerce/react-widgets/checkout/checkout-login/selectors';
import PropTypes from 'prop-types';
import {isOTPVerificationInProgress, isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';

const CheckoutLoginForm = props => {
  //resources
  const {
    id,
    actionCheckout,
    actionCheckoutAsGuest,
    alertLoginSuccessful,
    alertLoginUnSuccessful ='unauth client',
    headingReturningCustomer,
    labelEmailAddress,
    labelPassword,
    textForgottenPassword ='Forgot password link',
    alertEnterVerificationCode,
    setShowVerifyIdentityForm,
    email
  } = props;

  const goToPage = useNavigator();
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const {action, getState} = useContext(StoreContext);

  /**
   * Success callback for the login action
   * On successful login, it navigates to the checkout page.
   */
  const onOk = useCallback(() => {
    const state = getState();
    if (isOTPVerificationInProgress(state) && !isAuthenticated(state)) {
      action('notify', {level: 'info', message: alertEnterVerificationCode});
      setShowVerifyIdentityForm(true);
    } else {
      setLoginErrorMessage('');
      action('notify', {level: 'success', message: alertLoginSuccessful});
      goToPage(PAGE_CHECKOUT_SHIPPING_LINK);
    }
  }, [action, alertLoginSuccessful, getState, goToPage, setShowVerifyIdentityForm, alertEnterVerificationCode]);

  /**
   * Failure callback for the login action
   * Shows the relevant error message
   */
  const onNotOk = useCallback(
    ({error = {}}) => {
      error.code === '500'
        ? action('notify', {level: 'error', message: error.message})
        : setLoginErrorMessage(error.message === 'unauthorized_client' ? alertLoginUnSuccessful : error.message);
    },
    [action, alertLoginUnSuccessful]
  );

  return (
    <Styled id="CheckoutLoginForm" css={css}>
      <div className="contact-info">
          
        <Form action="login" onOk={onOk} onNotOk={onNotOk} setInProgress={setInProgress} noValidate>
        <div className="email-image">
            <img src="/file/general/email-icon.svg" alt="" height="48" />
          </div>
          <div className="form_contact">
            <input type="hidden" name="rememberUserEmail" value="true" />
            {loginErrorMessage && <Alert id="CheckoutLoginForm_Alert" type="error" message={loginErrorMessage}></Alert>}

            {/* Email Address */}
            <div className="form-field">
              <input
                className="form-field__input"
                id={`username-${id}`}
                type="email"
                name="username"
                value={email}
                required
                placeholder="&nbsp;"
              />
              <span className="form-field__label">Email</span>
              <span className="focus-bg validationMessage"></span>
            </div>

            {/* Password */}
            <div className="form-field">
              <input
                className="form-field__input"
                id={`password-${id}`}
                type="password"
                name="password"
                required
                placeholder="&nbsp;"
              />
              <span className="form-field__label">Password</span>
              <span className="focus-bg validationMessage"></span>
            </div>

            {/* Forgot Password */}
            <div className="form-link">
              <Link href={PAGE_RESET_PASSWORD_LINK}>{textForgottenPassword}</Link>
            </div>

            {/* 1. Log in before proceeding to checkout */}
            <div className="form-field action-btn-cnr">
              <button className="loginBtn" type="submit" disabled={inProgress}>
                Login
              </button>
            </div>
          </div>
        </Form>
      </div>
    </Styled>
  );
};

CheckoutLoginForm.propTypes = {
  id: PropTypes.string.isRequired
};

export default connect(getComponentData)(CheckoutLoginForm);
