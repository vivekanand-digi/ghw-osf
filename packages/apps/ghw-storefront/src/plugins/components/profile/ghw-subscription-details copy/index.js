/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext, useEffect, useState} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {getPageData} from '@oracle-cx-commerce/react-widgets/profile/profile-update-password/selectors';
import css from './styles.css';
import BackArrowIcon from '../../commom/Icons/back-arrow';

const GHWSubscriptionDetails = props => {
  const {currentProfile, contextId} = props;
  const store = useContext(StoreContext);
  const [orderData, setOrderData] = useState();
  // const [offset, setOffset] = useState(0);
  const getOrders = async () => {
    if (currentProfile) {
      const res = await store.endpoint('getOrdersDetails', {
        store,
        qParam: contextId
      });
      if (res.ok && res.delta.data.SubscriptionResponse.items) {
        setOrderData(res.delta.data.SubscriptionResponse.items[0]);
      }
    }
  };
  console.log('res1111111111', orderData);
  useEffect(() => {
    if (currentProfile && store) {
      getOrders();
    }
  }, [currentProfile, store]);

  const getProductName = products => {
    if (products && products.length > 0) {
      const lengthProducts = products.length - 1;
      const nameProduct = products[0].ProductName;
      if (lengthProducts > 0) {
        return `${nameProduct}+${lengthProducts}`;
      }

      return `${nameProduct}`;
    }
  };

  return (
    <Styled id="GHWSubscriptionDetails" css={css}>
      <div className="main-cnr container-fixed main-content">
        <div className="order-back-btn">
          <BackArrowIcon width="13px" height="22px" color="#667085" />
          <a href="/Subscription" className="order-title">
            Subscription Details{' '}
          </a>
        </div>
        <div className="order-detail-cnr">
          <div className="order-bg-sect subscription">
            <img src="assets/images/subscription-omega.webp" alt="" />
            <div className="capsule-list">
              {orderData &&
                orderData.products.map(item => (
                  <>
                    <div className="capsule-item">
                      <div className="capsule-info">
                        <div className="capsule-name">{item.ProductName}</div>
                        <div className="capsule-desc">{item.Description}</div>
                      </div>
                      <div className="capsule-quantity">1</div>
                    </div>
                    <hr />
                  </>
                ))}
            </div>
            <div className="edit-sect">
              <div className="edit-btn">
                <i className="fa-light fa-pen-to-square"></i>
                <span>Edit</span>
              </div>
              <div className="capsule-price">
                <span>$</span>174.95
                <span className="month">/Monthly</span>
              </div>
            </div>
          </div>
          {orderData && (
            <div className="order-content-sect">
              <div className="address billing-sect">
                <div className="address-bill billing-address">
                  <div className="address-label">Billing Address</div>
                  <div className="address-value addr">{orderData.BillToAddress}</div>
                </div>
                <div className="billing-address pay-method">
                  <div className="address-label">Payment method</div>
                  {/* <img src="assets/images/payment-method.webp" alt="" /> */}
                  <div className="payment">
                    <img src="assets/images/card-logo.svg" alt="" className="card-logo" />
                    <span className="card-num">{orderData.PaymentMethod_c}</span>
                  </div>
                </div>
              </div>
              <div className="address shipping-sect">
                <div className="address-bill shipping-address">
                  <div className="address-label">Shipping Address</div>
                  <div className="address-value addr">{orderData.ShipToPartySiteName}</div>
                </div>
                <div className="address-bill shipping-address order-grp">
                  <div className="address-label">Order Type</div>
                  <div className="address-value order-type">{orderData.OCCOrderType_c}</div>
                </div>
                <div className="section">
                  <div className="address-bill shipping-address">
                    <div className="address-label">Order ID</div>
                    <div className="address-value">{orderData.OCCOrderNumber_c}</div>
                  </div>
                  <div className="address-bill shipping-address">
                    <div className="address-label">status</div>
                    <div className="address-value">{orderData.Status}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="transaction-sect">
            <div className="title">Transactions History</div>
            <table>
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
            </table>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default connect(getPageData)(GHWSubscriptionDetails);
