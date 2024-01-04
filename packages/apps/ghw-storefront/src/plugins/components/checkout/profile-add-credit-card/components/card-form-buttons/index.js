/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {PAGE_PROFILE_LINK, PAGE_PROFILE_SAVED_CARDS_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import React, {useContext} from 'react';

import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from '@oracle-cx-commerce/react-widgets/profile/profile-add-credit-card/components/card-form-buttons/styles.css';
import {getSavedCardsForProfile} from '@oracle-cx-commerce/commerce-utils/selector';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';

/**
 * UI component for Card Form Buttons present on the form element
 * @param props the required properties
 */
const CardFormButtons = props => {
  const goToPage = useNavigator();
  const {getState} = useContext(StoreContext);

  /**
   * This method handles cancel button click
   */
  const handleCancel = () => {
    const profileSavedCards = getSavedCardsForProfile(getState());
    if (Object.keys(profileSavedCards.savedCardsMap || {}).length) goToPage(PAGE_PROFILE_SAVED_CARDS_LINK);
    else goToPage(PAGE_PROFILE_LINK);
  };

  return (
    <Styled id="CardButtons" css={css}>
      <div className="CardButtons">
        <div className="CardButtons__Row">
          <button className="CardButtons__Submit" type="submit" disabled={props.inProgress || props.isInvalid}>
            {props.actionSave}
          </button>
        </div>
        <div className="CardButtons__Row">
          <button
            type="button"
            disabled={props.inProgress}
            className="secondary CardButtons__Cancel"
            onClick={handleCancel}
          >
            {props.actionCancel}
          </button>
        </div>
      </div>
    </Styled>
  );
};

export default CardFormButtons;
