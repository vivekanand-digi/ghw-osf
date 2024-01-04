/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import MakeInvisible from "./makeinvisible";
import MakeVisible from "./makevisible";

import Alert from "@oracle-cx-commerce/react-components/alert";
import Form from "@oracle-cx-commerce/react-components/form";
import { PAGE_HOME_LINK } from "@oracle-cx-commerce/commerce-utils/constants";
import PropTypes from "prop-types";
import { StoreContext } from "@oracle-cx-commerce/react-ui/contexts";
import Styled from "@oracle-cx-commerce/react-components/styled";
import { connect } from "@oracle-cx-commerce/react-components/provider";
import { fetchCommonResources } from "@oracle-cx-commerce/fetchers/resources";
import { fetchShopperSettings } from "@oracle-cx-commerce/fetchers/merchant-settings";
import { getPageData } from "@oracle-cx-commerce/react-widgets/profile/profile-update-password/selectors";
import { passwordHelpers } from "@oracle-cx-commerce/react-components/utils";
import { useCommonResourcesFetcher } from "@oracle-cx-commerce/fetchers/resources/hooks";
import { useNavigator } from "@oracle-cx-commerce/react-components/link";
import { useShopperSettingsFetcher } from "@oracle-cx-commerce/fetchers/merchant-settings/hooks";
import { validateRequiredField } from "@oracle-cx-commerce/react-components/utils/payment";
import Modal from "@oracle-cx-commerce/react-components/modal";
import css from "./styles.css";
import {formToJson} from '@oracle-cx-commerce/react-components/utils';

import GHWProfileUpdateSuccess from "./components";

/**
 * export fetchers to load common resources & shopper settings (password policies)
 * into the state during server-side rendering.
 */
export const fetchers = [fetchCommonResources, fetchShopperSettings];

/**
 * Displays the password fields to be updated on update password page.
 * @param {*} props - includes labels for update password title and form fields.
 */

