import React, { useContext, useState, useEffect } from 'react';
import { ProductContext } from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import { Tab, TabContainer } from '@oracle-cx-commerce/react-components/tabs';
import About from './components/about';
import Faqs from './components/faqs';
import SupplementFacts from './components/supplement-facts';
import Review from './components/review';
import HowToUse from './components/how-to-use';
import css from './ghw-product-tab-container.css';

/**
 * Displays a product's title using the displayName property from the product.
 */
const GHWProductTabContainer = () => {
  // context
  const { fullImageURLs, x_offerType = '' } = useContext(ProductContext);
  const [imageURL, setImageURL] = useState(fullImageURLs);

  useEffect(() => {
    setImageURL(fullImageURLs);
  }, [fullImageURLs]);

  console.log("x_offerType: ", x_offerType);

  return x_offerType == 'singleOffer' ? (
    <Styled id="GHWProductTabContainer" css={css}>
      <div className="GHWProductTabContainer">
        <TabContainer>
          <Tab header="About" key="About">
            {imageURL && imageURL.length ? <About imageURL={imageURL[0]} /> : ''}
          </Tab>
          <Tab header="How to Use" key="How-to-Use">
            <HowToUse />
          </Tab>
          <Tab header="Supplement Facts" key="Supplement-Facts">
            <SupplementFacts />
          </Tab>
          <Tab header="FAQs" key="faqs">
            <Faqs />
          </Tab>
        </TabContainer>
      </div>
    </Styled>
  ) : null;
};

export default GHWProductTabContainer;
