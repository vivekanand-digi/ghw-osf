/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, { useContext } from "react";

import Badge from "@oracle-cx-commerce/react-components/badge";
import Card from "@oracle-cx-commerce/react-components/card";
import Link from "@oracle-cx-commerce/react-components/link";
import { StoreContext } from "@oracle-cx-commerce/react-ui/contexts";
import Styled from "@oracle-cx-commerce/react-components/styled";
import css from "./styles.css";
import { PAGE_HOME_LINK } from "@oracle-cx-commerce/commerce-utils/constants";
import { formatCardNumber } from "@oracle-cx-commerce/react-components/utils/payment";
import { getCardTypes } from "@oracle-cx-commerce/commerce-utils/selector";
import { t } from "@oracle-cx-commerce/utils/generic";

import { useNavigator } from "@oracle-cx-commerce/react-components/link";
import ProfileDeleteSavedCard from "../profile-delete-saved-card";
//constants
const CONFIRM_DELETE_SAVED_CARD = "confirm-delete-saved-card/",
  SUCCESS = "success",
  ERROR = "error",
  TRUE = "true";

/**
 * UI component for a card.
 * It show basic detail of card like mask car number, name on card expiry date etc.
 * @param {*} props the required properties
 */
const ProfileSavedCard = (props) => {
  const goToPage = useNavigator();
  const { openModal = false } = props;
  const onCancel = () => {
    goToPage(PAGE_HOME_LINK);
  };
  const { action, getState } = useContext(StoreContext);
  const {
    actionDeleteCard,
    actionMakeDefault,
    alertMarkedDefaultCard,
    id,
    labelDeleteCardLink,
    labelMakeDefaultCardLink,
    labelSavedCard,
    textDefaultCard,
    textExpiryDate,
  } = props;

  const {
    savedCardId,
    isDefault,
    nameOnCard,
    expiryMonth,
    expiryYear,
    cardType,
    cardNumber,
  } = props.cardDetails;

  /**
   * This method returns card type object for given card type id
   * @param {string} cardType - the card type id
   */
  const getCard = (cardType) => {
    const cardTypes = getCardTypes(getState());

    return cardTypes[cardType];
  };

  //set alt text and src image icon for the card
  const card = getCard(cardType);
  let imgSrc = null;
  let cardImageAltText = cardType;
  if (card) {
    cardImageAltText = card.name;
    if (card.img) {
      imgSrc = card.img.url;
    }
  }

  /**
   * This method will trigger update action to make given card as default card
   * @param {String} savedCardId - the saved card id of the card which is going to be default card
   * @param {String} cardNumber - the saved card number
   */
  const onMarkDefaultCard = async (savedCardId, cardNumber) => {
    props.setInProgress(true);
    const response = await action("updateProfileSavedCard", {
      savedCardId,
      setAsDefault: TRUE,
    });
    if (response.ok) {
      const cardNum = cardNumber.substr(cardNumber.length - 4);
      props.setActionResponse({
        type: SUCCESS,
        message: t(alertMarkedDefaultCard, { cardNumber: cardNum }),
      });
      props.setInProgress(false);
    } else {
      props.setActionResponse({ type: ERROR, message: response.error.message });
      props.setInProgress(false);
    }
  };

  return (
    <Styled id="ProfileSavedCard" css={css}>
      <Card className="ProfileSavedCard card">
        
          {/* <div className="ProfileSavedCard__CardDetails">
            {cardImageAltText}
          </div> */}
          <div className='cc-logo-cnr'>
            <img
              className="ProfileSavedCard__CardImage"
              src={imgSrc}
              alt={cardImageAltText}
              
            />
            </div>
          <span className="ProfileSavedCard__CardText card-txt">{nameOnCard}</span>
          <span className="ProfileSavedCard__CardText card-txt">
            {formatCardNumber(cardNumber, cardType)}
          </span>
          {/* <span className="ProfileSavedCard__CardText">
            Expiry Date: {expiryMonth}/{expiryYear}
          </span> */}

          <div className="ProfileSavedCard__CardActionsContainer action-btn-cnr list">
              {isDefault ? (
                <Badge
                  badgeText={textDefaultCard}
                  ariaLabel={textDefaultCard}
                />
              ) : (
                <>
                  <button
                    type="button"
                    className="link-btn txt-btn"
                    onClick={() => onMarkDefaultCard(savedCardId, cardNumber)}
                    aria-describedby={`makeDefault-${id}${savedCardId}`}
                    disabled={props.inProgress}
                  >
                    Set as Default
                  </button>
                  <span
                    className="ProfileSavedCard__MakeDefault__HelpText"
                    id={`makeDefault-${id}${savedCardId}`}
                  >{`${t(labelSavedCard, {
                    cardNumber: cardNumber.substr(cardNumber.length - 4),
                    cardType,
                    nameOnCard,
                    expiryDate: `${expiryMonth}/${expiryYear}`,
                  })}${labelMakeDefaultCardLink}`}</span>
                </>
              )}
              <span
                aria-label={`${t(labelSavedCard, {
                  cardNumber: cardNumber.substr(cardNumber.length - 4),
                  cardType,
                  nameOnCard,
                  expiryDate: `${expiryMonth}/${expiryYear}`,
                })}${
                  isDefault ? ` ${textDefaultCard} ` : " "
                }${labelDeleteCardLink}`}
              >
                {/* <Link href={`${CONFIRM_DELETE_SAVED_CARD}${savedCardId}`}>
                  Delete
                </Link> */}
          </span>
          <Link href={`${CONFIRM_DELETE_SAVED_CARD}${savedCardId}`} className='icon-btn delete-btn'>
                  <img src='/file/general/delete-icon.svg' />
                </Link>
          </div>
      </Card>
    </Styled>
  );
};

export default ProfileSavedCard;
