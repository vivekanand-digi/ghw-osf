/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext, useEffect, useState} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {getPageData} from '@oracle-cx-commerce/react-widgets/profile/profile-update-password/selectors';
import css from './styles.css';

const GHWSubscriptionMultiple = props => {
  const {currentProfile} = props;
  const store = useContext(StoreContext);
  const [orderData, setOrderData] = useState();
  // const [offset, setOffset] = useState(0);
  const getOrders = async () => {
    if (currentProfile) {
      const res = await store.endpoint('getOrders', {
        store,
        qParam: `OCCCustomerID_c=${currentProfile.id}&OCCOrderType_c=SUBSCRIPTION&limit=10&offset=0`
      });
      if (res.ok && res.delta.data.items) {
        setOrderData(res.delta.data.items);
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
    if (products.length > 0) {
      const lengthProducts = products.length - 1;
      const nameProduct = products[0].ProductName;
      if (lengthProducts > 0) {
        return `${nameProduct}+${lengthProducts}`;
      }

      return `${nameProduct}`;
    }
  };

  return (
    <Styled id="GHWSubscription" css={css}>
      <div className="main-cnr container-fixed main-content">
        <div className="order-back-btn">
          <i className="fa-solid fa-chevron-left icon"></i>
          <a href="#" className="order-title">
            Subscription Details{' '}
          </a>
        </div>
        <div className="order-detail-cnr">
          <div className="order-bg-sect subscription">
            <img src="assets/images/subscription-omega.webp" alt="" />
            <div className="capsule-list">
              <div className="capsule-item">
                <div className="capsule-info">
                  <div className="capsule-name">OMEGAXL</div>
                  <div className="capsule-desc">
                    Support for Joint & Muscle Health. Mobilitv & Joint Dain Relief 30+ Fatty Acids
                  </div>
                </div>
                <div className="capsule-quantity">Auto ship</div>
              </div>
              <div className="capsule-item">
                <div className="capsule-info">
                  <div className="capsule-name">PROBIOTICXL</div>
                  <div className="capsule-desc">
                    Support for Joint & Muscle Health. Mobilitv & Joint Dain Relief 30+ Fatty Acids
                  </div>
                </div>
                <div className="capsule-quantity">Auto ship</div>
              </div>
              <div className="capsule-item">
                <div className="capsule-info">
                  <div className="capsule-name">HEARTXL</div>
                  <div className="capsule-desc">
                    Support for Joint & Muscle Health. Mobilitv & Joint Dain Relief 30+ Fatty Acids
                  </div>
                </div>
                <div className="capsule-quantity">Auto ship</div>
              </div>
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
          <div className="order-content-sect">
            <div className="address billing-sect">
              <div className="address-bill billing-address">
                <div className="address-label">Billing Address</div>
                <div className="address-value addr">2118 Thornridge Cir. Syracuse, Connecticut 35624</div>
              </div>
              <div className="billing-address pay-method">
                <div className="address-label">Payment method</div>
                <div className="payment">
                  <img src="assets/images/card-logo.svg" alt="" className="card-logo" />
                  <span className="card-num">**** - **** - **** - 1178</span>
                </div>
              </div>
            </div>
            <div className="address shipping-sect">
              <div className="address-bill shipping-address">
                <div className="address-label">Shipping Address</div>
                <div className="address-value addr">2118 Thornridge Cir. Syracuse, Connecticut 35624</div>
              </div>
              <div className="address-bill shipping-address frequency-grp">
                <div className="address-label">Frequency</div>
                <div className="address-value frequency">1 Month</div>
              </div>
              <div className="address-bill shipping-address">
                <div className="address-label">Subscription ID</div>
                <div className="address-value">GW-691021</div>
              </div>
              <div className="address-bill shipping-address">
                <div className="address-label">Status</div>
                <div className="address-value">Active</div>
              </div>
            </div>
          </div>
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

export default connect(getPageData)(GHWSubscriptionMultiple);
