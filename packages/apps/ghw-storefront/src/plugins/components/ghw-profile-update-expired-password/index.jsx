/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, { useCallback, useContext, useEffect, useState } from "react";

import Alert from "@oracle-cx-commerce/react-components/alert";
import EmailIcon from "@oracle-cx-commerce/react-components/icons/email";
import Form from "@oracle-cx-commerce/react-components/form";
import { PAGE_HOME_LINK } from "@oracle-cx-commerce/commerce-utils/constants";
import PasswordIcon from "@oracle-cx-commerce/react-components/icons/password";
import { StoreContext } from "@oracle-cx-commerce/react-ui/contexts";
import Styled from "@oracle-cx-commerce/react-components/styled";
import { connect } from "@oracle-cx-commerce/react-components/provider";
import css from "./styles.css";
import { fetchCommonResources } from "@oracle-cx-commerce/fetchers/resources";
import { fetchShopperSettings } from "@oracle-cx-commerce/fetchers/merchant-settings";
import { getPageData } from "./selectors";
import { passwordHelpers } from "@oracle-cx-commerce/react-components/utils";
import { useCommonResourcesFetcher } from "@oracle-cx-commerce/fetchers/resources/hooks";
import { useNavigator } from "@oracle-cx-commerce/react-components/link";
import { useShopperSettingsFetcher } from "@oracle-cx-commerce/fetchers/merchant-settings/hooks";

/**
 * export fetchers to load common resources & shopper settings (password policies)
 * into the state during server-side rendering.
 */
export const fetchers = [fetchCommonResources, fetchShopperSettings];

/**
 * Displays a Form to create or set the password.
 * @param {*} props - includes labels of the input fields.
 */

