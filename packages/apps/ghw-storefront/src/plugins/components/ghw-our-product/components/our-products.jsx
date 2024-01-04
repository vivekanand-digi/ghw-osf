import React, {useState, useCallback, useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {noop} from '@oracle-cx-commerce/utils/generic';
import Link, {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {useNumberFormatter} from '@oracle-cx-commerce/react-components/utils/hooks';
import {StoreContext, ContainerContext} from '@oracle-cx-commerce/react-ui/contexts';

import {PAGE_HOME_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import css from './styles.css';

const OPTIONS = {style: 'currency'};

const OurProductsItem = props => {
  const {product, skuId, price, textAddToCart, alertPriceUnavailable, currentSiteId} = props;
  const {action} = useContext(StoreContext);
  const {isUserLoggedIn} = useContext(ContainerContext);

  const goToPage = useNavigator();
  // const formatCurrency = useNumberFormatter(OPTIONS);

  // state
  const [addToCartInProgress, setAddToCartInProgress] = useState(false);

  // helpers
  /**
   * Formats price and displays alternate text if null price
   * @param  {Number} price Price
   * @param  {String} altPriceMsg Alternate text when price is unavailable
   * @return {String} formattedPrice Formatted price based on locale
   */
  // const formatPrice = ({price, altPriceMsg}) => {
  //   return typeof price === 'number' ? formatCurrency(price) : altPriceMsg;
  // };
  // /**
  //  * Formats price and displays alternate text if null price
  //  * @param  {Number} price Price
  //  * @return {String} formattedPrice formattedPrice Formatted price based on locale
  //  */
  // const formatPriceWithAltMsg = price => {
  //   return formatPrice({price, altPriceMsg: alertPriceUnavailable});
  // };

  return (
    <Styled id="OurProductsItem" css={css}>
      <div className="OurProductsItem">
        <div className="product-list-item slick-slide slick-current slick-active">
          <div className="prod-top-sec">
            <img src="/file/general/OmegaXL-plp.svg" alt="" />
          </div>
          <div className="prod-bottom-sec">
            <div className="price-sec">
              <div className="price"> $15.00<span>$20.00</span></div>
              <Link className={'btnbg'} route={'/'} tabIndex={'0'} displayName={'Buy Now'} />
            </div>
            <div className="product-cnt">
              <h2 className="prod-title">OMEGAXL</h2>
              <p className="para">
                Support for Joint &amp; Muscle Health. Mobilitv &amp; Joint Dain Relief 30+ Fatty Acids
              </p>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default OurProductsItem;
