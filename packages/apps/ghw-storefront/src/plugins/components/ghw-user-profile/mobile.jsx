/*
 ** Copyright (c) 2021 Oracle and/or its affiliates.
 */

import Link, {useNavigator} from '@oracle-cx-commerce/react-components/link';
import React, {useContext, useEffect, useState} from 'react';

import BuildingIcon from '@oracle-cx-commerce/react-components/icons/building';
import CheckIcon from '@oracle-cx-commerce/react-components/icons/check';
import ClipboardCheckIcon from '@oracle-cx-commerce/react-components/icons/clipboard-check';
import ClipboardListIcon from '@oracle-cx-commerce/react-components/icons/list-alt';
import CrownIcon from '@oracle-cx-commerce/react-components/icons/crown';
import Contact from '@oracle-cx-commerce/react-components/icons/contact';
import CreateAccountIcon from '@oracle-cx-commerce/react-components/icons/create-account';
import CreditCardIcon from '@oracle-cx-commerce/react-components/icons/credit-card';
import EmailIcon from '@oracle-cx-commerce/react-components/icons/email';
import HistoryIcon from '@oracle-cx-commerce/react-components/icons/history';
import HomeIcon from '@oracle-cx-commerce/react-components/icons/home';
import LogoutIcon from '@oracle-cx-commerce/react-components/icons/logout';
import {MenuMobileContext} from '@oracle-cx-commerce/react-widgets/common/menu-mobile/context';
import {PAGE_HOME_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import PasswordIcon from '@oracle-cx-commerce/react-components/icons/password';
import PropTypes from 'prop-types';
import {REDIRECT_TO_HOME_PAGEURLS} from './customconfig';
import SchedulerIcon from '@oracle-cx-commerce/react-components/icons/scheduler';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import UserCheckIcon from '@oracle-cx-commerce/react-components/icons/user-check';
import UserIcon from '@oracle-cx-commerce/react-components/icons/user';
import WishListIcon from '@oracle-cx-commerce/react-components/icons/wish-list';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import css from './mobile.css';
import {getAuthenticatedStatus} from './selectors';
import {getPage} from '@oracle-cx-commerce/commerce-utils/selector';
import {noop} from '@oracle-cx-commerce/utils/generic';
import {getPageId} from '@oracle-cx-commerce/utils/isomorphic';
import {OPENID_STATE} from '@oracle-cx-commerce/commerce-utils/constants/session';
import {isCurrentCatalogDefault} from '@oracle-cx-commerce/commerce-utils/selector';

/*
 ** Copyright (c) 2019 Oracle and/or its affiliates.
 */

/* Mapping the icons for each link
     TODO: This will be removed when multi key value pair configuration accepts Media Type*/
const iconsMapping = {
  textAddressBook: HomeIcon,
  textAccountAddressBook: BuildingIcon,
  textEmailPreferences: EmailIcon,
  textLogout: LogoutIcon,
  textMyAccount: UserIcon,
  textOrderHistory: HistoryIcon,
  textSavedCreditCards: CreditCardIcon,
  textWishLists: WishListIcon,
  textLogIn: UserIcon,
  textUpdatePassword: PasswordIcon,
  textCreateAnAccount: CreateAccountIcon,
  textScheduledOrders: SchedulerIcon,
  textAccountContacts: Contact,
  textOrderApprovalSettings: ClipboardCheckIcon,
  textOrdersPendingApproval: CheckIcon,
  textRegistrationReuests: UserCheckIcon,
  textPurchaseLists: ClipboardListIcon,
  labelLoyaltyDetails: CrownIcon
};

/* Accepts the link text snippet key and fetches the icons from Icon Mapping
       Returns the Icon If available */
const DisplayIcon = props => {
  const {linktextkey, navigationOrientation} = props;
  const NewIcon = iconsMapping[linktextkey];
  const iconClassName = NewIcon ? `UserProfileLinks__${NewIcon.name}` : '';

  return (
    <React.Fragment>
      {NewIcon || navigationOrientation === 'vertical' ? (
        <span className="UserProfileLinks__Icon">{NewIcon && <NewIcon className={iconClassName} />}</span>
      ) : null}
    </React.Fragment>
  );
};

/* Returns Icon if display icons selected
    and returns Text associated with the link text snippet Key*/
const IconAndLinkText = props => {
  const {linktextkey, displayIcons = true, navigationOrientation = 'vertical'} = props;

  return (
    <React.Fragment>
      {displayIcons && <DisplayIcon linktextkey={linktextkey} navigationOrientation={navigationOrientation} />}
      <span className="UserProfileLinks__LinkName">{props[linktextkey] || linktextkey}</span>
    </React.Fragment>
  );
};

/* Returns Each Profile Link Item based on the list map received 
     Adds the Logout action for text logout key*/
const ProfileLinks = props => {
  const {linkslist, isB2BUser, isOpenIdLogin} = props;
  const {isVisible = noop, index, toggleMenu = noop} = useContext(MenuMobileContext) || {};
  const {action, getState} = useContext(StoreContext);
  const goToHome = useNavigator(PAGE_HOME_LINK);
  const goToPage = useNavigator();

  const logoutFromIdp = () => {
    // Retrieves IDP logout URL using 'getOpenIDLogoutRequest' endpoint
    action('getOpenIDLogoutRequest')
      .then(response => {
        if (response.ok === true && response.json) {
          const {json = {}} = response;
          if (json.openid_logout_request_dst) {
            // Set the relayState property here
            // This is will added as a query param to OSF base URL on redirection from IDP on logout
            // If the logout is done on authenticated pages, it will be navigated to home
            let relayState = getPageId(new URL(location.href));
            const {secured = false, pageType, pageId = ''} = getPage(getState());
            if (secured || isB2BUser || REDIRECT_TO_HOME_PAGEURLS.includes(pageType)) {
              relayState = relayState.replace(pageId, `/${PAGE_HOME_LINK}`);
            }
            const idpLogoutUrl = `${json.openid_logout_request_dst}&${OPENID_STATE}=${relayState}`;
            goToPage(idpLogoutUrl);
          }
        }
      })
      .catch(error => {
        // Handle exception
        action('notify', {level: 'error', message: error.message});
      });
  };

  /* Logs out the user and closes the menu.
     If the logout is done on authenticated pages, it will be navigated to home*/
  const logout = () => {
    if (isOpenIdLogin) {
      // If the login type is Open ID, triggers OpenID logout flow
      logoutFromIdp();
    } else {
      const reloadCatalogData = !isCurrentCatalogDefault(getState());
      action('logout').then(response => {
        toggleMenu(false);
        const {secured = false, pageType} = getPage(getState());
        if (response.ok === true && (secured || isB2BUser || REDIRECT_TO_HOME_PAGEURLS.includes(pageType))) {
          if (reloadCatalogData) {
            // hard redirect to reload catalog and other data upon logout. 
            location.assign(PAGE_HOME_LINK);
          } else {
            goToHome();
          }
        } else {
          goToHome();
        }
        
      });
    }
  };

  return linkslist.map(item => {
    if (item['0'] === 'textLogout') {
      return (
        <button
          type="button"
          className="UserProfileLinks__ProfileLink--Logout"
          tabIndex={isVisible(index) ? 0 : -1}
          onClick={logout}
          key={item['0']}
        >
          <IconAndLinkText linktextkey={item['0']} {...props} />
        </button>
      );
    }

    return (
      <Link
        key={item['0']}
        href={item['1']}
        className="UserProfileLinks__ProfileLink"
        tabIndex={isVisible(index) ? 0 : -1}
        onClick={() => toggleMenu(false)}
      >
        <IconAndLinkText linktextkey={item['0']} {...props} />
      </Link>
    );
  });
};

/**
 * Following User Profile Links Widget will render the links according to the widget component settings.
 *
 * @param props
 */

const UserProfileLinksMobile = props => {
  const {
    anonymousPagesDisplayNameAndURL = '[]',
    authenticatedPagesDisplayNameAndURL = '[]',
    delegatedAdminUserDisplayNameAndURL = '[]',
    b2bAuthenticatedPagesDisplayNameAndURL = '[]',
    approverAndAdminUserDisplayNameAndUrl = '[]',
    approverUserDisplayNameAndURL = '[]',
    navigationOrientation = 'vertical',
    isDelegatedAdmin,
    isApprover,
    isB2BUser
  } = props;

  const nonAuthenticatedLinks = JSON.parse(anonymousPagesDisplayNameAndURL.replace(/'/g, '"'));
  const authenticatedLinks = JSON.parse(authenticatedPagesDisplayNameAndURL.replace(/'/g, '"'));
  const delegatedAdminLinks = JSON.parse(delegatedAdminUserDisplayNameAndURL.replace(/'/g, '"'));
  const b2bAuthenticatedLinks = JSON.parse(b2bAuthenticatedPagesDisplayNameAndURL.replace(/'/g, '"'));
  const approverLinks = JSON.parse(approverUserDisplayNameAndURL.replace(/'/g, '"'));
  const approverAndDelegatedAdminLinks =
    approverAndAdminUserDisplayNameAndUrl !== null
      ? JSON.parse(approverAndAdminUserDisplayNameAndUrl.replace(/'/g, '"'))
      : [];
  const [isAuthentictaed, setIsAuthentictaed] = useState(false);

  useEffect(() => {
    setIsAuthentictaed(props.authenticated);
  }, [props.authenticated]);

  /* Handles of displaying Authenticated or Non Authenticated Links Based on User logged in status*/

  return (
    <Styled id="UserProfileLinksMobile" css={css}>      
      <div
        className={
          navigationOrientation === 'horizontal' ? 'UserProfileLinks__HorizontalDiv' : 'UserProfileLinks__VerticalDiv'
        }
      >
        {(() => {
          if (!isAuthentictaed) {
            <div>is not Authentictaed</div>
            console.log("isAuthentictaed result:", isAuthentictaed);
            return <ProfileLinks linkslist={nonAuthenticatedLinks} {...props} />;
          }
          if (!isB2BUser) {
            return <ProfileLinks linkslist={authenticatedLinks} {...props} />;
          }
          if (isDelegatedAdmin && isApprover) {
            return <ProfileLinks linkslist={approverAndDelegatedAdminLinks} {...props} />;
          }
          if (isDelegatedAdmin) {
            return <ProfileLinks linkslist={delegatedAdminLinks} {...props} />;
          }
          if (isApprover) {
            return <ProfileLinks linkslist={approverLinks} {...props} />;
          }

          return <ProfileLinks linkslist={b2bAuthenticatedLinks} {...props} />;
        })()}
      </div>
    </Styled>
  );
};

UserProfileLinksMobile.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  isB2BUser: PropTypes.bool.isRequired,
  isDelegatedAdmin: PropTypes.bool.isRequired,
  anonymousPagesDisplayNameAndURL: PropTypes.string,
  authenticatedPagesDisplayNameAndURL: PropTypes.string,
  delegatedAdminUserDisplayNameAndURL: PropTypes.string,
  b2bAuthenticatedPagesDisplayNameAndURL: PropTypes.string,
  approverUserDisplayNameAndURL: PropTypes.string,
  navigationOrientation: PropTypes.string,
  displayIcons: PropTypes.bool
};

UserProfileLinksMobile.defaultProps = {
  anonymousPagesDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
  authenticatedPagesDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
  delegatedAdminUserDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
  b2bAuthenticatedPagesDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
  approverUserDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
  navigationOrientation: 'vertical',
  displayIcons: true
};

export default connect(getAuthenticatedStatus)(UserProfileLinksMobile);
