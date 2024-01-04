/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, { useContext } from 'react';
import { ProductContext } from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './how-to-use.css';

/**
 * Renders placeholder boxes for Product details Page
 */
const HowToUse = () => {
  const { x_howToUse = '' } = useContext(ProductContext);
  return (
    <Styled id="HowToUse" css={css}>
        <div className="GHWProductDescription__Html" dangerouslySetInnerHTML={{ __html: x_howToUse }}></div>
    </Styled>
  );
};

export default HowToUse;
