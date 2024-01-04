/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {useState, useEffect} from 'react';
import Checkbox from '@oracle-cx-commerce/react-components/checkbox';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {noop} from '@oracle-cx-commerce/utils/generic';
import css from './styles.css';
import {isLoggedIn} from './selectors';

/**
 * Widgets that displays option to save card to profile.
 */
const CheckoutSaveCardToProfile = props => {
  const {
    appliedPaymentGroupSaveCardToProfile,
    onInput = noop,
    labelSaveCardToProfile,
    id,
    useAnotherCard = true,
    isLoggedIn = false,
    isPaymentDisabled = false
  } = props;
  const [saveCard, setSaveCard] = useState(true);

  // call onInput callback to update save card to profile state to parent component
  useEffect(() => {
    if (isLoggedIn && useAnotherCard) {
      onInput({saveCard});
    }
  }, [saveCard, onInput, useAnotherCard, isLoggedIn]);

  // If appliedCreditCardPaymentGroup contains saveCard field, update the state with the field value.
  useEffect(() => {
    if (appliedPaymentGroupSaveCardToProfile !== undefined) {
      setSaveCard(appliedPaymentGroupSaveCardToProfile);
    }
  }, [appliedPaymentGroupSaveCardToProfile]);

  return (
    <Styled id="CheckoutSaveCardToProfile" css={css}>
      <div>
        {isLoggedIn ? (
          <div className="CheckoutSaveCardToProfile">
            <Checkbox
              className="CheckoutSaveCardToProfile_Checkbox"
              checked={saveCard}
              disabled={isPaymentDisabled}
              onChange={() => {
                setSaveCard(!saveCard);
              }}
              id={id}
              name="saveCardToProfile"
              labelText={labelSaveCardToProfile}
            ></Checkbox>
          </div>
        ) : null}
      </div>
    </Styled>
  );
};

export default connect(isLoggedIn)(CheckoutSaveCardToProfile);
