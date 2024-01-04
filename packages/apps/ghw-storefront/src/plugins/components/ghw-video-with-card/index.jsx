import React, {useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';

const GHWVideoWithCard = props => {
  return (
    <Styled id="GHWVideoWithCard" css={css}>
      <div className="GHWVideoWithCard">
        <div className="GHWVideoWithCard-cnr">
          <div className="video-container container-fixed">
            <div className="video-left-sec">
              <img className="videoImg" src="/file/general/video-img1.svg" alt="" />
            </div>
            <div className="video-right-sec">
              <div className="video-panel-item">
                <div className="offer-img">
                  <img src="/file/general/offer-img1.svg" alt="" />
                </div>
                <div className="video-cnt">
                  <div className="cnt-block">
                    <h2 className="vid-title">OmegaXL® Auto-Ship, 60 Day Money Back Guarantee </h2>
                    <p className="desc">
                      If you are not satisfied with your auto-ship purchase of OmegaXL, cancel your auto-ship within 60
                      days of your first purchase date.
                    </p>
                  </div>
                  <a href="#" className="read-more">
                    Read More
                  </a>
                </div>
              </div>
              <div className="video-panel-item">
                <div className="offer-img">
                  <img src="/file/general/offer-img2.svg" alt="" />
                </div>
                <div className="video-cnt">
                  <div className="cnt-block">
                    <h2 className="vid-title">OmegaXL® Auto-Ship, 60 Day Money Back Guarantee </h2>
                    <p className="desc">
                      For one-time purchases of OmegaXL, return the entire purchase of unused, sealed bottles within 30
                      days for a refund (minus shipping & handling). Any free bottles, must be returned.
                    </p>
                  </div>
                  <a href="#" className="read-more">
                    Read More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default GHWVideoWithCard;
