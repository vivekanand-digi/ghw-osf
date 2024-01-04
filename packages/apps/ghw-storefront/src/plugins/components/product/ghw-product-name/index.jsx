import React, { useContext, useEffect, useRef } from 'react';
import {
  ProductContext,
  StoreContext,
} from "@oracle-cx-commerce/react-ui/contexts";
import Styled from "@oracle-cx-commerce/react-components/styled";
import { useComponentData } from "../ghw-product-details-container/selectors";

import sleepxl from "../product-css/SLPXL0001.css";
import heartxl from "../product-css/HRT0001.css";
import immunxl from "../product-css/IXL0001.css";
import omegaxlsport from "../product-css/OXL0050.css";
import probioticxl from "../product-css/PXL0001.css";
import vitaminxlbComplete from "../product-css/VBC30001.css";
import vitaminxl from "../product-css/VD30001.css";
import omegaxl from "../product-css/OXL0005.css";
import turmericxl from "../product-css/TXL0001.css";

const GHWProductName = () => {
  const { product } = useComponentData();

  // context
  const { displayName = "" } = useContext(ProductContext);
  let productCssFiles;

  switch (product.id) {
    case "SLPXL0001":
      productCssFiles = sleepxl;
      break;

    case "HRT0001":
      productCssFiles = heartxl;
      break;

    case "IXL0001":
      productCssFiles = immunxl;
      break;

    case "OXL0050":
      productCssFiles = omegaxlsport;
      break;

    case "PXL0001":
      productCssFiles = probioticxl;
      break;

    case "VBC30001":
      productCssFiles = vitaminxlbComplete;
      break;

    case "VD30001":
      productCssFiles = vitaminxl;
      break;

    case "OXL0005":
      productCssFiles = omegaxl;
      break;

    case "TXL0001":
      productCssFiles = turmericxl;
      break;

    default:
      productCssFiles = omegaxl;
      break;
  }

  const productName = useRef(null);
  useEffect(() => {
    productName.current.innerHTML = displayName;
  }, [])

  return (
    <Styled id="GHWProductName" css={productCssFiles}>
      <div ref={productName} className="GHWProductName"></div>
    </Styled>
  );
};
export default GHWProductName;
