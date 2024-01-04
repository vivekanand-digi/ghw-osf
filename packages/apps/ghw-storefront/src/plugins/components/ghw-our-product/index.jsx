import React, {useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import PropTypes from 'prop-types';
import {StoreContext, ContainerContext} from '@oracle-cx-commerce/react-ui/contexts';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {t, isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import GenericCarousel from '@oracle-cx-commerce/react-components/generic-carousel';
import OurProductsItem from './components/our-products';
import css from './styles.css';

const GHWOurProduct = props => {
  const {desktopSlidesCount = 4, mobileSlidesCount = 1, mobile} = props;

  return (
    <Styled id="GHWOurProduct" css={css}>
      <div className="GHWOurProduct">
        <h1 className="h1-title">Our Products</h1>
        <div className="product-list container-fixed">
          <GenericCarousel
            slides={[<OurProductsItem />, <OurProductsItem />,<OurProductsItem />, <OurProductsItem />, <OurProductsItem />,]}
            mobile={mobile}
            showIndicator={true}
            isAutoSlide={false}
            itemsPerSlideDesktop={desktopSlidesCount}
            itemsPerSlideMobileCount={mobileSlidesCount}
          />
        </div>
      </div>
    </Styled>
  );
};

export default GHWOurProduct;
