/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import PropTypes from 'prop-types';
import css from './styles.css';
import ProductImageExpand from '../product-image-expand';

const ProductImageSliderControls = props => {
  const {
    images,
    currentIndex,
    setCurrentImageIndex,
    labelImageSelected,
    labelNextImage,
    showExpand,
    labelExpand,
    setPortalRenderedCallback,
    portalRendered,
    mobile
  } = props;

  return (
    <Styled id="ProductImageViewer__SliderControls" css={css}>
      <div
        className={`${mobile ? 'ProductImageViewer__SliderControls--Mobile' : 'ProductImageViewer__SliderControls'}`}
      >
        {images.length > 1 && (
          <ul className="ProductImageViewer__SliderIndicators">
            {images.map((value, index) => {
              const imgKey = `${value}_${index}`;

              return (
                <li key={imgKey}>
                  <button
                    className="ProductImageViewer__SliderIndicatorButton"
                    aria-label={index === currentIndex ? labelImageSelected : labelNextImage}
                    aria-pressed={index === currentIndex}
                    onClick={() => setCurrentImageIndex(index)}
                    type="button"
                  ></button>
                </li>
              );
            })}
          </ul>
        )}

        {showExpand && (
          <ProductImageExpand
            labelExpand={labelExpand}
            setPortalRenderedCallback={setPortalRenderedCallback}
            portalRendered={portalRendered}
          />
        )}
      </div>
    </Styled>
  );
};

ProductImageSliderControls.propTypes = {
  /*
   * Current image index.
   */
  currentIndex: PropTypes.number.isRequired,
  /*
   * Images array.
   */
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  /*
   * Boolean to denote if mobile view is being used.
   */
  mobile: PropTypes.bool.isRequired,
  /*
   * Boolean to denote if portal is rendered.
   */
  portalRendered: PropTypes.bool.isRequired,
  /*
   * Callback function to set current image index.
   */
  setCurrentImageIndex: PropTypes.func.isRequired,
  /*
   * Callback function to set portal rendered.
   */
  setPortalRenderedCallback: PropTypes.func.isRequired,
  /*
   * Boolean to denote if expand is to be shown.
   */
  showExpand: PropTypes.bool.isRequired
};

export default React.memo(ProductImageSliderControls);
