import React, { useContext } from 'react';
import { ProductContext } from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
/**
 * Displays a product's title using the displayName property from the product.
 */
const GHWProductLandingDetail = () => {
  // context
  const { displayName = '' } = useContext(ProductContext);
  const { description = '' } = useContext(ProductContext);
  const { x_benefits = '' } = useContext(ProductContext);

  return (
    <Styled id="GHWProductLandingDetail" css={css}>

      <div className="offer-section">
        <div className="offer-cnr">
          <div dangerouslySetInnerHTML={{ __html: x_benefits }}></div>

          <div className="offer-onetime">
            <div className="offer-title">one-time purchase</div>
            <div className="offer-cost">$219.95</div>
          </div>
        </div>
        <div className="offer-purchase-sect">
          <div className="offer-title">{displayName}</div>
          <div className="offer-capsule-info" dangerouslySetInnerHTML={{ __html: description }}></div>

          <a className="offer-buy-now">Buy Now </a>
        </div>
      </div>

    </Styled>

  );
};
export default GHWProductLandingDetail;
