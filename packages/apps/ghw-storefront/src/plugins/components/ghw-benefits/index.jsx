import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./styles.css";

const GHWBenefits = (props) => {
  return (
    <Styled id="GHWBenefits" css={css}>
      <section className="customer-reviews benefits">
				<div className="main-cnr">
					<div className="review-sect benefits-sect section-home">
						

						<h1 className="h1-title">
							OmegaXL packed with benefits 
						</h1>
                        <h6 className="h6">OmegaXL has been shown in clinical research to support joint health and mobility* </h6>
                        <div className="benefits-list">
                            <div className="benefits-item">
                                <div className="icon">
                                    <img src="/file/general/research-icon.svg" alt=""/>
                                </div>
                                <div className="content">
                                    <div className="title">35+ Years of 
                                        Clinical Research </div>
                                    <div className="desc">The SPMs (Specialized Pro-Resolving Mediators) in OmegaXL, have been shown in research to support a healthy inflammatory response.* </div>
                                </div>
                            </div>
                            <div className="benefits-item">
                                <div className="icon">
                                    <img src="/file/general/bottle-icon.svg" alt=""/>
                                </div>
                                <div className="content">
                                    <div className="title">Millions of Bottles Sold   </div>
                                    <div className="desc">Since 2003, OmegaXL has sold millions of bottles to satisfied customers throughout the USA.  </div>
                                </div>
                            </div>
                            <div className="benefits-item">
                                <div className="icon">
                                    <img src="/file/general/rating-icon.svg" alt=""/>
                                </div>
                                <div className="content">
                                    <div className="title">20,000+ 5 Star Reviews    </div>
                                    <div className="desc">Consumers agree that OmegaXL deserves a five-star review.  We say Thank You.  </div>
                                </div>
                            </div>
                            <div className="benefits-item">
                                <div className="icon">
                                    <img src="/file/general/extraction-icon.svg" alt=""/>
                                </div>
                                <div className="content">
                                    <div className="title">Unique Extraction 
                                        Process  </div>
                                    <div className="desc">Our extraction process ensures that OmegaXL is free from harmful levels 
                                        of toxins.  </div>
                                </div>
                            </div>
                            <div className="benefits-item">
                                <div className="icon">
                                    <img src="/file/general/scale-icon.svg" alt=""/>
                                </div>
                                <div className="content">
                                    <div className="title">Small &amp; Easy to Swallow      </div>
                                    <div className="desc">OmegaXL soft gels are smaller than 
                                        large, hard to swallow fish oil pills 
                                        from unknown waters.  </div>
                                </div>
                            </div>
                            <div className="benefits-item">
                                <div className="icon">
                                    <img src="/file/general/award-icon.svg" alt=""/>
                                </div>
                                <div className="content">
                                    <div className="title">Premium Quality 
                                        from New Zealand  </div>
                                    <div className="desc">Each OmegaXL soft gel contains the oils of 8-12 green-lipped mussels from New Zealand’s pristine waters.   </div>
                                </div>
                            </div>
                        </div>
                        <a href="/product/OXL0005" className="shop-now-btn">SHOP NOW<span class="arrow">&gt;</span></a>
					</div>

					
				</div>
			</section>
      
    </Styled>
  );
};

export default GHWBenefits;