const GHWProfileUpdateExpiredPassword = (props) => {
  const store = useContext(StoreContext);

  const {
    id,
    buttonContinue,
    labelEmailAddress,
    labelConfirmNewPassword,
    labelNewPassword,
    HeadingNewPassword,
    alertPasswordNotMatched,
    buttonSubmit,
    alertUpdateExpiredPasswordFailure,
    alertUpdatePasswordSuccessful,
  } = props;

  /**
   * invoke fetcher hook to load common resources & shopper settings (password policies)
   * into state during client side rendering
   * this will not perform any task if state already has these details
   * This is effective if SSR didn't populate the state with these details
   */
  useCommonResourcesFetcher(store);
  useShopperSettingsFetcher(store);

  const goToHome = useNavigator(PAGE_HOME_LINK);
  const { action } = store;
  const [tokenStatus, setTokenStatus] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [resetPasswordStatus, setResetPasswordStatus] = useState("");
  const [resetPasswordMessage, setResetPasswordMessage] = useState("");
  const [values, setValues] = useState({
    login: "",
    password: "",
  });
  const [token, setToken] = useState("");

  // eslint-disable-next-line spellcheck/spell-checker
  /**
   * Listens to the page url parameters change.
   * If the url paramteres has occsAuthToken, gets the value and decode the token.
   * Validates the token and updates the component state with token status.
   */

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let tokenValue;
    if (searchParams.has("occsAuthToken")) {
      tokenValue = decodeURIComponent(searchParams.get("occsAuthToken"));
    }
    if (tokenValue) {
      setToken(tokenValue);
      const payload = {
        op: "validateToken",
        token: tokenValue,
      };
      store.action("updateExpiredPassword", payload).then((response) => {
        if (response.ok === false) {
          setTokenStatus("invalid");
        } else {
          setTokenStatus("valid");
        }
      });
    }
  }, [store]);

  /**
   * success callback of reset password.
   */
  const onOk = useCallback(() => {
    setFormSubmitted(true);
    setResetPasswordStatus("success");
    setResetPasswordMessage(alertUpdatePasswordSuccessful);
  }, [alertUpdatePasswordSuccessful]);

  /**
   * failure callback of reset password.
   */
  const onNotOk = useCallback(
    ({ error }) => {
      setFormSubmitted(true);
      setResetPasswordStatus("error");
      error.code === "500"
        ? action("notify", { level: "error", message: error.message })
        : setResetPasswordMessage(alertUpdateExpiredPasswordFailure);
    },
    [action, alertUpdateExpiredPasswordFailure]
  );

  /**
   * method to get the password policies using passwordHelpers utility js.
   */
  function getEmbeddedAssistance() {
    const policies = props.passwordPolicies;
    const embeddedAssistance = passwordHelpers.getEmbeddedAssistence(
      policies,
      props.commonResources
    );

    return embeddedAssistance;
  }

  /**
   * method to set the custom element validate message.
   */
  function setElementValidity(element) {
    const { validity, name, value } = element;
    if (name === "login" || name === "password" || name === "confirmPassword") {
      setValues((values) => ({ ...values, [name]: value }));
    }

    if ((name === "password" || name === "confirmPassword") && validity.valid) {
      const { login } = values;
      const password = value;
      const policies = props.passwordPolicies;
      const passwordValid = passwordHelpers.validatePassword(policies, {
        login,
        password,
      });
      if (!passwordValid) {
        element.setCustomValidity(getEmbeddedAssistance());
      }
    }

    if (name === "confirmPassword" && validity.valid) {
      if (values.password && value && values.password !== value) {
        element.setCustomValidity(alertPasswordNotMatched);
      }
    }
  }

  /**
   * method to navigate to home page
   */
  const navigateToHomePage = () => {
    goToHome();
  };

  /**
   * Displays the password submitted status information
   */
  const getPasswordSubmittedInfo = () => {
    return (
      <div className="ProfileUpdateExpiredPassword__StatusMessage">
        <Alert
          id="ProfileUpdateExpiredPassword__Alert"
          type={resetPasswordStatus}
          message={resetPasswordMessage}
        />
        <button type="button" onClick={navigateToHomePage}>
          {buttonContinue}
        </button>
      </div>
    );
  };

  /**
   * Displays the password reset token failure information
   */
  const getPasswordUpdateTokenFailure = () => {
    return (
      <div className="ProfileUpdateExpiredPassword__StatusMessage">
        <Alert
          id="ProfileUpdateExpiredPassword__Alert"
          type="error"
          message={alertUpdateExpiredPasswordFailure}
        />
        <button
          type="button"
          onClick={navigateToHomePage}
          aria-label={buttonContinue}
        >
          {buttonContinue}
        </button>
      </div>
    );
  };

  /**
   * Displays the form to reset the password.
   */
  const getPasswordResetForm = () => {
    return (
      <div className="ProfileUpdateExpiredPassword__InputFields">
        <Form
          action="updateExpiredPassword"
          onOk={onOk}
          onNotOk={onNotOk}
          setInProgress={setInProgress}
          setCustomValidity={setElementValidity}
          noValidate
        >
          <input type="hidden" name="token" value={token} />

          <div className="ProfileUpdateExpiredPassword__Email form-field">
            
              {/* <EmailIcon className="ProfileUpdateExpiredPassword__EmailIcon" /> */}
            <input type="email" name="login" id={`login-${id}`}  required placeholder="&nbsp;" className='form-field__input' />
            <label htmlFor={`login-${id}`} className="form-field__label">{labelEmailAddress}</label>
            <span className="focus-bg"></span>
              <span className="validationMessage"></span>
            
          </div>

          <div className="form-field">
          <input
                type="password"
                name="password"
                id={`password-${id}`}
                required  placeholder="&nbsp;" className='form-field__input'
              />
            <label htmlFor={`password-${id}`} className="form-field__label">{labelNewPassword}</label>
            <span className="focus-bg"></span>
              <span className="validationMessage"></span>
          </div>

          <div className="form-field">
          <input
                type="password"
                name="confirmPassword"
                id={`confirmPassword-${id}`}
              required
              placeholder="&nbsp;" className='form-field__input'
              />
            <label htmlFor={`confirmPassword-${id}`} className="form-field__label">
              {labelConfirmNewPassword}
            </label>
              {/* <PasswordIcon className="ProfileUpdateExpiredPassword__PasswordIcon" /> */}
             
              <span className="focus-bg"></span>
              <span className="validationMessage"></span>
          </div>
          <div className='btn-cnr'>
          <button type="submit" disabled={inProgress}>
            {buttonSubmit}
            </button>
            </div>
        </Form>
      </div>
    );
  };

  /**
   * Renders the appropriate content based on the component state.
   * If Token is invalid
   *    Displays TokenFailure Content
   * If Token is Valid
   *    And Form is not submitted, Displays Reset Password Form
   * If Token is Valid
   *    And Form is Submitted, Displays password submitted status
   */

  const getPasswordResetContent = () => {
    if (tokenStatus !== "invalid") {
      if (formSubmitted === false) {
        return getPasswordResetForm();
      }

      return getPasswordSubmittedInfo();
    }

    return getPasswordUpdateTokenFailure();
  };

  return (
    <Styled id="GHWProfileUpdateExpiredPassword" css={css}>
      <div className="main-cnr">
        <div className="login-section container-fixed">
          <div id="loginpage" className="login-form-cnr">
            <div className="left-sect">
              <a href="/home" className="logo-login">
                <img
                  src="/file/general/omegaxl-logo-svg.svg"
                  alt=""
                  className="option1"
                />
              </a>
            </div>
            <div className="right-sect GHWProfileUpdateExpiredPassword">
              <div className='form-panel'>
                <div className='logo-header'>
                  <h1 className="w-title">Reset Password</h1>
                  </div>
                {getPasswordResetContent()}
                </div>
                
            </div>
          </div>
        </div>
      </div>
      {/* <div className="GHWProfileUpdateExpiredPassword">
        <h1>{HeadingNewPassword}</h1>
        {getPasswordResetContent()}
      </div> */}
    </Styled>
  );
};

export default connect(getPageData)(GHWProfileUpdateExpiredPassword);
