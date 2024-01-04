import React, { useContext, useEffect, useState } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
import css from "./styles.css";
import AngleDownIcon from "../commom/Icons/angle-down";

const isWindowContext = typeof window !== "undefined";
const GHWHeader = (props) => {
  isWindowContext && window.initSDK("Bots");

  return (
    <Styled id="GHWHeader" css={css}>
      <div className="container-fixed header-logo-menu">
        <a href="/home" className="logo">
          <img
            src="/file/general/omegaxl-logo.svg"
            alt="logo"
            className="logo-image"
          />
        </a>
        <nav id="navbar" className="navbar">
          <div className="nav-list">
            <div className="nav-item dropdown">
              <a className="nav-link inner-menu">
                PRODUCTS
                <AngleDownIcon width="13px" height="22px" color="#667085" />
              </a>
              <div className="sub-navbar-list">
                <a className="inner-nav-link" href="/product/OXL0005">
                  OmegaXL
                </a>
                <a className="inner-nav-link" href="/product/OXL0050">
                  OmegaXL Sport
                </a>
                <a className="inner-nav-link" href="/product/HRT0001">
                  HeartXL
                </a>
                <a className="inner-nav-link" href="/product/IXL0001">
                  ImmunXL
                </a>
                <a className="inner-nav-link" href="/product/PXL0001">
                  ProbioticXL
                </a>
                <a className="inner-nav-link" href="/product/SLPXL0001">
                  SleepXL
                </a>
                <a className="inner-nav-link" href="/product/TXL0001">
                  TurmericXL
                </a>
                <a className="inner-nav-link" href="/product/VD30001">
                  VitaminXL D3
                </a>
                <a className="inner-nav-link" href="/product/VBC30001">
                  VitaminXL B Complete
                </a>
              </div>
            </div>
            <div className="nav-item dropdown">
              <a className="nav-link inner-menu">
                BUNDLES
                <AngleDownIcon width="13px" height="22px" color="#667085" />
              </a>
              <div className="sub-navbar-list">
                <a className="inner-nav-link">OmegaXL Value</a>
                <a className="inner-nav-link">OmegaXL 2x Supply</a>
                <a className="inner-nav-link">OmegaXL 3x Supply</a>
                <a className="inner-nav-link">Inflammatory Support</a>
                <a className="inner-nav-link">B Energetic, B Great</a>
                <a className="inner-nav-link">Rest & Revive</a>
                <a className="inner-nav-link">Digestive Wellness</a>
                <hr></hr>
                <a className="inner-nav-link">Shop All</a>
              </div>
            </div>

            <div className="nav-item dropdown">
              <a className="nav-link">
                ABOUT
                <AngleDownIcon width="13px" height="22px" color="#667085" />
              </a>
              <div className="sub-navbar-list">
                <a className="inner-nav-link" href="/about">
                  About Us
                </a>
                <a className="inner-nav-link" href="/faq">
                  FAQs
                </a>
              </div>
            </div>
            <div className="nav-item">
              <a className="nav-link" href="/contactus">
                CONTACT
              </a>
            </div>
          </div>
        </nav>
      </div>
    </Styled>
  );
};

export default GHWHeader;
