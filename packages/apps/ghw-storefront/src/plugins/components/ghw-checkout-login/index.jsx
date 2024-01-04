import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {PAGE_CHECKOUT_SHIPPING_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import React, {useState, useEffect, useContext} from 'react';

import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {isOTPVerificationInProgress} from '@oracle-cx-commerce/commerce-utils/selector';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import PropTypes from 'prop-types';
import {getComponentData} from './selectors';
import css from './ghw-checkout-login.css';
import CheckoutLoginForm from './components/checkout-login-form';
import CheckoutEmailFrom from './components/checkout-login-email';
import CheckoutGuestAccountCreation from './components/checkout-guest-account-creation';

const GHWCheckoutLogin = props => {
  const {isUserLoggedIn} = props;
  const goToPage = useNavigator();
  const [showVerifyIdentityForm, setShowVerifyIdentityForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const {getState} = useContext(StoreContext);
  const [email, setEmail] = useState('');

  /**
   * For a logged in user, it will navigate to the checkout page
   */
  useEffect(() => {
    const state = getState();
    if (!showVerifyIdentityForm && isOTPVerificationInProgress(state)) {
      setShowVerifyIdentityForm(true);
    } else if (isUserLoggedIn) {
      goToPage(PAGE_CHECKOUT_SHIPPING_LINK);
    }
  }, [getState, goToPage, isUserLoggedIn, showVerifyIdentityForm]);


  return (
    <Styled id="GHWCheckoutLogin" css={css}>
      <div className="GHWCheckoutLogin checkout-left-panel">
        {!isUserLoggedIn &&
          (showEmailForm ? (
            <CheckoutEmailFrom
              {...props}
              inProgress={inProgress}
              setInProgress={setInProgress}
              showEmailForm={showEmailForm}
              setShowEmailForm={setShowEmailForm}
              setEmailLogin={setEmail}
            />
          ) : (
            <CheckoutLoginForm
              {...props}
              inProgress={inProgress}
              setInProgress={setInProgress}
              showVerifyIdentityForm={showVerifyIdentityForm}
              setShowVerifyIdentityForm={setShowVerifyIdentityForm}
              email={email}
            />
          ))}
      </div>
    </Styled>
  );
};

GHWCheckoutLogin.propTypes = {
  isUserLoggedIn: PropTypes.bool.isRequired
};

export default connect(getComponentData)(GHWCheckoutLogin);
