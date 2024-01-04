import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./styles.css";

const GHWNavLogin = (props) => {
  return (
    <Styled id="GHWNavLogin" css={css}>

      <div className="lang-login-cnr">
          <div className="lang-cnr">
            <img src="/file/general/eng-lang.svg" alt="Language English" className="lang-icon" />
            <span className="lang-title">English</span>
          </div>
      </div>
    </Styled>
  );
};

export default GHWNavLogin;
