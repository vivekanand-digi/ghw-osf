import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./ghw-reviews.css";

const GHWReviews = (props) => {
  return (
    <Styled id="GHWReviews" css={css}>
      <section className="customer-reviews">
        <div className="main-cnr">
          <div className="review-sect">
            <div className="user-rating star-rating">
              <div className="star-img rating-bg lg">
                <div className="fill rate-50"></div>
              </div>
            </div>

            <h1 className="h1-title">OmegaXL Over 20,000+ FIVE STAR Reviews</h1>
          </div>

          <div className="review-list container-fixed slick-initialized slick-slider slick-dotted">
            <button
              className="slick-prev slick-arrow"
              aria-label="Previous"
              type="button"
            >
              Previous
            </button>
            <div className="slick-list draggable">
              <div className="slick-track">
                <div
                  className="review-list-item slick-slide slick-cloned"
                  data-slick-index="-3"
                  id=""
                  aria-hidden="true"
                  tabindex="-1"
                >
                  <a
                    href="https://www.youtube.com/watch?v=B2FeNXf7rMg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="testimonial-image"
                  >
                    <img src="/file/general/View Testimonial.png" alt="" />
                  </a>

                  <div className="testimonial-content">
                    <div className="namee">
                      <img src="/file/general/helen.png" alt="" />
                    </div>
                    <div className="user-icon">
                      <div className="user-input">Helen R. </div>
                    </div>

                    <p className="para">
                      "Last week I walked 6 blocks! I was so proud of myself!
                      OmegaXL Works!"
                    </p>
                    <div className="user-rating star-rating">
                      <div className="star-img rating-bg">
                        <div className="fill rate-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="review-list-item slick-slide slick-cloned"
                  data-slick-index="-3"
                  id=""
                  aria-hidden="true"
                  tabindex="-1"
                >
                  <a
                    href="https://www.youtube.com/watch?v=B2FeNXf7rMg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="testimonial-image"
                  >
                    <img src="/file/general/View Testimonial.png" alt="" />
                  </a>

                  <div className="testimonial-content">
                    <div className="namee">
                      <img src="/file/general/helen.png" alt="" />
                    </div>
                    <div className="user-icon">
                      <div className="user-input">Frank F. </div>
                    </div>

                    <p className="para">
                      "OmegaXL hasn't just changed my life... it's extended my
                      working life."
                    </p>
                    <div className="user-rating star-rating">
                      <div className="star-img rating-bg">
                        <div className="fill rate-50"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="review-list-item slick-slide slick-cloned"
                  data-slick-index="-3"
                  id=""
                  aria-hidden="true"
                  tabindex="-1"
                >
                  <a
                    href="https://www.youtube.com/watch?v=B2FeNXf7rMg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="testimonial-image"
                  >
                    <img src="/file/general/View Testimonial.png" alt="" />
                  </a>

                  <div className="testimonial-content">
                    <div className="namee">
                      <img src="/file/general/helen.png" alt="" />
                    </div>
                    <div className="user-icon">
                      <div className="user-input">Robin G. </div>
                    </div>

                    <p className="para">
                      "I'm telling you something that's going to change your
                      life if you try it!"
                    </p>
                    <div className="user-rating star-rating">
                      <div className="star-img rating-bg">
                        <div className="fill rate-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Styled>
  );
};

export default GHWReviews;
