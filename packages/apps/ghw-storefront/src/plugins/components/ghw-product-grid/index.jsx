import React, {useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';

const GHWProductGrid = props => {
  return (
    <Styled id="GHWProductGrid" css={css}>
      {/* <div className="GHWProductGrid"> Base Component GHWProductGrid: {t('Hello')}</div> */}
      <div className="GHWProductGrid">
        <div className="main-cnr main-container-fixed">
          <div className="grid-list">
            <div className="grid-list-item">
              <div className="grid-bg yellow-bg">
                <div className="btn-bg">
                  <a href="/" className="btn-info">
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
            <div className="grid-list-item">
              <div className="grid-bg brown-bg">
                <div className="btn-bg">
                  <a href="/" className="btn-info">
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
            <div className="grid-list-item">
              <div className="grid-bg green-bg">
                <div className="btn-bg">
                  <a href="/" className="btn-info">
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
            <div className="grid-list-item">
              <div className="grid-bg red-bg">
                <div className="btn-bg">
                  <a href="/" className="btn-info">
                    Buy Now
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

export default GHWProductGrid;
