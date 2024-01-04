/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';

import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';

/**
 * Renders placeholder boxes for Product details Page
 */
const ProductImageBnr = props => {
  const {imageURL} = props;

  return (
    <Styled id="ProductImageBnr" css={css}>
      <section className="ProductImageBnr col-5">
        <div>
          <img className="prod-image" src={imageURL} alt="money-back-badge" />
        </div>
      </section>
    </Styled>
  );
};

export default ProductImageBnr;
