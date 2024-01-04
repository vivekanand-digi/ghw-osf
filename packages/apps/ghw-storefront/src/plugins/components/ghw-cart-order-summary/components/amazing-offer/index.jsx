/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {GetSizeAndFreqDetails} from '../../../ghw-mini-cart-desktop/components/mini-commerce-item-components';
import css from './amazing-offer.css';

const AmazingOffer = props => {
  const {orderItes = {}} = props;

  return (
    <Styled id="AmazingOffer" css={css}>
      <div className="AmazingOffer">
        <div className="capsule-detail">
          <div className="title-name" id="show">
            Amazing Offer
          </div>
          <div className="capsule-list">
            <div className="capsule-sec">
              <div className="img">
                <img src="/ccstore/v1/images/?source=/file/products/OmegaXL1.jpg" alt="" />
              </div>

              <div className="content">
                <h4 className="title free">Get Your Free</h4>
                <p className="para count">ONE 30-count bottle of VitaminXL D3</p>
                <div className="quantity order">
                  <p>On Your 1st Order</p>
                </div>
              </div>
            </div>
            <div className="cart">
              <div className="row">
                <div className="column co">
                  <i className="fa-light fa-cart-shopping icon"></i>
                  <h4 className="h4">1st Order</h4>
                </div>
                <i className="fa-light fa-chevron-right icons"></i>
                <div className="column">
                  <i className="fa-light fa-bag-shopping icon"></i>
                  <h3 className="h3">TWO 60-count bottles of OmegaXL ONE 30-count bottle of VitaminXL D3</h3>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <i className="fa-light fa-cart-flatbed-suitcase icon"></i>
                  <h4 className="h4">After 1st Order</h4>
                </div>
                <i className="fa-light fa-chevron-right icons"></i>
                <div className="column">
                  <i className="fa-light fa-bag-shopping icon"></i>
                  <h3 className="h3">
                    TWO 60-count bottles of OmegaXL cost 69.98 (34.45 per bottle ) + applicable tax
                  </h3>
                </div>
              </div>
              <div className=" para">
                You agree that we may reserve and bill the credit card used today for this Save with Monthly Auto-Ship
                Program purchase and for each future shipment.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default AmazingOffer;
