import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./styles.css";

const GHWOmegaxlDifference = (props) => {
  return (
    <Styled id="GHWOmegaxlDifference" css={css}>
      <section className="diffrence container-fixed section-home">
        <div className="title h1-title">THE OmegaXL DIFFERENCE</div>
        <div className="table-content">
          <table>
            <tbody>
              <tr>
                <th className="title">OmegaXL</th>
                <th>OmegaXL Soft Gels </th>
                <th>Fish Oil (1,000mg capsules) </th>
              </tr>
              <tr>
                <td>Small, easy-to-swallow soft-gel </td>
                <td>
                  <img src="file/general/diffrences-tick-mark.png" alt="" />
                </td>
                <td>
                  <img src="/file/general/diffrences-cancel-mark.svg" alt="" />
                </td>
              </tr>
              <tr>
                <td>Produced from the pristine waters of New Zealand </td>
                <td>
                  <img src="file/general/diffrences-tick-mark.png" alt="" />
                </td>
                <td>
                  <img src="/file/general/diffrences-cancel-mark.svg" alt="" />
                </td>
              </tr>
              <tr>
                <td>No fishy aftertaste </td>
                <td>
                  <img src="file/general/diffrences-tick-mark.png" alt="" />
                </td>
                <td>
                  <img src="/file/general/diffrences-cancel-mark.svg" alt="" />
                </td>
              </tr>
              <tr>
                <td>35+ years of published research </td>
                <td>
                  <img src="file/general/diffrences-tick-mark.png" alt="" />
                </td>
                <td>
                  <img src="/file/general/diffrences-cancel-mark.svg" alt="" />
                </td>
              </tr>
              <tr>
                <td>Sourced from sustainably farmed Green-Lipped Mussels </td>
                <td>
                  <img src="file/general/diffrences-tick-mark.png" alt="" />
                </td>
                <td>
                  <img src="/file/general/diffrences-cancel-mark.svg" alt="" />
                </td>
              </tr>
              <tr>
                <td>Over 30 fatty acids </td>
                <td>
                  <img src="file/general/diffrences-tick-mark.png" alt="" />
                </td>
                <td>
                  <img src="/file/general/diffrences-cancel-mark.svg" alt="" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <a href="/product/OXL0005" className="shop-now-btn">
          SHOP NOW
          <span className="arrow">></span>
        </a>
      </section>
    </Styled>
  );
};

export default GHWOmegaxlDifference;
