/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, { useContext, useEffect, useRef, useState } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
import { connect } from "@oracle-cx-commerce/react-components/provider";
import { StoreContext } from "@oracle-cx-commerce/react-ui/contexts";
import { getPageData } from "@oracle-cx-commerce/react-widgets/profile/profile-update-password/selectors";
import css from "./styles.css";
import BackArrowIcon from "../../commom/Icons/back-arrow";

const GHWSubscriptionDetails = (props) => {
  const { currentProfile, contextId } = props;
  const store = useContext(StoreContext);
  const [orderData, setOrderData] = useState();
  const printRef = useRef(null);

  const getSubscriptionDetails = async () => {
    if (currentProfile.id) {
      const res = await store.endpoint("getSubscriptionDetails", {
        store,
        qParam: `ProfileId=${currentProfile.id}&SubscriptionId=${contextId}`,
      });

      if (res.ok && res.delta.data.RESPONSE.G_1[0]) {
        setOrderData(res.delta.data.RESPONSE.G_1[0]);
      }
    }
  };
  console.log("ghw-subscription-details", orderData);
  
  useEffect(() => {
    if (currentProfile && store) {
      getSubscriptionDetails();
    }
  }, [currentProfile, store]);

  return (
    <Styled id="GHWOrdersDetails" css={css}>
      <div
        ref={printRef}
        className="main-cnr container-fixed main-content"
        css={css}
      >
        <a href="/subscription" className="order-back-btn">
          {/* <BackArrowIcon width="13px" height="22px" color="#667085" /> */}
          <i className="fa-solid fa-chevron-left icon"></i>
          <div className="order-title">Subscription Details</div>
        </a>

        {orderData && (
          <div className="order-detail-cnr">
            <div className="section">
              <div className="omegaxl-sect">
              {orderData && (
                    <>
                      {orderData.G_2.map((item) => (
                        <div className="order-bg-sect subscription">
                          <img alt="" />
                          <div className="capsule-list">
                            <div className="capsule-item">
                              <div className="capsule-info">
                                <div className="capsule-name">
                                  {item.PRODUCT}
                                </div>
                                {/* <div className="capsule-desc">desc</div> */}
                              </div>
                            </div>
                          </div>
                          <div className="edit-sect">
                            <div className="edit-btn">
                              <i className="fa-light fa-pen-to-square"></i>
                              <span>Edit</span>
                            </div>
                            <div className="capsule-price">
                              {item.TOTAL.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                              /monthly
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                <div className="order-content-sect">
                  <div className="address billing-sect">
                    <div className="address-bill billing-address">
                      <div className="address-label">Billing Address</div>
                      <div className="address-value addr">
                        {orderData.BILLINGADDRESS}
                      </div>
                    </div>
                    <div className="billing-address pay-method">
                      <div className="address-label">Payment method</div>
                      <div className="address-value addr">
                        {orderData.PAYMENTMETHOD}
                      </div>
                    </div>
                  </div>
                  <div className="address shipping-sect">
                    <div className="address-bill shipping-address">
                      <div className="address-label">Shipping Address</div>
                      <div className="address-value addr">
                        {orderData.SHIPPINGADDRES}
                      </div>
                    </div>
                    <div className="address-bill shipping-address frequency-grp">
                      <div className="address-label">Frequency</div>
                      <div className="address-value frequency">
                        {orderData.FREQUENCY}
                      </div>
                    </div>
                    <div className="address-bill shipping-address">
                      <div className="address-label">Subscription ID</div>
                      <div className="address-value">
                        {orderData.SUBSCRIPTION_ID}
                      </div>
                    </div>
                    <div className="address-bill shipping-address">
                      <div className="address-label">Status</div>
                      <div className="address-value">xxxxActive</div>
                    </div>
                  </div>
                </div>

                <div className="transaction-sect">
                  <div className="title">WIP Transactions History(fake data)</div>
                  <table>
                    <tbody>
                      <tr>
                        <th>Date</th>
                        <th>Shipment ID</th>
                        <th>Amount</th>
                      </tr>
                      <tr>
                        <td>May 11, 2023</td>
                        <td>Upcoming Shipment</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Apr 11, 2023</td>
                        <td className="highlt-blue">US331223112</td>
                        <td className="highlt-bold">-$174.95</td>
                      </tr>
                      <tr>
                        <td>Mar 20, 2023</td>
                        <td className="highlt-blue">A0B1C095435</td>
                        <td className="highlt-bold">-$174.95</td>
                      </tr>
                      <tr>
                        <td>Feb 11, 2023</td>
                        <td className="highlt-blue">CD56C060632</td>
                        <td className="highlt-bold">-$174.95</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Styled>
  );
};

export default connect(getPageData)(GHWSubscriptionDetails);
