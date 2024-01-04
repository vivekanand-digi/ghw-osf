/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, { useContext, useState } from "react";

import Alert from "@oracle-cx-commerce/react-components/alert";
import { PAGE_PROFILE_SAVED_CARDS_LINK } from "@oracle-cx-commerce/commerce-utils/constants";
import PropTypes from "prop-types";
import { StoreContext } from "@oracle-cx-commerce/react-ui/contexts";
import Styled from "@oracle-cx-commerce/react-components/styled";
import { connect } from "@oracle-cx-commerce/react-components/provider";
import css from "./styles.css";
import { getPageData } from "./selectors";
import { getSavedCardsForProfile } from "@oracle-cx-commerce/commerce-utils/selector";
import { t } from "@oracle-cx-commerce/utils/generic";
import { useNavigator } from "@oracle-cx-commerce/react-components/link";

import Modal from '@oracle-cx-commerce/react-components/modal';
//constants
const PROFILE_SAVED_CARDS = PAGE_PROFILE_SAVED_CARDS_LINK,
  PROFILE = "profile",
  INFO = "info",
  ERROR = "error";

/**
 * Component for deleting a saved card
 * @param {object} props the required properties
 */
const ProfileDeleteSavedCard = (props) => {
  const {openModal = false, onCancel = noop} = props;
  const { action, getState } = useContext(StoreContext);
  const {
    actionConfirm,
    actionCancel,
    alertCardDeleted,
    cardTypes,
    id,
    isUserLoggedIn,
    savedCardId,
    headingConfirmCardDeletion,
    labelConfirmDeleteSavedCard,
    textCardRemove,
    textConfirmCardDeletionMessage,
  } = props;

  const goToPage = useNavigator();
  const [inProgress, setInProgress] = useState(false);
  // local state to show action result in alert
  const [actionResponse, setActionResponse] = useState({
    type: "",
    message: "",
  });

  /**
   * This method will navigate browser to profile saved card page
   */
  const gotoProfileSavedCardsPage = () => {
    goToPage(PROFILE_SAVED_CARDS);
  };

  /**
   * This method will navigate browser to profile page
   */
  const gotoProfilPage = () => {
    goToPage(PROFILE);
  };

  /**
   * This method will trigger action to remove a card.
   * @param {String} savedCardId - the saved card id of the card
   * @param {String} savedCardNumber - the saved card number
   */
  const onConfirmProfileDeleteSavedCard = async (
    savedCardId,
    savedCardNumber
  ) => {
    setInProgress(true);
    const response = await action("removeSavedCardFromProfile", {
      savedCardId,
    });
    if (response.ok) {
      action("notifyClearAll");
      action("notify", {
        level: INFO,
        message: t(alertCardDeleted, { cardNumber: savedCardNumber }),
      });
      setInProgress(false);
      const profileSavedCards = getSavedCardsForProfile(getState());
      if (Object.keys(profileSavedCards.savedCardsMap || {}).length)
        gotoProfileSavedCardsPage();
      else gotoProfilPage();
    } else {
      setActionResponse({ type: ERROR, message: response.error.message });
      setInProgress(false);
    }
  };

  /**
   * Get saved card for the given saved card id
   * @param {savedCardId} - the saved card id
   */
  const getSavedCardDetails = (savedCardId) => {
    const profileSavedCards = getSavedCardsForProfile(getState());
    if (profileSavedCards.savedCardsMap && savedCardId) {
      return profileSavedCards.savedCardsMap[savedCardId];
    }
    //if saved card map is empty or savedCardId is not available then goto saved card list page
    gotoProfileSavedCardsPage();
  };

  const savedCardDetails = getSavedCardDetails(savedCardId) || {};
  let savedCardNumber = savedCardDetails.cardNumber;
  if (savedCardNumber) {
    //display the last 4 chars of the cards, with formatting.
    savedCardNumber = savedCardNumber.substr(savedCardNumber.length - 4);
  }
  const card = cardTypes[savedCardDetails.cardType];
  let cardName = savedCardDetails.cardType;

  if (card) {
    cardName = card.name;
  }

  return (
    <Styled id="ProfileDeleteSavedCard" css={css}>
      <div>
        <Modal show={openModal} onClose={onCancel}>
          {isUserLoggedIn && savedCardNumber && (
            <div className="ProfileDeleteSavedCard">
              <h1>{headingConfirmCardDeletion}</h1>
              {actionResponse.message && actionResponse.type && (
                <div className="ProfileDeleteSavedCard__ActionResponse">
                  <Alert
                    id={`ProfileAddCreditCard__Alert-${props.id}`}
                    type={actionResponse.type}
                    message={actionResponse.message}
                  />
                </div>
              )}
              <Alert
                id={`ProfileDeleteSavedCard__Alert-${id}`}
                type={"warning"}
                message={
                  <div className="ProfileDeleteSavedCard__WarnMessageContainer">
                    <div className="ProfileDeleteSavedCard__WarnMessage">
                      {t(textCardRemove, {
                        cardtype: cardName,
                        cardnumber: savedCardNumber,
                      })}
                    </div>
                    <div className="ProfileDeleteSavedCard__WarnMessageHelp">
                      <p>{textConfirmCardDeletionMessage}</p>
                    </div>
                  </div>
                }
              />
              <div className="ProfileDeleteSavedCard__ButtonContainer">
                <button
                  type="button"
                  className="ProfileDeleteSavedCard__confirmButton"
                  aria-label={`${t(labelConfirmDeleteSavedCard, {
                    cardType: cardName,
                    cardNumber: savedCardNumber,
                  })} ${textConfirmCardDeletionMessage}`}
                  onClick={() =>
                    onConfirmProfileDeleteSavedCard(
                      savedCardId,
                      savedCardNumber
                    )
                  }
                  disabled={inProgress}
                >
                  {actionConfirm}
                </button>
                <button
                  type="button"
                  className="secondary ProfileDeleteSavedCard__cancelButton"
                  disabled={inProgress}
                  onClick={() => gotoProfileSavedCardsPage()}
                >
                  {actionCancel}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Styled>
  );
};

ProfileDeleteSavedCard.propTypes = {
  /**
   * The unique id for the component
   */
  id: PropTypes.string.isRequired,

  /**
   * Flag to indicate if user is logged in or not
   */
  isUserLoggedIn: PropTypes.bool.isRequired,

  /**
   * savedCardId of credit/debit card
   */
  savedCardId: PropTypes.string.isRequired,

  /**
   * Types of credit/debit cards
   */
  cardTypes: PropTypes.objectOf(
    PropTypes.shape({
      /**
       * Name of card type
       */
      name: PropTypes.string.isRequired,
    })
  ),
};

/**
 * Default values for not required properties
 */
ProfileDeleteSavedCard.defaultProps = {
  cardTypes: {},
};

export default connect(getPageData)(ProfileDeleteSavedCard);
