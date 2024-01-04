import {
  ProductContext,
  ContainerContext,
  ProductSelectionContext,
} from "@oracle-cx-commerce/react-ui/contexts";
import React from "react";
import Region from "@oracle-cx-commerce/react-components/region";
import Styled from "@oracle-cx-commerce/react-components/styled";
import { fetchCurrentProductDetails } from "@oracle-cx-commerce/fetchers/product";
import PageLoader from "@oracle-cx-commerce/react-components/page-loader";
import { useComponentData } from "./selectors";
import ProductPlaceholder from "./components/product-placeholder";
import css from "./ghw-product-details-container.css";

export const fetchers = [fetchCurrentProductDetails];

/**
 * A container that holds all the product details related widgets.
 */
const GHWProductDetailsContainer = ({ regions = [] }) => {
  // selectors
  const {
    isProductFound,
    product,
    selections,
    setSelections,
    productSelection,
  } = useComponentData();
 
   const classname = `GHWProductDetailsContainer ${product.id}`;

  return (
    <Styled id="GHWProductDetailsContainer" css={css}>
      <div className={classname}>
        <PageLoader show={!isProductFound}>
          <ProductPlaceholder />
        </PageLoader>
        <ProductContext.Provider value={product}>
          <ContainerContext.Provider value={{ selections, setSelections }}>
            <ProductSelectionContext.Provider value={{ productSelection }}>
              <section
                className="GHWProductDetailsContainer__Section"
                style={{ visibility: isProductFound ? "visible" : "hidden" }}
              >
                {regions.map((regionId, index) => (
                  /*
                   Using region ids as keys causes unnecessary DOM reconciliation.
  
                   https://reactjs.org/docs/reconciliation.html#keys
                 */
                  <Region key={index} regionId={regionId} /> // eslint-disable-line react/no-array-index-key
                ))}
              </section>
            </ProductSelectionContext.Provider>
          </ContainerContext.Provider>
        </ProductContext.Provider>
      </div>
    </Styled>
  );
};

export default GHWProductDetailsContainer;
