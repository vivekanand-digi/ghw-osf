/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import PropTypes from 'prop-types';
import ProductImageSlider from '../product-image-slider';
import Thumbnails from '../product-image-thumbnails';
import css from './styles.css';

/**
 * Create a product image slider component with thumbnails based on admin selection
 */

const LOCATION_ABOVE = 'above';
const LOCATION_RIGHT = 'right';
const LOCATION_BELOW = 'below';
const LOCATION_LEFT = 'left';

const ProductImagePanel = props => {
  const {images, thumbs, thumbnailLocation, primaryImageTitle, currentIndex, setCurrentIndex, mobile} = props;

  /**
   * Set the current index for the image
   * @param  {Number} index
   */
  const setCurrentImageIndex = useCallback(
    index => {
      if (index <= 0 || index >= images.length) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(index);
      }
    },
    [images.length, setCurrentIndex]
  );

  return (
    <Styled id="ProductImageViewer__Panel" css={css}>
      <div
        className={
          thumbnailLocation === LOCATION_LEFT || thumbnailLocation === LOCATION_RIGHT
            ? 'ProductImageViewer__ThumbnailsVertical'
            : ''
        }
      >
        {/* displays thumbnail images */}
        {!mobile && (thumbnailLocation === LOCATION_ABOVE || thumbnailLocation === LOCATION_LEFT) && (
          <Thumbnails
            setCurrentImageIndex={setCurrentImageIndex}
            thumbs={thumbs}
            currentIndex={currentIndex}
            primaryImageTitle={primaryImageTitle}
          />
        )}

        <ProductImageSlider setCurrentImageIndex={setCurrentImageIndex} {...props} />

        {/* displays thumbnail images */}
        {!mobile && (thumbnailLocation === LOCATION_BELOW || thumbnailLocation === LOCATION_RIGHT) && (
          <Thumbnails
            setCurrentImageIndex={setCurrentImageIndex}
            thumbs={thumbs}
            currentIndex={currentIndex}
            primaryImageTitle={primaryImageTitle}
          />
        )}
      </div>
    </Styled>
  );
};

ProductImagePanel.propTypes = {
  /*
   * Index of the current image
   */
  currentIndex: PropTypes.number.isRequired,
  /*
   * Images array
   */
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  /*
   * Boolean to denote if mobile view is being used
   */
  mobile: PropTypes.bool.isRequired,
  /*
   * Title of the primary image
   */
  primaryImageTitle: PropTypes.string,
  /*
   * Callback function to set currentIndex
   */
  setCurrentIndex: PropTypes.func.isRequired,
  /*
   * Location of the thumbnail
   */
  thumbnailLocation: PropTypes.string.isRequired,
  /*
   * Thumbnails array
   */
  thumbs: PropTypes.arrayOf(PropTypes.string).isRequired
};

ProductImagePanel.defaultProps = {
  primaryImageTitle: undefined
};

export default ProductImagePanel;
