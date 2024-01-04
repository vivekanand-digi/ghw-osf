import React, { useContext } from 'react';
import { ProductContext } from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
/**
 * Displays a product's title using the displayName property from the product.
 */
const GHWProductLandingSupplement = () => {
  // context
  const { displayName = '' } = useContext(ProductContext);
  const { x_supplementFacts = '' } = useContext(ProductContext);


  return (
    <Styled id="GHWProductLandingSupplement" css={css}>

      <div className="benefits-section">
				<div className="banner-content">          
            <div className="GHWProductDescription__Html" dangerouslySetInnerHTML={{ __html: x_supplementFacts }}></div>
        </div>
			</div>

    </Styled>

  );
};
export default GHWProductLandingSupplement;
