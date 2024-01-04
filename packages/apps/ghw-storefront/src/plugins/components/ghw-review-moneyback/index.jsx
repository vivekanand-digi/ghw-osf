import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./ghw-review-moneyback.css";

const GHWReviewMoneyback = (props) => {
  return (
    <Styled id="GHWReviewMoneyback" css={css}>
      <section className="rating-return">
        <div className="title-sect container-fixed">
          <div className="rev-logo">
            <img src="/file/general/ghw-logo.svg" alt="" />
            </div>
          <div className="title">
            Our Mission is Simple, We Care. Because Great Health Works.
          </div>
        </div>
        
        <div className="rating-return-cnr container-fixed">
          <div className="rr-left-panel">
            <div className="review-item">
              <div className="logo-rating">
                <img src="file/general/review-bbb.png" alt="" />
                <div className="title">A+ RATING</div>
              </div>
              <div className="value-rating">
                <div className="rating-num">4.0</div>
                <div className="user-rating star-rating">
                  <div className="star-img rating-bg">
                    <div className="fill rate-40"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="review-item">
            <div className="logo-rating">
                <img src="file/general/review-google.png" alt="" />
                <div className="title review-title">REVIEWS</div>
              </div>
              <div className="value-rating">
                <div className="rating-num">4.5</div>
                <div className="user-rating star-rating">
                  <div className="star-img rating-bg">
                    <div className="fill rate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rr-right-panel">
            <div className="return-item-info">
              <div className="return-img">
                <img src="file/general/auto-ship-60day.png" alt=""></img>
              </div>
              <div className="return-content">
                <div className="cnt-block">
                  <h2 className="r-title">
                    OmegaXL® Auto-Ship, 60 Day Money Back Guarantee
                  </h2>
                  <p className="desc">
                    For OmegaXL® only, if you are not satisfied with your
                    auto-ship purchase, cancel your auto-ship within 60 days
                    of your first purchase date.
                  </p>
                </div>
                <a href="/our-guarantee" className="read-more">Read More</a>
              </div>
            </div>
            <div className="return-item-info">
            <div className="return-img">
                <img src="/file/general/standard-return.png" alt="" />
              </div>
              <div className="return-content">
                <div className="cnt-block">
                  <h2 className="r-title">
                    Standard return policy for all non-OmegaXL® Auto-ship
                    products
                  </h2>
                  <p className="desc">
                    If you are not satisfied with your purchase of any Great
                    HealthWorks product, return the entire purchase of unused,
                    sealed bottles, within 30 days of purchase date to receive
                    a refund of the purchase price (minus shipping and
                    handling).
                  </p>
                </div>
                <a href="/our-guarantee" className="read-more">Read More</a>
              </div>
            </div>
          </div>
        </div>
      
      </section>
      
    </Styled>
  );
};

export default GHWReviewMoneyback;
