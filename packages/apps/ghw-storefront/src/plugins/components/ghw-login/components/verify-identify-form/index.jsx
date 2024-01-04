/*
 ** Copyright (c) 2022 Oracle and/or its affiliates.
 */
import React, {useCallback, useContext, useState, useEffect} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import Alert from '@oracle-cx-commerce/react-components/alert';
import css from './styles.css';
import Form from '@oracle-cx-commerce/react-components/form';
import KeyIcon from '@oracle-cx-commerce/react-components/icons/key';
import Checkbox from '@oracle-cx-commerce/react-components/checkbox';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {getSessionContext, isOTPVerificationInProgress} from '@oracle-cx-commerce/commerce-utils/selector';
import {getDeviceFingerprint} from '@oracle-cx-commerce/react-widgets/utils';
import {VALIDATION_TOKEN_KEY} from '@oracle-cx-commerce/commerce-utils/constants/session';

const VerifyIdentityForm = props => {
  const {
    id,
    headingVerifyIdentity,
    textVerificationCode,
    textResendVerificationCode,
    textRememberThisDevice,
    buttonSubmit,
    inProgress,
    setInProgress,
    textAccountWithNoContractError,
    alertLoginOTPIncorrect,
    alertLoginUnsuccessful,
    alertResendOTP,
    setShowVerifyIdentityForm,
    actionBackToLogin
  } = props;

  const [verifyIdentityErrorMessage, setVerifyIdentityErrorMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const {action, getState} = useContext(StoreContext);
  const {validationToken} = getSessionContext(getState());
  const [rememberThisDeviceChecked, setRememberThisDeviceChecked] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState('');

  /**
   * login action success callback
   */
  const onOk = useCallback(() => {}, []);

  /**
   * login action failure callback
   */
  const onNotOk = useCallback(
    ({error = {}}) => {
      if (error.code === 500) {
        action('notify', {level: 'error', message: error.message});
      } else if (error.errorCode === '60011') {
        setVerifyIdentityErrorMessage(textAccountWithNoContractError);
      } else if (!isOTPVerificationInProgress(getState())) {
        setShowVerifyIdentityForm(false);
        action('notify', {level: 'info', message: alertLoginUnsuccessful});
      } else {
        setVerifyIdentityErrorMessage(error.message === 'unauthorized_client' ? alertLoginOTPIncorrect : error.message);
      }
    },
    [
      getState,
      action,
      textAccountWithNoContractError,
      setShowVerifyIdentityForm,
      alertLoginOTPIncorrect,
      alertLoginUnsuccessful
    ]
  );

  const handleResendVerificationCode = useCallback(() => {
    const payload = {
      [VALIDATION_TOKEN_KEY]: validationToken
    };
    action('sendVerificationCode', payload).then(response => {
      response.ok ? action('notify', {level: 'info', message: alertResendOTP}) : onNotOk(response);
    });
  }, [action, alertResendOTP, onNotOk, validationToken]);

  const handleRememberThisDeviceClicked = () => setRememberThisDeviceChecked(!rememberThisDeviceChecked);

  const handleBackToLoginClick = () => {
    action('clearValidationTokenInfo');
    setShowVerifyIdentityForm(false);
  };

  const handleVerificationCodeInput = e => {
    const allowNumbersOnlyRegex = /^[0-9]*$/;
    const trimmedVerificationCode = e.target.value.trim();
    if (e.target.value === '' || allowNumbersOnlyRegex.test(trimmedVerificationCode)) {
      setVerificationCode(trimmedVerificationCode);
    }
  };

  useEffect(() => {
    if (rememberThisDeviceChecked) getDeviceFingerprint().then(result => setDeviceFingerprint(result));
    else setDeviceFingerprint('');
  }, [rememberThisDeviceChecked]);

  return (
    <Styled id="VerifyIdentityForm" css={css}>
      <div className="VerifyIdentity">
        <h1>{headingVerifyIdentity}</h1>
        <Form action="login" onOk={onOk} onNotOk={onNotOk} setInProgress={setInProgress} noValidate>
          <input type="hidden" name="rememberUserEmail" value="true" />
          {validationToken && <input type="hidden" name="validationToken" value={validationToken} />}
          {verifyIdentityErrorMessage && (
            <Alert id="VerifyIdentity__Alert" type="error" message={verifyIdentityErrorMessage} />
          )}
          <div>
            <label htmlFor={`VerificationCode-${id}`}>{textVerificationCode}</label>
            <div className="VerifyIdentity__VerificationCodeField">
              <KeyIcon className="VerifyIdentity__KeyIcon" />
              <input
                id={`VerificationCode-${id}`}
                name="VerificationCode"
                inputMode="numeric"
                value={verificationCode}
                onChange={handleVerificationCodeInput}
                required
              />
              <span className="validationMessage"></span>
            </div>
          </div>
          <div className="VerifyIdentity__ResendVerificationCode">
            <button type="button" onClick={handleResendVerificationCode}>
              {textResendVerificationCode}
            </button>
          </div>
          <div className="VerifyIdentity__RememberThisDeviceSelector">
            <Checkbox
              labelText={textRememberThisDevice}
              id={`rememberThisDevice-${id}`}
              name="rememberThisDevice"
              defaultChecked={false}
              onChange={handleRememberThisDeviceClicked}
            />
            {rememberThisDeviceChecked && <input type="hidden" name="deviceFingerprint" value={deviceFingerprint} />}
          </div>
          <div>
            <button type="submit" disabled={inProgress}>
              {buttonSubmit}
            </button>
          </div>
        </Form>
        {/* Go Back to Login Form */}
        <button className="secondary" type="button" onClick={handleBackToLoginClick}>
          {actionBackToLogin}
        </button>
      </div>
    </Styled>
  );
};

export default VerifyIdentityForm;
