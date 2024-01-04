/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {useState, useEffect} from 'react';
import Radio from '@oracle-cx-commerce/react-components/radio';
import {noop, t} from '@oracle-cx-commerce/utils/generic';
import CardCVVIcon from '@oracle-cx-commerce/react-components/icons/card-cvv';
import WarningIcon from '@oracle-cx-commerce/react-components/icons/warning';
import {formatCardNumber, validateCVV} from '@oracle-cx-commerce/react-components/utils/payment';
import {PAYMENT_TYPE_CARD} from '@oracle-cx-commerce/commerce-utils/constants';

const CheckoutSavedCardItem = props => {
  const {
    labelSavedCard,
    id,
    labelCardCVV,
    cardTypes = {},
    cardDetails,
    selectedSavedCardId,
    onSelectSavedCard,
    setElementValidity,
    textFieldInvalid,
    textRequiredField,
    textExpiryDate,
    onInput = noop,
    isCardPaymentDisabled,
    selectedPaymentType
  } = props;

  const {savedCardId, nameOnCard, expiryMonth, expiryYear, cardType, cardNumber: maskedCardNumber} = cardDetails;

  const [cardCVV, setCardCVV] = useState('');

  const card = cardTypes[cardType];
  let imgSrc = null;
  let cardImageAltText = cardType;
  let cvvLength = 3;
  if (card) {
    cardImageAltText = card.name;
    cvvLength = card.cvvLength;
    if (card.img) {
      imgSrc = card.img.url;
    }
  }
  const cardCVVValidator = cardCVV =>
    validateCVV(cardCVV, card.cvvLength, {
      messageCardCVVInvalid: t(textFieldInvalid, {fieldName: labelCardCVV}),
      messageCardCVVRequired: textRequiredField
    });

  // set card cvv to empty on change of selected saved card
  // or if card payment is disabled
  const generateNDigitNumber = n => {
    if (n <= 0) {
      return 0; // Handle invalid input
    }

    const min = Math.pow(10, n - 1); // Minimum value for n digits
    const max = Math.pow(10, n) - 1; // Maximum value for n digits

    // Generate a random number between min and max
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber.toString();
  };
  useEffect(() => {
    // setCardCVV('');
    setCardCVV(generateNDigitNumber(cvvLength));
  }, [selectedSavedCardId, isCardPaymentDisabled]);

  /**
   * Called when cvv changes, calls onInput Callback to set saved card state to parent component.
   * @param {Object} event The event object
   */
  const onCVVChange = event => {
    const element = event.target;
    const cardCVV = element.value;
    const regex = /^[0-9]+$/;
    if (cardCVV === '' || regex.test(cardCVV)) {
      setCardCVV(cardCVV);
    }
    // element.setCustomValidity(cardCVVValidator(cardCVV));
    if (onInput) {
      onInput({
        savedCardId: selectedSavedCardId,
        type: PAYMENT_TYPE_CARD
      });
    }
  };
  const customeFormatCardNumber = (userName, number) => {
    return `${cardImageAltText} card ending - ${number.slice(-4)} ${userName}`
  }

  const isSavedCardSelected = selectedPaymentType === PAYMENT_TYPE_CARD && selectedSavedCardId === savedCardId;

  return (
    <div className={`CheckoutSavedCards__Item${isSavedCardSelected ? ' CheckoutSavedCards__Item--selected' : ''}`}>
      <div className="CheckoutSavedCards__RadioButtonContainer">
        <Radio
          className="CheckoutSavedCards__RadioButton"
          id={id}
          name={savedCardId}
          value={savedCardId}
          checked={isSavedCardSelected}
          disabled={isCardPaymentDisabled}
          onChange={e => onSelectSavedCard(e, generateNDigitNumber(cvvLength))}
          aria-label={t(labelSavedCard, {
            cardNumber: maskedCardNumber.substr(-4),
            cardType: card ? card.name : '',
            nameOnCard,
            expiryDate: `${expiryMonth}/${expiryYear}`
          })}
        ></Radio>
      </div>
      <div className="CheckoutSavedCards__CardTypeContainer">
        <img className="CheckoutSavedCards__CardTypeImg" src={imgSrc} alt={cardImageAltText} />
      </div>
      <div id={`cardDetails-${id}-${savedCardId}`} className="CheckoutSavedCards__CardDetailsContainer">
        <span className="CheckoutSavedCards__CardNumber">
          {customeFormatCardNumber(nameOnCard,formatCardNumber(maskedCardNumber, card ? card.repositoryId : ''))}
        </span>
        {/* <span>{nameOnCard}</span> */}
        <span id={`expiryDate-${id}-${savedCardId}`}>{t(textExpiryDate, {month: expiryMonth, year: expiryYear})}</span>
        {isSavedCardSelected && (
          <div className="CheckoutSavedCards__CvvDetailsContainer">
            {/* <label className="CheckoutSavedCards__CvvLabel" htmlFor={`cvv-${id}-${savedCardId}`}>
              {labelCardCVV}
            </label>
            <div className="CheckoutSavedCards__CvvInputContainer">
              <input
                type="password"
                className="CheckoutSavedCards__CvvInput"
                id={`cvv-${id}-${savedCardId}`}
                name="cardCVV"
                value={cardCVV}
                maxLength={cvvLength}
                disabled={isCardPaymentDisabled}
                onChange={onCVVChange}
                // onBlur={event => setElementValidity(event.target, cardCVVValidator)}
                required
              />
              <span className="CheckoutSavedCards__CvvIconContainer">
                <CardCVVIcon />
              </span>
            </div>
            <div className="CheckoutSavedCards__ErrorContainer">
              <span className="CheckoutSavedCards__ErrorMessage"></span>
              <span className="CheckoutSavedCards__ErrorIconContainer">
                <WarningIcon />
              </span>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSavedCardItem;
