/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';

import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';

/**
 * Renders placeholder boxes for Product details Page
 */
const ProductPlaceholder = () => {
  return (
    <Styled id="ProductPlaceholder" css={css}>
      <div className="ProductPlaceholder">
        <div className="ProductPlaceholder__Img"></div>
        <div className="ProductPlaceholder__NavIcons"></div>
        <div className="ProductPlaceholder__Title"></div>
        <div className="ProductPlaceholder__Price"></div>
        <div className="ProductPlaceholder__Variants"></div>
        <div className="ProductPlaceholder__AddToCart"></div>
      </div>

      <div className="ProductPlaceholderDtp">
        <div className="ProductPlaceholderDtp__Left">
          <div className="ProductPlaceholderDtp__Thumbnails"></div>
          <div className="ProductPlaceholderDtp__Img"></div>
        </div>
        <div className="ProductPlaceholderDtp__Right">
          <div className="ProductPlaceholderDtp__Title"></div>
          <div className="ProductPlaceholderDtp__Price"></div>
          <div className="ProductPlaceholderDtp__Variants"></div>
          <div className="ProductPlaceholderDtp__AddToCart"></div>
          <div className="ProductPlaceholderDtp__AddToList"></div>
          <div className="ProductPlaceholderDtp__Desc"></div>
        </div>
        <div className="ProductPlaceholderDtp__Footer"></div>
      </div>
    </Styled>
  );
};

export default ProductPlaceholder;
