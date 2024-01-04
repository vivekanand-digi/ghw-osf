//product faq

import React, { useContext, useEffect } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
import { useComponentData } from "./selectors.js";
import { ProductContext } from "@oracle-cx-commerce/react-ui/contexts";

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./styles.css";

const GHWSyndicateKnowledgeWidget = (props) => {
  const { product } = useComponentData();
  const { x_oSVCProductId = "" } = useContext(ProductContext);
  const { id = "" } = useContext(ProductContext);
  console.log("arpit FAQ x_oSVCProductId: ", x_oSVCProductId);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://ghw--tst2.widget.custhelp.com/euf/rightnow/RightNow.Client.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("This will run after 1 second!");
      window.RightNow.Client.Controller.addComponent(
        {
          display_answers_in_overlay: true,
          div_id: "product-faq",
          instance_id: "skw_0",
          truncate_size: 300,
          module: "KnowledgeSyndication",
          p: x_oSVCProductId,
          type: 3,
        },
        "https://ghw--tst2.widget.custhelp.com/ci/ws/get"
      );
      // console.log("FAQ for : ", p);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Styled id="GHWSyndicateKnowledgeWidget" css={css}>
      <div className="prod-detail faq-tab">
        <div className="text-icon-cnr">
          <div id="product-faq" className="content-info"></div>
          <div className="action-btn-center">
            <a className="shop-now primary-btn-md">
              SHOP NOW <span className="arrow">></span>
            </a>
          </div>
        </div>
        <div className="product-img">
          <img src={`/file/products/${id}-prod-md.png`} />
        </div>
      </div>
    </Styled>
  );
};

export default GHWSyndicateKnowledgeWidget;
