/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import InputText from '../../../commom/Icons/input-text';
import MoneyBackImg from '../../../commom/Icons/money-back-img';
import css from './styles.css';

const MoneyBackGuarantee = props => {
  const {orderItes = {}} = props;

  return (
    <Styled id="MoneyBackGuarantee" css={css}>
      <div className="MoneyBackGuarantee">
        <div className="capsule-detail money-back">
          <InputText />
          <span>Money Back Guarantee </span>
          <MoneyBackImg />
          <div>
            OmegaXL is backed by a 60-Day Money Back Guarantee. If you are not satisfied with the results within the
            first 60-days of your first purchase, Contact Us to learn how to take advantage of the guarantee. Click here
            for full Money Back Guarantee details.
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default MoneyBackGuarantee;
