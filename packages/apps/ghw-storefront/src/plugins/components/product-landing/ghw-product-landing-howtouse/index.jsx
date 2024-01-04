import React, { useContext } from 'react';
import { ProductContext } from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
/**
 * Displays a product's title using the displayName property from the product.
 */
const GHWProductLandingHowtouse = () => {
  // context
  const { displayName = '' } = useContext(ProductContext);
  const { x_howToUse = '' } = useContext(ProductContext);


  return (
    <Styled id="GHWProductLandingHowtouse" css={css}>

      <div className="benefits-section">
				<div className="banner-content">          
            <div className="GHWProductDescription__Html" dangerouslySetInnerHTML={{ __html: x_howToUse }}></div>
        </div>
			</div>

    </Styled>

  );
};
export default GHWProductLandingHowtouse;
