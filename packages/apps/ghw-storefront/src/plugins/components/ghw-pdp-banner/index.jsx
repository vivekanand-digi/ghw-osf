import React, { useContext } from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import { ProductContext } from '@oracle-cx-commerce/react-ui/contexts';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';

const GHWPdpBanner = (props) => {
  const {
    displayName = '',
    x_pdpBanner: pdpBanner,
    x_pdpBannerSubtitle,
    x_pdpBannerTitle,
  } = useContext(ProductContext);

  return x_pdpBannerTitle && x_pdpBannerSubtitle ? (
    <Styled id="GHWPdpBanner" css={css}>
      <div className="GHWPdpBanner">
        <section className="quotes">
          <div className="container-fixed">
            <div className="content">
              <div className="title">{x_pdpBannerTitle}</div>
              <div className="sub-title">{x_pdpBannerSubtitle}</div>
              <a href="/product/OXL0005" className="shop-now-btn primary-btn-md">
                SHOP NOW <span className="arrow">&gt;</span>
              </a>
            </div>
            <div className="quotes-sec"></div>
          </div>
        </section>
      </div>
    </Styled>
  ) : null;
};

export default GHWPdpBanner;
