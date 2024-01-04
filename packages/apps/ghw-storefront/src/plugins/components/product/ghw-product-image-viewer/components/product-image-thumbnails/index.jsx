/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import Img from '@oracle-cx-commerce/react-components/img';
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import PropTypes from 'prop-types';
import css from './product-image-thumbnails.css';

const ProductImageThumbnails = props => {
  const {thumbs, currentIndex, setCurrentImageIndex, primaryImageTitle} = props;

  return (
    <Styled id="ProductImageViewer__Thumbnails" css={css}>
      {/* <div className="ProductImageViewer__ThumbnailsWrapper"> */}
        <div className="ProductImageViewer__Thumbnails">
          {thumbs.map((value, index) => {
            const imgKey = `${value}_${index}`;

            return (
              <div key={imgKey} className={index === currentIndex ? 'ProductImageViewer__Thumbnail--selected' : ''}>
                <a 
                  onClick={() => setCurrentImageIndex(index)}
                  onKeyDown={() => setCurrentImageIndex(index)}
                  role="button"
                  tabIndex="0"
                >
                  <Img src={value} alt={primaryImageTitle} size="xsmall" outputFormat="JPEG" />
                </a>
              </div>
            );
          })}
        </div>
      {/* </div> */}
    </Styled>
  );
};

ProductImageThumbnails.propTypes = {
  /*
   * current image index.
   */
  currentIndex: PropTypes.number.isRequired,
  /*
   * Title of the primary image.
   */
  primaryImageTitle: PropTypes.string,
  /*
   * Callback function to set current image index.
   */
  setCurrentImageIndex: PropTypes.func.isRequired,
  /*
   * Thumbnails array.
   */
  thumbs: PropTypes.arrayOf(PropTypes.string).isRequired
};

ProductImageThumbnails.defaultProps = {
  primaryImageTitle: undefined
};

export default React.memo(ProductImageThumbnails);
