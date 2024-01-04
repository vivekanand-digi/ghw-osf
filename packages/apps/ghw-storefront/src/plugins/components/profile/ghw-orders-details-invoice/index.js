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

const GHWOrdersDetailsInvoice = props => {
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
    <Styled id="GHWOrdersDetailsInvoice" css={css}>
      <div className="main-cnr container-fixed main-content">
        <div className="order-back-btn">
          <BackArrowIcon width="13px" height="22px" color="#667085" />
          <a href="#" className="order-title">
            Invoice Info{' '}
          </a>
        </div>
        <div className="order-detail-cnr">
          <div className="section">
            <div className="omegaxl-sect">
              <img src="assets/images/omegaxl-logo.webp" alt="" className="omega-logo" />
              <div className="address billing-sect">
                <div className="address-bill billing-address">
                  <div className="address-label">Invoice To</div>
                  <div className="address-value">Virdhii</div>
                </div>
                <div className="address-section">
                  <div className="address-bill billing-address">
                    <div className="address-label">Billing Address</div>
                    <div className="address-value">2118 Thornridge Cir. Syracuse, Connecticut 35624</div>
                  </div>
                  <div className="address-bill billing-address">
                    <div className="address-label">Shipping Address</div>
                    <div className="address-value">2118 Thornridge Cir. Syracuse, Connecticut 35624</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="invoice-sect">
              <div className="address shipping-sect">
                <div className="address-bill shipping-address">
                  <div className="address-label">Invoice</div>
                  <div className="addreess-value">GHW1234556432HWRTIM</div>
                </div>
                <div className="address-bill shipping-address">
                  <div className="address-label">Order Date</div>
                  <div className="address-value">April 11, 2023</div>
                </div>
                <div className="address-bill shipping-address">
                  <div className="address-label">Order ID</div>
                  <div className="address-value">GW-6913412</div>
                </div>
                <div className="address-bill shipping-address">
                  <div className="address-label">Payment method</div>
                  {/* <img src="assets/images/payment-method.webp" alt="" width="80" height="45" /> */}
                  <div className="payment">
                    <img src="assets/images/card-logo.svg" alt="" className="card-logo" />
                    <span className="card-num">Mastercard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-section">
            <table>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
              <tr>
                <td>OmegaXL</td>
                <td>01</td>
                <td>$70.00</td>
                <td>$70.00</td>
              </tr>
              <tr>
                <td>VITAMINXL</td>
                <td>02</td>
                <td>$100.00</td>
                <td>$100.00</td>
              </tr>
              <tr>
                <td>TURMERICXL</td>
                <td>02</td>
                <td>$49.96</td>
                <td>$49.96</td>
              </tr>
            </table>
            <div className="cost">
              <div className="cost-list">
                <h4 className="h4">Subtotal</h4>
                <h3 className="h3">$219.96</h3>
              </div>
              <div className="cost-list">
                <h4 className="h4">S+H</h4>
                <h3 className="h3">$6.95</h3>
              </div>
              <div className="cost-list">
                <h4 className="h4 highlt-green">Discount</h4>
                <h3 className="h3 highlt-green">-$17.49</h3>
              </div>
              <div className="cost-list">
                <h4 className="h4">
                  Estimated Tax
                  <i className="fa-thin fa-circle-info"></i>
                </h4>
                <h3 className="h3">$8.24</h3>
              </div>
              <hr />
              <div className="cost-list">
                <h4 className="h4 total">Total</h4>
                <h3 className="h3 total">$217.66</h3>
              </div>
            </div>
          </div>
          <div className="main-btn-cnr">
            <div className="btn-cnr">
              <a className="btn md-custom primary-btn">
                Print Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default connect(getPageData)(GHWOrdersDetailsInvoice);
