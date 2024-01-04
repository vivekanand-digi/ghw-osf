import React, { useContext } from 'react';
import { ProductContext } from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import ProductImageBnr from './components/product-image-bnr';
/**
 * Displays a product's title using the displayName property from the product.
 */
const GHWProductLandingContent = () => {
  // context
  const { displayName = '' } = useContext(ProductContext);
  const { longDescription = '' } = useContext(ProductContext);
  const { fullImageURLs } = useContext(ProductContext);


  return (
    <Styled id="GHWProductLandingContent" css={css}>

      <div className="benefits-section">
				<div className="benefits-capsule-img">
          <ProductImageBnr classname="benefits-img" imageURL={fullImageURLs[0]} />
				</div>
				<div className="banner-content">          
            <div className="GHWProductDescription__Html" dangerouslySetInnerHTML={{ __html: longDescription }}></div>
        </div>
			</div>

    </Styled>

  );
};
export default GHWProductLandingContent;
