/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext, useMemo, useState} from 'react';
import Img from '@oracle-cx-commerce/react-components/img';
//import ProductPrice from '@oracle-cx-commerce/react-widgets/product/product-price/component';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {
  ContainerContext,
  ProductContext,
  ProductSelectionContext,
  StoreContext
} from '@oracle-cx-commerce/react-ui/contexts';
import Link from '@oracle-cx-commerce/react-components/link';
import css from '../styles.css';
import GHWProductAddToPurchasList from '../../../../ghw-product-add-to-saved-list';

const ProductItem = props => {
  const {product, recSetId} = props;
  const [selections, setSelections] = useState({});
  const {action} = useContext(StoreContext);

  useMemo(() => {
    const {variantOptionsSeed, variantToSkuLookup = []} = product;

    // For products with no variant options, the skuId is set in the initial state.
    const skuId = isEmptyObject(variantOptionsSeed) ? variantToSkuLookup[''] : null;
    if (!selections || skuId !== selections.skuId) {
      setSelections({
        skuId,
        variantOptions: {},
        qty: 1
      });
    }
  }, [product, selections]);

  const productSelection = {
    productId: product.id,
    skuId: selections.skuId,
    quantity: selections.qty
  };

  const onClick = () => {
    const payload = {product, recSetId};
    action('recommendationsClickThru', payload);
  };

  return (
    <Styled id="ProductItem" css={css}>
      <div className="ProductItem">
        <ProductContext.Provider value={product}>
          <ContainerContext.Provider value={{selections, setSelections}}>
            <ProductSelectionContext.Provider value={{productSelection}}>
              
                <div className="ProductItem__Image">
                  <Img src={product.primaryFullImageURL} alt={product.primaryImageAltText} size={'200,200'} />
                </div>
                <div className="ProductItem__DisplayName">{product.displayName}</div>
                <div className="ProductItem__Price">#{product.id}</div>  
            </ProductSelectionContext.Provider>
          </ContainerContext.Provider>
        </ProductContext.Provider>
        <Link href={product.route} onClick={onClick}>
        <button className = "add_to_cart">{props.addToCart}</button>
        </Link>
        <div className='saved_list'>
          <GHWProductAddToPurchasList product={product} productData={productSelection} />
        </div>
      </div>
    </Styled>
  );
};

export default ProductItem;
