import React, {useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';

const GHWFeaturedProducts = props => {
  return (
    <Styled id="GHWFeaturedProducts" css={css}>
      {/* <div className="GHWFeaturedProducts"> Base Component GHWFeaturedProducts: {t('Hello')}</div> */}
      <div className="GHWFeaturedProducts">
        <div className="main-cnr main-container-fixed">
          <h1 className="h1-title">Featured Products </h1>
          <div className="prod-container">
            <div className="prod-left-sec">
              <h2 className="h2-title">Sustainably sourced form New Zealand Green-Lipped Mussels</h2>
              <p className="desc">
                OmegaXL achieved an environmental milestone years ago, with the New Zealand Department of Fisheries,
                ensuring the eco-sustainability of the New Zealand Green-Lipped Mussel. Our farming process is both
                eco-friendly and sustainable.
              </p>
            </div>
            <div className="line"></div>
            <div className="prod-right-sec">
              <h1 className="h1">Mussels </h1>
              <p className="desc-txt">For your Joints</p>
              <a className="buynowBtn">
                Buy Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default GHWFeaturedProducts;
