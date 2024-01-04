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

const GHWOrdersDetails = (props) => {
  const { currentProfile, contextId } = props;
  const store = useContext(StoreContext);
  const [orderData, setOrderData] = useState();
  const printRef = useRef(null);

  // const [offset, setOffset] = useState(0);
  const getOrders = async () => {
    if (currentProfile.id) {
      console.log("xyzz:", currentProfile.id, contextId);
      const res = await store.endpoint("getOrdersDetails", {
        store,
        qParam: `ProfileId=${currentProfile.id}&InvoiceId=${contextId}`,
      });
      console.log("res.delta.data", res.delta.data.RESPONSE);

      if (res.ok && res.delta.data.RESPONSE.G_1[0]) {
        setOrderData(res.delta.data.RESPONSE.G_1[0]);
      }
    }
  };
  console.log("ghw-orders-details", orderData);
  useEffect(() => {
    if (currentProfile && store) {
      getOrders();
    }
  }, [currentProfile, store]);

  const handlePrint1 = () => {
    window.print();
  };

  const handlePrint2 = () => {
    if (printRef.current !== null) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  return (
    <Styled id="GHWOrdersDetails" css={css}>
      <div
        ref={printRef}
        className="main-cnr container-fixed main-content"
        css={css}
      >

        <a href="/order-history" className="order-back-btn">
          {/* <BackArrowIcon width="13px" height="22px" color="#667085" /> */}
          <i className="fa-solid fa-chevron-left icon"></i>
          <div className="order-title">Order Details</div>
        </a>

        {orderData && (
          <div className="order-detail-cnr">
            <div className="section">
              <div className="omegaxl-sect">
                <img
                  src="/file/general/omegaxl-logo.svg"
                  alt=""
                  className="omega-logo"
                />

                <div className="address billing-sect">
                  <div className="address-bill billing-address">
                    <div className="address-label">Invoice To</div>
                    <div className="address-value">{orderData.INVOICETO}</div>
                  </div>
                  <div className="address-section">
                    <div className="address-bill billing-address">
                      <div className="address-label">Billing Address</div>
                      <div className="address-value">
                        {orderData.BILLINGADDRESS}
                      </div>
                    </div>
                    <div className="address-bill billing-address">
                      <div className="address-label">Shipping Address</div>
                      <div className="address-value">
                        {orderData.SHIPPINGADDRES}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="invoice-sect">
                <div className="address shipping-sect">
                  <div className="address-bill shipping-address">
                    <div className="address-label">Invoice</div>
                    <div className="addreess-value">{orderData.INVOICEID}</div>
                  </div>
                  <div className="address-bill shipping-address">
                    <div className="address-label">Order Date</div>
                    <div className="address-value">{orderData.ORDERDATE}</div>
                  </div>
                  <div className="address-bill shipping-address">
                    <div className="address-label">TRACKINGNO</div>
                    <div className="address-value">{orderData.TRACKINGNO}</div>
                  </div>
                  <div className="address-bill shipping-address">
                    <div className="address-label">Payment method</div>
                    <div className="address-value">
                      {orderData.PAYMENTMETHOD}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-section">
              {orderData && (
                <>
                  <table>
                    <tbody>
                      <tr>
                        <th>Product</th>
                        <th>Order Type</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                      {orderData.G_2.map((item, index) => (
                        <tr key={index}>
                          <td>{item.PRODUCT}</td>
                          <td>{item.ORDERTYPE}</td>
                          <td>{item.QUANTITY}</td>
                          <td>
                            {item.UNITPRICE.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </td>
                          <td>
                            {item.TOTAL.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              <div className="cost">
                <div className="cost-list">
                  <h4 className="h4">Subtotal</h4>
                  <h3 className="h3">
                    {orderData.SUBTOTAL.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h3>
                </div>
                <div className="cost-list">
                  <h4 className="h4">Shipping + Handling</h4>
                  <h3 className="h3">
                    {orderData.SHIPPINGAMOUNT.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h3>
                </div>
                <div className="cost-list">
                  <h4 className="h4 highlt-green">Discount</h4>
                  <h3 className="h3 highlt-green">
                    {orderData.DISCOUNTAMOUNT.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h3>
                </div>
                <div className="cost-list">
                  <h4 className="h4">
                    Estimated Tax
                    <i className="fa-thin fa-circle-info"></i>
                  </h4>
                  <h3 className="h3">
                    {orderData.TAXAMOUNT.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h3>
                </div>
                <hr />
                <div className="cost-list">
                  <h4 className="h4 total">Total</h4>
                  <h3 className="h3 total">
                    {orderData.TOTALAMOUNT.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h3>
                </div>
              </div>
            </div>
            <div className="main-btn-cnr">
              <div className="btn-cnr">
                <button
                  onClick={handlePrint1}
                  className="btn md-custom primary-btn"
                >
                  Print Page1
                </button>
                <button
                  onClick={handlePrint2}
                  className="btn md-custom primary-btn"
                >
                  Print Page2
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Styled>
  );
};

export default connect(getPageData)(GHWOrdersDetails);
