/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useState, useContext, useEffect} from 'react';

import Link from '@oracle-cx-commerce/react-components/link';
import {ProductContext} from '@oracle-cx-commerce/react-ui/contexts';
import {ProductListingContext} from '@oracle-cx-commerce/react-widgets/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import Img from './components/img';
import css from './styles.css';
import GHWProductResultCompare from '../ghw-product-result-compare';
/**
 * Displays a product image for use in search results
 */
const GHWProductResultImage = props => {
  const {mobile} = useContext(ProductListingContext);
  const {
    record = {},
    route = '',
    selection = {},
    list = [],
    setList = {},
    compareProductIds = [],
    setCompareProductIds = {}
  } = useContext(ProductContext);
  const [productId, setProductId] = useState(0);
  const [URL, updatedURL] = useState();

  // Get image url. If one has been set by selecting a color swatch, display that image
  const imageUrl =
    selection['imageUrl'] ||
    (record.attributes['sku.listingFullImageURL'] && record.attributes['sku.listingFullImageURL'][0]) ||
    (record.attributes['product.primaryFullImageURL'] && record.attributes['product.primaryFullImageURL'][0]);

  const altText =
    record.attributes['product.primaryImageAltText'] && record.attributes['product.primaryImageAltText'][0];

  // Determine the imageWidth
  const imageWidth = mobile ? 'var(--mobile-product-image-width)' : 'var(--desktop-product-image-width)';
  //const [list, setList] = useState([]);

  useEffect(() => {
    const url = window.location.href;
    const productId = url.split('?');
    setProductId(productId[1]);
    if (productId && productId[1]) {
      updatedURL(`${route}?${productId[1]}`);
    } else {
      updatedURL(route);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled id="GHWProductResultImage" css={css}>
      <div className="GHWProductResultImage">
        <GHWProductResultCompare
          list={list}
          compareProductIds={compareProductIds}
          setCompareProductIds={setCompareProductIds}
          setList={setList}
          imageUrl={imageUrl}
          altText={altText}
          {...props}
        />

        <Link href={URL} className="GHWProductResultImage">
          <Img
            className="GHWProductResultImage__Image"
            src={imageUrl}
            alt={altText}
            useSrcset={true}
            // size="100,100"
            // medium="120,120"
            // aspectRatio="80,80"
          />
        </Link>
      </div>
    </Styled>
  );
};

export default GHWProductResultImage;
