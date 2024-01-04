import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./styles.css";

const GHWBuyCombos = (props) => {
  return (
    <Styled id="GHWBuyCombos" css={css}>
      <section className="our-combos">
          <h1 className="h1-title">Buy our combos and save</h1>
          <div className="our-info">
            <div className="our-product">
              <div className="blue-combo">
                <div className="title">BLUE COMBO</div>
                <p className="para">
                  Enjoy this combo of savings with 2 bottles of Joint &amp;
                  Muscle support, plus a month's supply of Vitamin D3.
                </p>
              </div>
              <h2 className="name">
                <a href="">BUY AND SAVE</a>
              </h2>
            </div>
            <div className="our-product">
              <div className="yellow-combo">
                <div className="title">YELLOW COMBO</div>
                <p className="para">
                  Sleep well, B energetic and support your immune system!*
                </p>
              </div>
              <h2 className="name yellow">
                <a>BUY AND SAVE</a>
              </h2>
            </div>
            <div className="our-product">
              <div className="green-combo">
                <div className="title">GREEN COMBO</div>
                <p className="para">
                  Digestive health, cellular, whole body support &amp; daily D3*
                </p>
              </div>
              <h2 className="name green">
                <a>BUY AND SAVE</a>
              </h2>
            </div>
          </div>
      </section>
      
    </Styled>
  );
};

export default GHWBuyCombos;
