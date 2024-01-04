/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

 import React, { useContext } from 'react';
 import { ProductContext } from '@oracle-cx-commerce/react-ui/contexts';
 import Styled from '@oracle-cx-commerce/react-components/styled';
 import css from './about.css';
 
 /**
  * Renders placeholder boxes for Product details Page
  */
 const About = () => {
   const { x_about = '' } = useContext(ProductContext);
   return (
     <Styled id="About" css={css}>
        <div className="GHWProductDescription__Html" dangerouslySetInnerHTML={{ __html: x_about }}></div>
     </Styled>
   );
 };
 
 export default About;
 