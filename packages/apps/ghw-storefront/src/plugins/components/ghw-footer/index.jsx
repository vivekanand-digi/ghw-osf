import React, { useEffect } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
import css from "./ghw-footer.css";
import Link from "@oracle-cx-commerce/react-components/link";
import { t } from "@oracle-cx-commerce/utils/generic";

function scrollToTop() {
  const duration = 500;
  const scrollStep = -window.scrollY / (duration / 15);
  const scrollInterval = setInterval(() => {
    if (window.scrollY !== 0) {
      window.scrollBy(0, scrollStep);
    } else {
      clearInterval(scrollInterval);
    }
  }, 15);
}

const GHWFooter = (props) => {
  const {
    faqTitle,
    faqLink,
    rewardsTitle,
    rewardsLink,
    customerServiceTitle,
    customerServiceLink,
    cancellationTitle,
    cancellationLink,
    guaranteeTitle,
    guaranteeLink,
    returnPolicyTitle,
    returnPolicyLink,
    privacyPolicyLink,
    tcLink,
    retunPolicyLink,
    copyrightNoticeLink,
  } = props;

  const handleScrollToTop2 = () => {
    scrollToTop();
  };

  return (
    <Styled id="GHWFooter" css={css}>
      <div className="footer-cnr">
        <div className="top-section container-fixed">
          <a href="#" className="logo-cnr">
            <img
              src="/file/general/omegaxl-logo.svg"
              alt=""
              className="footer-logo"
            />
          </a>
          {/* <div className="language-menu">
            <div className="btn active">
              <img src="/file/general/en.png" alt="EN" />
              EN
            </div>
            <div className="btn">
              <img src="/file/general/es.png" alt="SPA" />
              SPA
            </div>
          </div> */}
          <div className="footer-column">
            <div className="signup column">
              <div className="form">
                <div className="form-title">
                  SIGN UP TO RECEIVE PROMOTIONS, NEWS AND UPDATES.
                </div>
                <div className="signup-in-cnr">
                  <input
                    type="text"
                    className="signup-in"
                    placeholder="Enter e-mail address"
                  />
                  <a href="" className="btn-icon"></a>
                </div>
              </div>
            </div>
            <div className="social-links column">
              <p className="ft-follow-txt">Follow Us @ OmegaXL</p>
              <div className="social-icons">
                <a href="https://www.instagram.com/omegaxl" target="_blank">
                  <i className="fa-brands fa-instagram icon"></i>
                </a>
                <a href="https://www.youtube.com/@OmegaXL" target="_blank">
                  <i className="fa-brands fa-youtube icon"></i>
                </a>
                <a href="https://www.facebook.com/omegaxl/" target="_blank">
                  <i className="fa-brands fa-facebook-f icon"></i>
                </a>
              </div>
            </div>
            <div className="digicert-cnr  column">
              <img
                src="/file/general/digicert.svg"
                alt="digicert"
                className="digi-cert"
              />
            </div>
          </div>
          <div className="footer-column footer-link">
            <div className="column">
              <a className="ft-link ft-link-heading">
                OmegaXL<sup>®</sup>
              </a>
              <a className="ft-link" href="/product/OXL0005">
                {" "}
                OmegaXL<sup>®</sup>{" "}
              </a>
              <a className="ft-link">Bundles + Save</a>
              <a className="ft-link" href="/about">
                About Us{" "}
              </a>
            </div>            

            <div className="column">
              <a className="ft-link ft-link-heading" href="/about">
                Help
              </a>
              <a className="ft-link" href="/faq">
                FAQs
              </a>
              <a className="ft-link" href="/return-policy">
                Return Policy
              </a>
              <a className="ft-link" href="/contactus">
                Cancellation
              </a>
              <a className="ft-link" href="/contactus">
                Customer Service
              </a>
              <a className="ft-link" href="/contactus">
                Contact
              </a>
            </div>
            <div className="column contact-info">
              <div className="ct-title">Customer Service</div>
              <div className="ct-info">M-F, 9-5:30PM EST</div>
              <div className="ct-info">Sat, 9-2PM EST</div>
              <div className="ct-title">1-800-488-8082</div>
              <a href="/contactus">
                <div className="ct-img">
                  <img
                    src="/file/general/contact-online.svg"
                    alt="contact-email"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="btm-section container-fixed">
          <div className="footer-bottom">
            <div className="nortoninfo-right">
              <p className="ft-offer-disc-txt">
                Offers subject to change or cancellation at any time.
              </p>
              <p className="ft-offer-disc-txt">
                <sup>† </sup>
                Only on first order, with monthly Auto-ship.
              </p>
              <p className="ft-offer-disc-txt">
                Savings based on individual product current retail price
              </p>
              <p className="ft-offer-disc-txt">
                <sup>‡ </sup>
                We do not use ingredients that were produced using
                biotechnology.
              </p>
              <p className="ft-offer-disc-txt">
                <sup>†† </sup>
                Any references on this website to standard or regular fish oil
                means a fish oil containing a standard EPA (18%) and DHA (12%)
                omega-3 fatty acid blend in ethyl ester form.
              </p>
            </div>
            <div className="nortoninfo-left">
              <div className="ft-offer-box">
                * These statements have not been evaluated by the FDA (U.S. Food
                & Drug Administration). These products are not intended to
                diagnose, treat, cure, or prevent any disease.
              </div>
            </div>
          </div>
          <div className="copyright-cnr">
            <div className="copyright-text">
              <a href="privacy-policy"> Privacy Policy </a>
              <a href="terms-and-condition"> Terms &amp; Conditions </a>

              <a href="copyright"> Copyright Notice </a>
              <a href="california-privacy-choices">
                Your California Privacy Choices
              </a>
            </div>
            <hr />
            <p className="ft-offer-copy-text">
              © 2023 Great HealthWorks Inc. All Rights Reserved. 4150 SW 28th
              Way Fort Lauderdale, FL, 33312
            </p>
          </div>

          <div className="back-to-top">
            <a className="top-link" onClick={handleScrollToTop2}>
              <span>BACK TO TOP</span>
            </a>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default GHWFooter;
