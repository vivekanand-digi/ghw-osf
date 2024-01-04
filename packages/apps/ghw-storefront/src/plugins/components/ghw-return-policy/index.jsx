import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./styles.css";

const GHWReturnPolicy = (props) => {
  return (
    <Styled id="GHWReturnPolicy" css={css}>
      <div className="main-cnr">
        <div className="content">
          <h1 className="my-4">Return Policy</h1>
          <h4 className="wp-block-heading">
            30-DAY STANDARD RETURN POLICY (MINUS SHIPPING AND HANDLING)
          </h4>
          <p>
            If you are not satisfied with your purchase of a Great HealthWorks
            product, return the fully sealed, unused product including all free
            products or bottles within 30 days of the purchase date to receive a
            full or partial refund of the purchase price (minus any shipping and
            handling).&nbsp;&nbsp;A partial refund will occur when the quantity
            of sealed, unused bottles returned is less than the original order
            quantity. You must prepay return shipping. We do not accept any
            C.O.D. returns and are not responsible for items lost in transit,
            for this reason, we recommend that you keep the tracking number
            until you receive your refund. Please allow up to 30 days for us to
            process your return and issue the refund. This standard 30-day
            return policy is available to customers located in the United States
            and Canada that made a single purchase of any of the Great
            HealthWorks products directly from Great HealthWorks, Inc.
          </p>
          <div className="wp-block-columns is-layout-flex wp-container-core-columns-layout-3 wp-block-columns-is-layout-flex">
            <div className="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
              <div className="wp-block-columns is-layout-flex wp-container-core-columns-layout-2 wp-block-columns-is-layout-flex">
                <div
                  className="wp-block-column is-layout-flow wp-block-column-is-layout-flow"
                  style={{ flexBasis: "100%" }}
                >
                  <div className="wp-block-group is-layout-flow wp-block-group-is-layout-flow">
                    <div className="wp-block-columns is-layout-flex wp-container-core-columns-layout-1 wp-block-columns-is-layout-flex">
                      <div className="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
                        <div className="wp-block-kadence-spacer aligncenter kt-block-spacer-_00d0ea-cd">
                          <div className="kt-block-spacer kt-block-spacer-halign-center">
                            <hr className="kt-divider" />
                          </div>
                        </div>
                        <figure className="wp-block-table is-style-stripes">
                          <table>
                            <thead>
                              <tr>
                                <th
                                  className="has-text-align-center"
                                  data-align="center"
                                >
                                  <strong>PRODUCT</strong>
                                </th>
                                <th
                                  className="has-text-align-center"
                                  data-align="center"
                                >
                                  Policy
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td
                                  className="has-text-align-center"
                                  data-align="center"
                                >
                                  TrioXL*
                                </td>
                                <td
                                  className="has-text-align-center"
                                  data-align="center"
                                >
                                  Return fully sealed, unused bottles
                                </td>
                              </tr>
                              {/* Add more rows as needed */}
                            </tbody>
                          </table>
                        </figure>
                      </div>
                    </div>
                  </div>
                  <div className="wp-block-kadence-spacer aligncenter kt-block-spacer-_39be1c-47">
                    <div className="kt-block-spacer kt-block-spacer-halign-center">
                      <hr className="kt-divider" />
                    </div>
                  </div>
                  <p className="has-text-align-center">
                    *On an <strong>OmegaXL auto-ship order,</strong> any other
                    product also purchased for a monthly auto-ship program, and
                    shipping beginning the first month of the auto-ship,
                    qualifies for the OmegaXL Auto-Ship 60 Day Money Back
                    Guarantee&nbsp;policy.
                  </p>
                  <p>
                    For the OmegaXL Auto-Ship 60 Day Money Back Guarantee.
                  </p>
                  <p>
                    <b>Questions?</b>
                    <br />
                    Many of your questions can be answered by visiting our
                    online&nbsp;
                    <strong>
                      <a href="/faq/">FAQ</a>
                    </strong>
                    . Our Customer Care Department is available at
                    1-800-488-8082 during regular business hours, from 9:00 a.m.
                    to 6:00 p.m., EST, Monday through Friday. You can also
                    contact us anytime by using our online&nbsp;
                    <strong>
                      <a href="/contactus">
                        contact form
                      </a>
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default GHWReturnPolicy;
