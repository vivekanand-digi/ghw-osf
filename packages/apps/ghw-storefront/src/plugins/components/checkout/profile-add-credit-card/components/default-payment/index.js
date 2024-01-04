/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {useState} from 'react';

import Checkbox from '@oracle-cx-commerce/react-components/checkbox';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from '@oracle-cx-commerce/react-widgets/profile/profile-add-credit-card/components/default-payment/styles.css';
import {noop} from '@oracle-cx-commerce/utils/generic';

/**
 * UI component for default payment option
 * User specify whether newly added card should be default card
 * @param {*} props the required properties
 */
const DefaultPayment = props => {
  const [isDefault, setDefault] = useState(true);
  const {id, labelDefaultPayment, updateCardPayload = noop} = props;

  /**
   * Checkbox handler method to handle value change
   * @param {Object} event the event object
   */
  const onChangeHandler = event => {
    setDefault(event.target.checked);
    updateCardPayload({
      setAsDefault: event.target.checked
    });
  };

  return (
    <Styled id="DefaultPayment" css={css}>
      <div className="DefaultPayment">
        <Checkbox
          checked={isDefault}
          onChange={onChangeHandler}
          id={`setAsDefault-${id}`}
          name="setAsDefault"
          labelText={labelDefaultPayment}
        ></Checkbox>
      </div>
    </Styled>
  );
};

export default DefaultPayment;
