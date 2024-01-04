import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';

import css from './styles.css';

const GHWImageGrid = () => {
  return (
    <Styled id="GHWImageGrid" css={css}>
      <div className="GHWImageGrid">
        <div className="main-cnr main-container-fixed">
          <div className="grid-cnr">
            <div className="grid-item">
              <img src="/file/general/omegaxl-softgel.svg" alt="" />
            </div>
            <div className="grid-item">
              <div className="cnt-block">
                <div className="title-block">
                  <h1 className="title-txt">Standard</h1>
                  <h4 className="sub-title">Fish Oil Soft Gel</h4>
                </div>
                <p className="para">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.{' '}
                </p>
              </div>
            </div>
            <div className="grid-item grid-bg">
              <div className="grid-cnt">
                <h1 className="title">OMEGAXL</h1>
                <p className="para">
                  Support for Joint & Muscle Health. Mobilitv & Joint Dain Relief 30+ Fatty Acids Green-Lipped Mussels
                  No Fishy Aftertaste - 60 Softgels.{' '}
                </p>
                <a href="/" className="BuynowBtn">
                  Buy Now
                </a>
              </div>
            </div>
            <div className="grid-item">
              <img src="/file/general/omegaxl-softgel1.svg" alt="" />
            </div>
            <div className="grid-item blur-bg">
              <img src="/file/general/omegaxl-300ct.svg" alt="" />
              <div className="btn-bg">
                <a href="/" className="btn-info">
                  Buy Now
                </a>
              </div>
            </div>
            <div className="grid-item blur-bg">
              <img src="/file/general/omegaxl-other.svg" alt="" />
              <div className="btn-bg">
                <a href="/" className="btn-info">
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default GHWImageGrid;
