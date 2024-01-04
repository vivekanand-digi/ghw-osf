import React, {useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {t} from '@oracle-cx-commerce/utils/generic';
import css from './styles.css';
/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */

const GHWBrandAmbassador = props => {
  const {teammember1, teammember2, teammember3, role1, role2, role3, image1, image2, image3} = props;

  return (
    <Styled id="GHWBrandAmbassador" css={css}>
      <section className="our-team">
        <h1 className="h1-title">Meet our Brand Ambassadors (Obsolute)</h1>
        <div className="team-list container-fixed slick-initialized slick-slider slick-dotted">
          <button
            className="slick-prev slick-arrow"
            aria-label="Previous"
            type="button"
            style={{display: 'inline-block'}}
          >
            Previous
          </button>
          <div className="slick-list draggable">
            <div className="slick-track" style={{opacity: 1}}>
              <div
                className="team-list-item slick-slide slick-cloned"
                data-slick-index="-3"
                id=""
                aria-hidden="true"
                tabIndex="-1"
                style={{width: '429px'}}
              >
                <div className="user-icon">
                  <img src="/file/general/ambassodor-1.png" alt="" />
                  <div className="content">
                    <div className="name">John Walsh</div>
                    <div className="role">TV Host</div>
                  </div>
                </div>
              </div>
              <div
                className="team-list-item slick-slide slick-cloned"
                data-slick-index="-3"
                id=""
                aria-hidden="true"
                tabIndex="-1"
                style={{width: '429px'}}
              >
                <div className="user-icon">
                  <img src="/file/general/ambassodor-2.png" alt="" />
                  <div className="content">
                    <div className="name">Dr. Sharon McQuillan</div>
                    <div className="role">Chief Science Officer, Great HealthWorks</div>
                  </div>
                </div>
              </div>
              <div
                className="team-list-item slick-slide slick-cloned"
                data-slick-index="-3"
                id=""
                aria-hidden="true"
                tabIndex="-1"
                style={{width: '429px'}}
              >
                <div className="user-icon">
                  <img src="/file/general/ambassodor-3.png" alt="" />
                  <div className="content">
                    <div className="name">Blair Underwood</div>
                    <div className="role">Award Winning Actor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="slick-next slick-arrow" aria-label="Next" type="button" style={{display: 'inline-block'}}>
            Next
          </button>
          <ul className="slick-dots" style={{}} role="tablist">
            <li className="slick-active" role="presentation">
              <button
                type="button"
                role="tab"
                id="slick-slide-control10"
                aria-controls="slick-slide10"
                aria-label="1 of 2"
                tabIndex="0"
                aria-selected="true"
              >
                1
              </button>
            </li>
            <li role="presentation">
              <button
                type="button"
                role="tab"
                id="slick-slide-control11"
                aria-controls="slick-slide13"
                aria-label="2 of 2"
                tabIndex="-1"
              >
                2
              </button>
            </li>
          </ul>
        </div>
      </section>
    </Styled>
  );
};

export default GHWBrandAmbassador;
