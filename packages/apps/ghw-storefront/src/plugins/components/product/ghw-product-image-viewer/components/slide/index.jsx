/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import Img from '@oracle-cx-commerce/react-components/img';
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
/**
 * A single slide of the image slider
 * @param  {String} image
 * @param  {String} primaryImageTitle
 */
const Slide = props => {
  const {image, primaryImageTitle} = props;

  return (
    <Styled id="ProductImageViewer__Slide" css={css}>
      <div className="ProductImageViewer__Slide">
        <Img
          src={image}
          title={primaryImageTitle}
          alt={primaryImageTitle}
          size="medium"
          xsmall="400,400"
          large="940,940"
          outputFormat="JPEG"
          quality="0.8"
          aspectRatio="475,451"
        />
      </div>
    </Styled>
  );
};

export default React.memo(Slide);
