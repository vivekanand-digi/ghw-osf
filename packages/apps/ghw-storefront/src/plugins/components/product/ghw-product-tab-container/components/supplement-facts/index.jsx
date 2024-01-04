/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

 import React, { useContext } from 'react';
 import { ProductContext } from '@oracle-cx-commerce/react-ui/contexts';
 import Styled from '@oracle-cx-commerce/react-components/styled';
 import css from './supplement-facts.css';

/**
 * Renders placeholder boxes for Product details Page
 */
const SupplementFacts = () => {
  const { x_supplementFacts = '' } = useContext(ProductContext);
  return (
    <Styled id="SupplementFacts" css={css}>
            <div className="GHWProductDescription__Html" dangerouslySetInnerHTML={{ __html: x_supplementFacts }}></div>
    </Styled>
  );
};

export default SupplementFacts;
