/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback, useContext, useState} from 'react';
import Alert from '@oracle-cx-commerce/react-components/alert';
import EmailIcon from '@oracle-cx-commerce/react-components/icons/email';
import Form from '@oracle-cx-commerce/react-components/form';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import css from './reset-password.css';
import {isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';

/**
 * Displays a Form with email field to request for resetting password.
 * @param {*} props - includes labels of the input fields.
 */

const GHWProfileResetPassword = props => {
  const store = useContext(StoreContext);
  const {action} = store;

  const {
    id,
    labelEmail,
    textPasswordResetHelper,
    headingResetPassword,
    alertResetPasswordFailure,
    alertResetPasswordSuccessful,
    buttonResendPasswordRequest,
    buttonSubmit
  } = props;

  const [inProgress, setInProgress] = useState(false);
  const [username, setUsername] = useState('');
  const [resetPasswordStatus, setResetPasswordStatus] = useState('');
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');

  /**
   * success callback of reset password request.
   */

  const onOk = useCallback(() => {
    setResetPasswordStatus('info');
    setResetPasswordMessage(alertResetPasswordSuccessful);
  }, [alertResetPasswordSuccessful]);

  /**
   * failure callback of reset password request.
   */

  const onNotOk = useCallback(
    ({error}) => {
      setResetPasswordStatus('error');
      error.code === '500'
        ? action('notify', {level: 'error', message: error.message})
        : setResetPasswordMessage(alertResetPasswordFailure);
    },
    [action, alertResetPasswordFailure]
  );

  function resendRequestAction() {
    store
      .action('resetPassword', {
        login: username
      })
      .then(response => {
        if (response.ok === false) {
          onNotOk(response);
        } else {
          onOk(response);
        }
      });
  }

  /**
   * method to store the username in component state.
   * username value is needed for re sending reset password request in case of failure.
   */

  function handleUsername(event) {
    const {value} = event.target;
    setUsername(value);
  }

  /**
   * method to display the request reset password status.
   * if there is a failure, displays a button to resend the request.
   */
  const ResetRequestSubmittedContent = () => {
    return (
      <React.Fragment>
        <Alert id="GHWProfileResetPassword__Alert" type={resetPasswordStatus} message={resetPasswordMessage} />
        {resetPasswordStatus === 'error' && (
          <div>
            <button type="button" onClick={resendRequestAction}>
              {buttonResendPasswordRequest}
            </button>
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <Styled id="GHWProfileResetPassword" css={css}>
      <div className="main-cnr">
        <div className="login-section container-fixed">
          <div id="loginpage" className="login-form-cnr">
            <div className="left-sect">
              <a href="/home" className='logo-login'>
                <img src="/file/general/omegaxl-logo-svg.svg" alt="" className="option1" />
                </a>
            </div>
            <div className="right-sect">
                  <div className="form-panel">
                    <div className="logo-header option1">
                    <h1 className="w-title" aria-label={headingResetPassword}>{headingResetPassword}</h1>
                    <p aria-label={textPasswordResetHelper}>{textPasswordResetHelper}</p>
                  </div>
                  
                  {resetPasswordStatus ? (
                    <ResetRequestSubmittedContent />
                  ) : (
                    <Form action="resetPassword" onOk={onOk} onNotOk={onNotOk} setInProgress={setInProgress} noValidate>
                      {/* <p aria-label={textPasswordResetHelper}>{textPasswordResetHelper}</p> */}

                        
                        <div className="form-field">
                          {/* <EmailIcon className="GHWProfileResetPassword__EmailIcon" /> */}
                          <input
                            id={`login-${id}`}
                            type="email"
                            name="login" placeholder="&nbsp;"
                            aria-label={labelEmail}
                            required
                            onChange={handleUsername}
                            className='form-field__input' 
                            />
                          <label htmlFor={`login-${id}`} className="form-field__label">{labelEmail}</label>
                          <span className="focus-bg"></span>
                          <span className="validationMessage"></span>
                        </div>

                      <div className='btn-cnr'>
                        <button type="submit" disabled={inProgress || !username} className='btn primary-btn md-custom'>
                          {buttonSubmit}
                        </button>
                      </div>
                    </Form>
                  )}
                   
                  </div>
                 
              </div>
            
          </div>
        </div>
      </div>
      
    </Styled>
  );
};

export default connect(isAuthenticated)(GHWProfileResetPassword);
