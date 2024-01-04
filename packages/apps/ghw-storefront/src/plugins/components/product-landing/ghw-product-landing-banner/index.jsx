import React, { useContext } from 'react';
import { ProductContext } from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import ProductImageBnr from './components/product-image-bnr';
/**
 * Displays a product's title using the displayName property from the product.
 */
const GHWProductLandingBanner = () => {
  // context
  const { displayName = '' } = useContext(ProductContext);
  const { description = '' } = useContext(ProductContext);
  const { fullImageURLs } = useContext(ProductContext);


  return (
    <Styled id="GHWProductLandingBanner" css={css}>
     
      <div className="banner-section">
      <div className="banner-cnr">
        <div >
        <ProductImageBnr imageURL={fullImageURLs[0]} />
        </div>
      
        <div className="banner-content">
          <h1 className="capsule-title">{displayName}</h1>
          <div className="GHWProductDescription__Html" dangerouslySetInnerHTML={{ __html: description }}></div>
          <button className="buy-btn" type="button">
            Buy Now
          </button>
        </div>
      </div>
      </div>

    </Styled>

  );
};
export default GHWProductLandingBanner;
