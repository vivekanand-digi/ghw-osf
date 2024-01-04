/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  formatCardNumber,
  getCardType,
  isCardNumberNumericAndMatchesLength
} from '@oracle-cx-commerce/react-components/utils/payment';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import CardCVVIcon from '@oracle-cx-commerce/react-components/icons/card-cvv';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import css from '@oracle-cx-commerce/react-widgets/profile/profile-add-credit-card/components/card-details/styles.css';
import {getCardData} from '@oracle-cx-commerce/react-widgets/profile/profile-add-credit-card/components/card-details/selectors';
import {noop} from '@oracle-cx-commerce/utils/generic';
import {useCardTypesFetcher} from '@oracle-cx-commerce/fetchers/payments/hooks';

//constants
const NUMERIC_STRING_PATTERN = /^[0-9]+$/,
  CARD_NUMBER_INPUT_PATTERN = /\s+/g;

/**
 * UI component for Card Details.
 * User can provide card details information to add a new card
 * @param {Object} props the prop object
 */

const ProfileCardDetails = props => {
  const {
    cardTypes,
    id,
    updateCardPayload = noop,
    updateSelectedCardType = noop,
    validateElement = noop,
    ...remProps
  } = props;

  //card details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardType: {},
    expiryMonth: '',
    expiryYear: '',
    nameOnCard: ''
  });
  //The selected card type (based on the card number)
  //const [selectedCardType, setSelectedCardType] = useState({});
  // ref for card cvv ui element
  const cvvElementRef = useRef();
  // ref for month ui element
  const monthElementRef = useRef();
  // ref for year ui element
  const yearElementRef = useRef();

  const store = useContext(StoreContext);

  // Fetches the list of card types
  useCardTypesFetcher(store);

  /**
   * This method get trigger on change of value of input field.
   * @param {Object} event the onChange event
   */
  const onInputChange = event => {
    const fieldValue = event.target.value;
    const fieldName = event.target.name;
    if (fieldName === 'nameOnCard' || fieldValue === '' || NUMERIC_STRING_PATTERN.test(fieldValue)) {
      setCardDetails({...cardDetails, [fieldName]: fieldValue});
    }
  };

  /**
   * This method set/update card number in card details after removes non-numeric chars
   * and validating it against card types
   * @param {Object} event the card number change event
   */
  const onCardNumberChange = event => {
    const element = event.target;
    const rawCardNumber = event.target.value;
    const oldPos = event.target.selectionStart;
    // remembers cursor position and set it after repaint so that cursor
    // position for card number is not lost after formatting
    window.requestAnimationFrame(() => {
      const newPos = Math.max(0, element.value.length - rawCardNumber.length + oldPos);
      element.selectionStart = newPos;
      element.selectionEnd = newPos;
    });
    const fieldName = event.target.name;
    const cardNumber = event.target.value.replace(CARD_NUMBER_INPUT_PATTERN, '');
    const cardType = getCardType(cardNumber, cardTypes);
    const oldCardType = cardDetails.cardType;
    if (cardNumber === '' || isCardNumberNumericAndMatchesLength(cardNumber, cardType.length, true)) {
      const update =
        cardType.repositoryId !== oldCardType.repositoryId
          ? {[fieldName]: cardNumber, cardType}
          : {[fieldName]: cardNumber};
      setCardDetails({...cardDetails, ...update});
    }
    if (cardType.repositoryId !== oldCardType.repositoryId) {
      updateSelectedCardType(cardType);
    }
  };

  /** Validates expiry month or year element
   *  @param {Object} element the element to validate
   */
  const validateExpiryMonthYear = useCallback(
    element => {
      if (element && element.current && validateElement) {
        validateElement(element.current);
      }
    },
    [validateElement]
  );

  /**
   * Use effect for which get trigger on change of expiry month field.
   * It trigger validate method to validate expiry year.
   */
  useEffect(() => {
    if (monthElementRef && monthElementRef.current && !monthElementRef.current.validationMessage) {
      validateExpiryMonthYear(yearElementRef);
    }
  }, [cardDetails.expiryMonth, validateExpiryMonthYear]);

  /**
   * Use effect for which get trigger on change of expiry year field.
   * It trigger validate method to validate expiry month.
   */
  useEffect(() => {
    if (yearElementRef && yearElementRef.current && !yearElementRef.current.validationMessage) {
      validateExpiryMonthYear(monthElementRef);
    }
  }, [cardDetails.expiryYear, validateExpiryMonthYear]);

  /**
   * Use effect for which get trigger on change of card number.
   * It trigger validate method to validate card cvv.
   */
  useEffect(() => {
    // validate CVV when card type changes
    const cvvEl = cvvElementRef.current;
    if (cvvEl && cvvEl.value) {
      validateElement(cvvEl);
    }
  }, [cardDetails.cardType, validateElement]);

  // Call onInput callback to update the state in the parent component
  useEffect(() => {
    const currentYear = new Date().getUTCFullYear().toString();
    updateCardPayload({
      ...cardDetails,
      cardType: cardDetails.cardType.repositoryId,
      expiryYear: cardDetails.expiryYear ? `${currentYear.substr(0, 2)}${cardDetails.expiryYear}` : ''
    });
  }, [cardDetails, updateCardPayload]);

  return (
    <Styled id="CardDetails" css={css}>
      <div className="CardDetails">
        {/* Card Number */}
        <div className="CardDetails__Row CardDetails__CardNumberAndTypeContainer">
          <div className="CardDetails__CardNumberContainer">
            <label htmlFor={`cardNumber-${id}`}>{remProps.labelCardNumber}</label>
            <input
              type="text"
              id={`cardNumber-${id}`}
              name="cardNumber"
              value={formatCardNumber(cardDetails.cardNumber, cardDetails.cardType.repositoryId)}
              onChange={onCardNumberChange}
              required
              disabled={!cardTypes}
              autoComplete="cc-number"
              inputMode="numeric"
              className="CardDetails__cardNumber"
            />
            <span className="validationMessage"></span>
          </div>
          <div className="CardDetails__CardTypeContainer">
            <CardTypes cardTypes={cardTypes} selectedCardType={cardDetails.cardType.repositoryId} />
          </div>
        </div>
        <div className="CardDetails__ExpiryDateCvvRow">
          <div className="CardDetails__ExpiryDateElement">
            {/* Expiry Date */}
            <label htmlFor={`expiryMonth-${id}`}>{remProps.labelExpiryDate}</label>
            <div className="CardDetails__ExpiryDateInputRegion">
              <input
                className="ExpiryDateInput__Month"
                type="text"
                id={`expiryMonth-${id}`}
                name="expiryMonth"
                aria-label={remProps.labelExpiryMonth}
                ref={monthElementRef}
                value={cardDetails.expiryMonth}
                onChange={onInputChange}
                maxLength={2}
                required
                autoComplete="cc-exp-month"
                inputMode="numeric"
              />
              <span className="CardDetails__ExpiryDateSeparator">/</span>
              <input
                className="ExpiryDateInput__Year"
                type="text"
                id={`expiryYear-${id}`}
                name="expiryYear"
                aria-label={remProps.labelExpiryYear}
                ref={yearElementRef}
                value={cardDetails.expiryYear}
                onChange={onInputChange}
                maxLength={2}
                required
                autoComplete="cc-exp-year"
                inputMode="numeric"
              />
            </div>
            <div className="CardDetails__ErrorContainer">
              <span className="validationMessage"></span>
            </div>
          </div>
          {/* CVV */}
          {/* <div className="CardDetails__Cvv">
            <label htmlFor={`cardCVV-${id}`}>{remProps.labelCardCVV}</label>
            <div className="CardDetails__CvvInputAndCCVIconContainer">
              <input
                className="CardDetails__CvvInput"
                type="password"
                id={`cardCVV-${id}`}
                name="cardCVV"
                required
                disabled={!cardTypes}
                ref={cvvElementRef}
                maxLength={cardDetails.cardType.cvvLength || 3}
                value={cardDetails.cardCVV}
                onChange={onInputChange}
              />
              <CardCVVIcon />
            </div>
            <div className="CardDetails__ErrorContainer">
              <span className="validationMessage"></span>
            </div>
          </div> */}
        </div>
        <div className="CardDetails__Row">
          {/* Name on Card */}
          <label htmlFor={`nameOnCard-${id}`}>{remProps.labelNameOnCard}</label>
          <input
            type="text"
            id={`nameOnCard-${id}`}
            name="nameOnCard"
            value={cardDetails.nameOnCard}
            autoCapitalize="words"
            onChange={onInputChange}
            required
            autoComplete="cc-name"
          />
          <span className="validationMessage"></span>
        </div>
      </div>
    </Styled>
  );
};

/**
 * UI component for Card Types
 */
const CardTypes = props => {
  const {cardTypes = {}, selectedCardType} = props;

  return (
    <div className="CardTypes">
      {cardTypes &&
        Object.entries(cardTypes).map(([key, {img = {}, name}]) => {
          return (
            <img
              key={key}
              src={img.url}
              alt={name}
              className={`CardTypes__Icon${key !== selectedCardType ? ' CardTypes__Icon--Inactive' : ''}`}
            />
          );
        })}
    </div>
  );
};

export default connect(getCardData)(ProfileCardDetails);
