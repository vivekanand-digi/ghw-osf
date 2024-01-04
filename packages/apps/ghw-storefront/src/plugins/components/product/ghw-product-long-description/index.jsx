/* eslint-disable react/no-danger */
import Collapsible from '@oracle-cx-commerce/react-components/collapsible';
import React, {useContext} from 'react';
import {ProductContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from '@oracle-cx-commerce/react-widgets/product/product-long-description/styles.css';
/**
 * Product Long Description. A single Collapsible containing the description for a product
 */
export default function GHWProductLongDescription(props) {
  // context
  const {longDescription = ''} = useContext(ProductContext);

  // resources
  const {actionDescriptionViewProductInfo} = props;

  // configuration option
  const {descriptionExpanded = false} = props;

  return (
    <Styled id="GHWProductLongDescription" css={css}>
      <div className="GHWProductLongDescription">
        {/* <Collapsible expanded={descriptionExpanded} title={actionDescriptionViewProductInfo} {...props}> */}
          <div className="GHWProductLongDescription__Html" dangerouslySetInnerHTML={{__html: longDescription}}></div>
        {/* </Collapsible> */}
      </div>
    </Styled>
  );
}

