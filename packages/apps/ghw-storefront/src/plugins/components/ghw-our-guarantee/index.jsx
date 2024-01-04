import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./styles.css";

const GHWOurGuarantee = (props) => {
  return (
    <Styled id="GHWOurGuarantee" css={css}>
      <div className="main-cnr">
        <div className="title-section">
          <h1 className="h1">Our Guarantee</h1>
        </div>
        <div className="container-fixed">
          <div className="content-section">
            <div className="content">
              <h2 className="h2">
                OmegaXL 60-DAY MONEY BACK GUARANTEE (MINUS SHIPPING AND
                HANDLING)
              </h2>
              <p className="para">
                If you are not satisfied with your purchase of OmegaXL with
                Monthly Auto-Ship, simply cancel your Auto-Ship within 60 days
                of the date of your first purchase and return the unused portion
                of the product, including the empty bottles, within 30 days of
                the cancellation date to receive a refund of the purchase price
                (minus any shipping and handling). You must pre-pay return
                shipping. We do not accept any C.O.D. returns and are not
                responsible for items lost in transit, for this reason we
                recommend that you keep the tracking number until you receive
                your refund. Please allow up to 30 days for us to process your
                return and issue the refund. This money back guarantee is only
                available to first-time customers, including bundles and upsells
                with OmegaXL with Auto-Ship only, located in the United States
                and Canada that purchase directly from Great HealthWorks, Inc..
              </p>
            </div>

            <table>
              <tbody>
                <tr className="heading">
                  <th className="guarantee">Product</th>
                  <th className="guarantee">Policy</th>
                </tr>
                <tr>
                  <td>OmegaXL (auto-ship)</td>
                  <td>
                    60-Day Money Back Guarantee – Return unused portion of
                    product, including empty bottles
                  </td>
                </tr>
                <tr>
                  <td>OmegaXL (single purchase)</td>
                  <td>
                    See <a >Standard Return Policy</a>
                  </td>
                </tr>
                <tr>
                  <td>OmegaXL 2x</td>
                  <td>
                    See <a >Standard Return Policy</a>
                  </td>
                </tr>
                <tr>
                  <td>OmegaXL 3x</td>
                  <td>
                    See <a >Standard Return Policy</a>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="content">
              <h2 className="h2">Questions?</h2>
              <p className="para">
			  Many of your questions can be answered by visiting our online{" "}<a href="/faq">FAQ</a> . Our Customer Care Department isavailable at 1-800-488-8082 during regular business hours, from9:00 a.m. to 6:00 p.m., EST, Monday through Friday. You can alsocontact us anytime by using our online contact form.
              </p>
              <p className="para">Thank you for your business.</p>
              <p className="para order">
                <a>ORDER OmegaXL</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default GHWOurGuarantee;
