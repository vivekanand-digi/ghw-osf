import React from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
import css from "./styles.css";

const GHWProfileLeftNav = (props) => {
  const { route } = props;

  return (
    <Styled id="GHWProfileLeftNav" css={css}>
      <div className="GHWProfileLeftNav">
        <div id="htab1" className="h-tab_content">
          <div className="v-tab">
            <ul className="v-tab_tab-head">
              <li rel="vtab1">
                <a href="/profile" className={route === "/profile" && "active"}>
                  Profile
                </a>
              </li>
              <li rel="vtab2">
                <a
                  href="/address-book"
                  className={
                    (route === "/add-profile-address" ||
                      route === "/address-book" ||
                      route === "/edit-profile-address") &&
                    "active"
                  }
                >
                  Address
                </a>
              </li>{" "}
              <li rel="vtab3">
                <a
                  href="/profile-saved-cards"
                  className={route === "/profile-saved-cards" && "active"}
                >
                  Payment Method
                </a>
              </li>
              <li rel="vtab4">
                <a
                  href="/update-password"
                  className={route === "/update-password" && "active"}
                >
                  Change Password
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default GHWProfileLeftNav;
