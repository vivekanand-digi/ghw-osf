/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';

import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';

/**
 * Renders placeholder boxes for Order Confirmation details Page
 * @memberof Components
 * @class OrderConfirmationPlaceholder
 * @category Component-list
 * @author Oracle
 * @since 2.10.0
 */
const OrderConfirmationPlaceholder = () => {
  return (
    <Styled id="OrderConfirmationPlaceholder" css={css}>
      <div className="OrderConfirmationPlaceholder">
        <div className="OrderConfirmationPlaceholder__Heading"></div>
        <div className="OrderConfirmationPlaceholder__ConfirmationDetails"></div>
        <div className="OrderConfirmationPlaceholder__ContinueShopping"></div>
      </div>
    </Styled>
  );
};

export default OrderConfirmationPlaceholder;
