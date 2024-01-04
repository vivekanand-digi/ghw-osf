/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, { useContext, useEffect, useState } from "react";

import Alert from "@oracle-cx-commerce/react-components/alert";
import Card from "@oracle-cx-commerce/react-components/card";
import { PAGE_PROFILE_ADD_CREDIT_CARD_LINK } from "@oracle-cx-commerce/commerce-utils/constants";
import ProfileSavedCard from "./components/profile-saved-card";
import PropTypes from "prop-types";
import { StoreContext } from "@oracle-cx-commerce/react-ui/contexts";
import Styled from "@oracle-cx-commerce/react-components/styled";
import { connect } from "@oracle-cx-commerce/react-components/provider";
import css from "./ghw-profile-saved-cards.css";
import { getPageData } from "./selectors";
import { useCardTypesFetcher } from "@oracle-cx-commerce/fetchers/payments/hooks";
import { useNavigator } from "@oracle-cx-commerce/react-components/link";

//constants
const PROFILE_ADD_CREDIT_CARD = PAGE_PROFILE_ADD_CREDIT_CARD_LINK,
  ERROR = "error";

/**
 * Top component for listing profile saved cards. It includes profile saved card sub component
 * It provides functionality to make a saved card as default card and provide
 * option to navigate to either add new card or delete existing card
 * @param {*} props the property object
 */
const GHWProfileSavedCards = (props) => {
  const {
    id,
    isUserLoggedIn,
    actionAddNewCard,
    headingSavedCreditCards,
    GHWProfileSavedCards = [],
  } = props;
  const [actionCompletedSuccessfully, setActionCompletedSuccessfully] =
    useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const store = useContext(StoreContext);
  const { action } = store;
  // local state to show action result in alert
  const [actionResponse, setActionResponse] = useState({
    type: "",
    message: "",
  });

  // Fetches the list of card types
  useCardTypesFetcher(store);

  //use effect to trigger list profile card actions
  useEffect(() => {
    if (!actionCompletedSuccessfully && isUserLoggedIn && !errorOccured) {
      action("listProfileSavedCards").then((response) => {
        if (response.ok) setActionCompletedSuccessfully(true);
        if (!response.ok) {
          const { error } = response;
          setActionResponse({ type: ERROR, message: error.message });
          setErrorOccured(true);
        }
      });
    }
  }, [action, actionCompletedSuccessfully, errorOccured, isUserLoggedIn]);

  const goToPage = useNavigator();

  /**
   * Function to navigate to add new card page
   */
  const gotoNewCardPage = () => {
    goToPage(PROFILE_ADD_CREDIT_CARD);
  };

  return (
    <Styled id="GHWProfileSavedCards" css={css}>
      {isUserLoggedIn && (
        <div className="GHWProfileSavedCards">
          {actionResponse.message && actionResponse.type && (
            <div className="GHWProfileSavedCards__ActionResponse">
              <Alert
                id={`ProfileAddCreditCard__Alert-${props.id}`}
                type={actionResponse.type}
                message={actionResponse.message}
              />
            </div>
          )}
          {actionCompletedSuccessfully &&
            (GHWProfileSavedCards.length === 0 ? (
                <Card
                  type="primary"
                  className="GHWProfileSavedCards__NoSavedCards"
                >
                  <span>No saved Credit Cards.</span>
                </Card>
            ) : (
              <div
                id={`savedCardsList-${id}`}
                className="GHWProfileSavedCards__Items"
              >
                <ProfileSavedCardList
                  GHWProfileSavedCards={GHWProfileSavedCards}
                  setActionResponse={setActionResponse}
                  inProgress={inProgress}
                  setInProgress={setInProgress}
                  {...props}
                />
              </div>
            ))}
        </div>
      )}
    </Styled>
  );
};

/**
 * Displays list of saved cards
 * @param props the required properties
 */
const ProfileSavedCardList = (props) => {
  //transform saved cards into a list of profile card item
  const savedCards = props.GHWProfileSavedCards.map((savedCard) => (
    <div key={savedCard.savedCardId} className="GHWProfileSavedCards__Item">
      <ProfileSavedCard cardDetails={savedCard} {...props} />
    </div>
  ));

  return savedCards;
};

GHWProfileSavedCards.propTypes = {
  id: PropTypes.string.isRequired,
  isUserLoggedIn: PropTypes.bool.isRequired,
  GHWProfileSavedCards: PropTypes.arrayOf(
    PropTypes.shape({
      cardType: PropTypes.string.isRequired,
      cardNumber: PropTypes.string.isRequired,
      expiryMonth: PropTypes.string.isRequired,
      expiryYear: PropTypes.string.isRequired, 
      nameOnCard: PropTypes.string.isRequired,
      isDefault: PropTypes.bool.isRequired,
      savedCardId: PropTypes.string.isRequired,
    })
  ),
};

GHWProfileSavedCards.defaultProps = {
  GHWProfileSavedCards: [],
};

export default connect(getPageData)(GHWProfileSavedCards);
