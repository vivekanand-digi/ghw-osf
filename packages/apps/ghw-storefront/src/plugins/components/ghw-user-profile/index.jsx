/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";

import CaretDownIcon from "@oracle-cx-commerce/react-components/icons/caret-down";
import { MenuMobileContext } from "@oracle-cx-commerce/react-widgets/common/menu-mobile/context";
import Popover from "@oracle-cx-commerce/react-components/popover";
import PropTypes from "prop-types";
import Styled from "@oracle-cx-commerce/react-components/styled";
import UserIcon from "@oracle-cx-commerce/react-components/icons/user";
import { connect } from "@oracle-cx-commerce/react-components/provider";
import css from "./desktop.css";
import { getAuthenticatedStatus } from "./selectors";
import UserProfileLinksMobile from "./mobile";
import { PAGE_HOME_LINK } from "@oracle-cx-commerce/commerce-utils/constants";
import Link, { useNavigator } from "@oracle-cx-commerce/react-components/link";

const initialModalView = {
  show: false,
};

/**
 * Following User Profile Links Desktop Widget will render the links according to the widget component settings.
 *
 * @param props
 */

const GHWUserProfile = (props) => {
  const { labelUserMenu, currentProfile } = props;
  const [modalView, setModalView] = useState(initialModalView);
  const goToLogin = useNavigator("login");
  const userProfileLinksRef = useRef();

  console.log("is logged?: currentProfile: ", currentProfile);
  const handleClick = useCallback((e) => {
    if (!userProfileLinksRef.current.contains(e.target)) {
      setModalView({
        show: false,
      });
    }
  }, []);

  // Signifies whether the menu sidebar is visible to the user
  const isVisible = useCallback(() => {
    return modalView;
  }, [modalView]);

  function getInitials(firstName, lastName) {
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName ? lastName.charAt(0) : '';    
    return `${firstInitial}${lastInitial}`;
  }
  

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClick);
    // return function to be called when unmounted

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });

  const onUserProfileClick = useCallback(() => {
    if (!currentProfile.firstName) {
      goToLogin();
    } else {
      setModalView((prevModalView) => ({
        show: !prevModalView.show,
      }));
    }
  }, [currentProfile.firstName, goToLogin, setModalView]);

  return (
    <Styled id="GHWUserProfile" css={css}>
      <div
        ref={userProfileLinksRef}
        className="GHWUserProfile"
        onKeyPress={onUserProfileClick}
        onClick={onUserProfileClick}
        role="button"
        tabIndex="0"
        aria-label={labelUserMenu}
      >
        <div>
          <span>
            {currentProfile.firstName ? (
              <div className="GHWUserProfile_FirstName">
                Welcome {currentProfile.firstName.charAt(0).toUpperCase() + currentProfile.firstName.slice(1)} 
                <span className="InitialBox">{getInitials(currentProfile.firstName, currentProfile.lastName)}</span>
              </div>
            ) : (
              <div className="UserProfileLinksDesktop_UserIcon">
                <span className="GHWUserProfile_UserIcon">Account Login</span>
              </div>
            )}
          </span>

          <div>
            <Popover show={modalView.show}>
              {
                <MenuMobileContext.Provider value={{ isVisible }}>
                  <UserProfileLinksMobile {...props} />
                </MenuMobileContext.Provider>
              }
            </Popover>
          </div>
        </div>
      </div>
    </Styled>
  );
};

GHWUserProfile.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  isB2BUser: PropTypes.bool.isRequired,
  isDelegatedAdmin: PropTypes.bool.isRequired,
  anonymousPagesDisplayNameAndURL: PropTypes.string,
  authenticatedPagesDisplayNameAndURL: PropTypes.string,
  delegatedAdminUserDisplayNameAndURL: PropTypes.string,
  b2bAuthenticatedPagesDisplayNameAndURL: PropTypes.string,
  approverUserDisplayNameAndURL: PropTypes.string,
  navigationOrientation: PropTypes.string,
  displayIcons: PropTypes.bool,
  labelUserMenu: PropTypes.string.isRequired,
};

GHWUserProfile.defaultProps = {
  anonymousPagesDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
  authenticatedPagesDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
  delegatedAdminUserDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
  b2bAuthenticatedPagesDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
  approverUserDisplayNameAndURL: "[{'0':'','1':'','2':''}]",
  navigationOrientation: "vertical",
  displayIcons: true,
};
export default connect(getAuthenticatedStatus)(GHWUserProfile);
