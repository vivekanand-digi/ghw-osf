import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */

import css from "./ghw-banner.css";
// import pricingImage from "./images/pricing.svg";

const GHWBanner = (props) => {
  return (
    <Styled id="GHWBanner" css={css}>
      <section className="banner">
      <div className="container-fixed">
        <div className="title">
          <span>GET OUT THERE</span>
        </div>
        <div className='image-sec'>
          <img src="/file/products/celebrity-product-bundle_omegaXL.png" alt=""
              className="banner-img" />
            <div className="buy-one">
							<div className="buy">BUY ONE</div>
							<div className="free">GET TWO <span>FREE</span></div>
							<div className="text">†Only on first order, with monthly Auto-Ship.</div>
						</div>
        </div>
        <div className="content">
            {/* <img src={pricingImage} alt="Pricing" /> */}
            <div className="pricing">
							<span className="dollar">$</span>
							<span className="price">39</span>
							<div className="dots">
								<span className="dotted">.95† </span>
								<span className="sh">.S&H </span>
							</div>

						</div>
						<div className="free-tag">
							<img src="/file/general/free-tag.svg" alt="" />
						</div>
          <a href="/product/OXL0005" className="shop-now">
            SHOP NOW <span className="arrow">&gt;</span>
          </a>
        </div>
        
      </div>
    </section>      
    </Styled>
  );
};

export default GHWBanner;
