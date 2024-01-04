import React, { useContext } from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import Link from '@oracle-cx-commerce/react-components/link';
/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from '@oracle-cx-commerce/utils/generic';

const GHWHomeMoneyback = props => {

  return (
    <Styled id="GHWHomeMoneyback" css={css}>
      <div className="GHWHomeMoneyback">
        <section className="video-sec">
          
            <div className="rating-return-cnr container-fixed">
              <div className="rr-left-panel">
                <img className="videoImg" src="file/general/video-bg.png" alt=""/>
              </div>
              <div className="rr-right-panel">

                <div className="video-panel-item">
                  <div className="offer-img">
                    <img src="file/general/auto-ship-money-back-badge.svg" alt=""/>
                  </div>
                  <div className="video-cnt">
                    <div className="cnt-block">
                      <h2 className="vid-title">OmegaXL® Auto-Ship, 60 Day Money Back Guarantee </h2>
                      <p className="desc">If you are not satisfied with your auto-ship
                        purchase of OmegaXL, cancel your auto-ship within
                        60 days of your first purchase date.
                      </p>
                    </div>
                    <a href="#" className="read-more">Read More</a>
                  </div>

                </div>
                <div className="video-panel-item">
                  <div className="offer-img">
                    <img src="file/general/auto-ship-money-back-badge.svg" alt=""/>
                  </div>
                  <div className="video-cnt">
                    <div className="cnt-block">
                      <h2 className="vid-title">OmegaXL® Auto-Ship, 60 Day Money Back Guarantee </h2>
                      <p className="desc">For one-time purchases of OmegaXL, return
                        the entire purchase of unused, sealed bottles within
                        30 days for a refund (minus shipping &amp; handling). Any
                        free bottles, must be returned.
                      </p>
                    </div>
                    <a href="#" className="read-more">Read More</a>
                  </div>

                </div>

              </div>
            </div>
          
        </section>
        <section className="video-sec">
        <div className="main-cnr">
            <div className="video-container container-fixed">
            <div className="video-left-sec">                
            <img className="videoImg" src="file/general/video-bg.png" alt=""/>
            </div>
            <div className="video-right-sec">
                    <div className="video-panel-item">
                        <div className="offer-img">
                             <img src="./assets/images/offer-img1.svg" alt=""/>
                        </div>
                        <div className="video-cnt">
                            <div className="cnt-block">
                                <h2 className="vid-title">OmegaXL® Auto-Ship, 60 Day Money Back Guarantee </h2>
                                <p className="desc">If you are not satisfied with your auto-ship 
                                    purchase of OmegaXL, cancel your auto-ship within 
                                    60 days of your first purchase date.
                                </p>
                            </div>
                            <a href="#" className="read-more">Read More</a>
                        </div>

                    </div>
                    <div className="video-panel-item">
                        <div className="offer-img">
                            <img src="./assets/images/offer-img2.svg" alt=""/>
                       </div>
                        <div className="video-cnt">
                            <div className="cnt-block">
                                <h2 className="vid-title">OmegaXL® Auto-Ship, 60 Day Money Back Guarantee </h2>
                                <p className="desc">For one-time purchases of OmegaXL, return 
                                    the entire purchase of unused, sealed bottles within 
                                    30 days for a refund (minus shipping &amp; handling). Any 
                                    free bottles, must be returned.  
                                </p>
                            </div>
                            <a href="#" className="read-more">Read More</a>
                        </div>

                    </div>
            </div>
        </div>
    </div>
</section>
      </div>

    </Styled>
  );
};

export default GHWHomeMoneyback;
