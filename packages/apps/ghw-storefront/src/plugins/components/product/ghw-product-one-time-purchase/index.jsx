import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {useComponentData} from './selectors';
import css from './return-policy.css';
/**
 * Displays a product's title using the displayName property from the product.
 */
const GHWProductOneTimePurchase = props => {
  const {x_returnPolicy} = useComponentData();

  return (
    <Styled id="GHWProductOneTimePurchase" css={css}>
      {x_returnPolicy !== undefined ? (
        <div className="return-policy-cnr" dangerouslySetInnerHTML={{__html: x_returnPolicy}}></div>
      ) : (
        ''
      )}
    </Styled>
  );
};
export default GHWProductOneTimePurchase;