const GHWProfileUpdatePassword = (props) => {
  const { openModal = false } = props;
 
  const [updatePasswordStatus, setUpdatePasswordStatus] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const oldPasswordInput = useRef(null);
  const newPasswordInput = useRef(null);
  const newConfirmPasswordInput = useRef(null);
  const goToPage = useNavigator();

  const {
    alertUpdatePasswordSuccessful,
    alertPasswordsDoNotMatch,
    labelConfirmNewPassword,
    labelCurrentPassword,
    labelNewPassword,
    textRequiredField,
  } = props;

  const store = useContext(StoreContext);

  useCommonResourcesFetcher(store);
  useShopperSettingsFetcher(store);

  const { isUserLoggedIn, firstName = "" } = props;
  const { login = "", passwordPolicies, commonResources } = props;
  const { action } = useContext(StoreContext);

  const validators = useMemo(
    () => ({
      oldPassword: (elementValue) =>
        validateRequiredField(elementValue, textRequiredField),
      newPassword: (elementValue) =>
        validateRequiredField(elementValue, textRequiredField),
      newConfirmPassword: (elementValue) =>
        validateRequiredField(elementValue, textRequiredField),
    }),
    [textRequiredField]
  );

  const onCancel = () => {
    setShowConfirmation(false);
    goToPage(PAGE_HOME_LINK);
  };

  const onSuccess = useCallback(() => {    
    setShowConfirmation(true);
    action("notifyClearAll");
    // action("notify", { level: "info", message: alertUpdatePasswordSuccessful });
  }, [action, alertUpdatePasswordSuccessful]);

  const onError = useCallback(({ error: { message = "" } = {} } = {}) => {
    oldPasswordInput.current.value = "";
    newPasswordInput.current.value = "";
    newConfirmPasswordInput.current.value = "";
    setUpdatePasswordStatus((prevState) => ({
      ...prevState,
      type: "error",
      message,
    }));
  }, []);

  const setElementValidity = useCallback(
    (element) => {
      element.setCustomValidity("");
      setUpdatePasswordStatus((prevState) => ({
        ...prevState,
        message: null,
      }));

      const { validity, name, value } = element;

      element.setCustomValidity("");
      const elementValidator = validators[name];

      if (elementValidator) {
        element.setCustomValidity(elementValidator(value));
      }

      if (name === "newPassword" && validity.valid) {
        const password = value;
        const passwordValid = passwordHelpers.validatePassword(
          passwordPolicies,
          { login, password }
        );
        if (!passwordValid) {
          element.setCustomValidity(
            passwordHelpers.getEmbeddedAssistence(
              passwordPolicies,
              commonResources
            )
          );
        }
      }
    },
    [commonResources, login, passwordPolicies, validators]
  );
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleFormSubmit = (event) => {
    if (
      newPasswordInput.current.value &&
      newConfirmPasswordInput.current.value &&
      newPasswordInput.current.value !== newConfirmPasswordInput.current.value
    ) {
      newPasswordInput.current.value = "";
      newConfirmPasswordInput.current.value = "";
      setUpdatePasswordStatus((prevState) => ({
        ...prevState,
        type: "error",
        message: alertPasswordsDoNotMatch,
      }));

      event.preventDefault();
    }
  };

  // const handleConfirmationOk = useCallback(() => {
  //   setShowConfirmation(false);
  //   goToPage(PAGE_PROFILE_LINK);
  // }, [goToPage]);

  const handleConfirmationOk = () => {
    // setOpenModal(true);
    setShowConfirmation(false);
  };

  const cancelSave = () => {
    console.log("cancel");
    window.location.reload();
  };

  const handleUpdatePassword = event => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target;
      const formData = formToJson(form);

    action('updateProfile', formData)
      .then(response => {
        if (response.ok === false) {
          // onNotOk(response);
          console.log("handleUpdatePassword response: onNotOk:",response.error.message)
          onError({ error: { message: response.error.message }});
          // { onError: { message: response.error.message }}
          
        } else {          
          onSuccess()
          // onOk();
          console.log("handleUpdatePassword response: onOk:",response)
        }
        //add pop success
      })
      .catch(() => {
        // onNotOk();
        console.log("handleUpdatePassword response: catch :",response)
      });

    return false;
  };

  return (
    <Styled id="GHWProfileUpdatePassword" css={css}>
      {isUserLoggedIn && firstName && (
        <div className="GHWProfileUpdatePassword">
          <div className="GHWProfileUpdatePassword__Content">
            <Form              
              onSubmit={handleUpdatePassword}
              // onOk={onSuccess}
              // onNotOk={onError}
              enableUnsavedChangesTracking={true}
              setCustomValidity={setElementValidity}
              noValidate={true}
            >
              {updatePasswordStatus.message && (
                <Alert
                  id="GHWProfileUpdatePassword__Alert"
                  type={updatePasswordStatus.type}
                  message={updatePasswordStatus.message}
                />
              )}

              <div className="main-cnr">
                <div className="main-content container-fixed">
                  <div className="contact-detail">
                    <div className="shipping-info">
                      <div className="form_shipping password">
                        <div className="form-field newpassword-visibility">
                          <label
                            htmlFor="oldPassword"
                            className="form-field__label"
                          >
                            {labelCurrentPassword}
                          </label>
                          <input
                            type={showOldPassword ? "text" : "password"}
                            id="oldPassword"
                            name="oldPassword"
                            className="form-field__input"
                            ref={oldPasswordInput}
                            data-testid="oldPassword"
                            defaultValue={null}
                            required
                            placeholder="&nbsp;"
                          />
                          <span
                            className="password-visibility-icon"
                            onClick={togglOldPasswordVisibility}
                          >
                            {showOldPassword ? (
                              <MakeInvisible />
                            ) : (
                              <MakeVisible />
                            )}
                          </span>
                          <span className="validationMessage"></span>
                        </div>

                        <div className="form-field newpassword-visibility">
                          <label
                            htmlFor="newPassword"
                            className="form-field__label"
                          >
                            {labelNewPassword}
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            className="form-field__input"
                            data-testid="newPassword"
                            ref={newPasswordInput}
                            defaultValue={null}
                            placeholder="&nbsp;"
                            required
                          />
                          <span
                            className="password-visibility-icon"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <MakeInvisible /> : <MakeVisible />}
                          </span>
                          <span className="validationMessage"></span>
                        </div>

                        <div className="form-field">
                          <label
                            htmlFor="newConfirmPassword"
                            className="form-field__label"
                          >
                            {labelConfirmNewPassword}
                          </label>
                          <input
                            type="password"
                            id="newConfirmPassword"
                            name="newConfirmPassword"
                            className="form-field__input"
                            data-testid="newConfirmPassword"
                            ref={newConfirmPasswordInput}
                            placeholder="&nbsp;"
                            defaultValue={null}
                            required
                          />
                          <span className="validationMessage"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="btn-cnr">
                    <button
                      type="submit"
                      onClick={handleFormSubmit}
                      data-testid="submitButton"
                      className="btn md primary-btn"
                    >
                      Update
                    </button>
                    <button className="btn md secondary-btn" onClick={cancelSave}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      )}

      {/* {showConfirmation && (
        <div>        */}

          <GHWProfileUpdateSuccess openModal={showConfirmation} onCancel={onCancel} />

          {/* <Modal show={openModal} onClose={onCancel}>
            <div className="confirmation-popup">
              <p>
                Password changed successfully, you would be logged out now.
                Please login again.
              </p>
              <button onClick={handleConfirmationOk}>OK</button>
            </div>
          </Modal> */}


        {/* </div>
      )} */}


      {/* {showConfirmation && (
       <GHWProfileUpdateSuccess openModal={openModal} onCancel={onCancel}/>
      )} */}

      {/* {showConfirmation && (
        <Modal show={openModal} onClose={onCancel}>
          <div className="confirmation-popup">
            <p>
              Password changed successfully, you would be logged out now. Please
              login again.
            </p>
            <button onClick={handleConfirmationOk}>OK</button>
          </div>
        </Modal>
      )} */}
    </Styled>
  );
};

GHWProfileUpdatePassword.propTypes = {
  isUserLoggedIn: PropTypes.bool.isRequired,
  firstName: PropTypes.string.isRequired,
  login: PropTypes.string.isRequired,
  passwordPolicies: PropTypes.shape({
    allowedSymbols: PropTypes.string,
    blockCommonPasswords: PropTypes.bool,
    cannotUsePreviousPasswords: PropTypes.bool,
    cannotUseUsername: PropTypes.bool,
    minPasswordLength: PropTypes.number,
    numberOfPreviousPasswords: PropTypes.number,
    useMinPasswordLength: PropTypes.bool,
    useMixedCase: PropTypes.bool,
    useNumber: PropTypes.bool,
    useSymbol: PropTypes.bool,
  }).isRequired,
  commonResources: PropTypes.objectOf(PropTypes.string).isRequired,
  // Other PropTypes...
};

export default connect(getPageData)(GHWProfileUpdatePassword);
