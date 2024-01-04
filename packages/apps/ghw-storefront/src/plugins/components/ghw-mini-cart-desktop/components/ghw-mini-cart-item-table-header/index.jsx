/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';

/**
 * It display cart items table header.
 *
 * @param {*} props
 */
const GHWMiniCartItemsTableHeader = props => {
  const {textPartNumber, textDescription, textQuantity, textTotal} = props;

  return (
    <Styled id="GHWMiniCartItemsTableHeader" css={css}>
      <div className="GHWMiniCartItemsTableHeader">
        <div className="GHWMiniCartItemsTableHeader__Text"></div>
        <div className="GHWMiniCartItemsTableHeader__Text GHWMiniCartItemsTableHeader__PartNumber">
          {textPartNumber}
        </div>
        <div className="GHWMiniCartItemsTableHeader__Text GHWMiniCartItemsTableHeader__Description">
          {textDescription}
        </div>
        <div className="GHWMiniCartItemsTableHeader__Text GHWMiniCartItemsTableHeader__Quantity">{textQuantity}</div>
        <div className="GHWMiniCartItemsTableHeader__Text GHWMiniCartItemsTableHeader__Total">{textTotal}</div>
      </div>
    </Styled>
  );
};

export default GHWMiniCartItemsTableHeader;
