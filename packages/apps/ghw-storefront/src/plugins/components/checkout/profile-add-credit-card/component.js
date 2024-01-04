/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback, useContext, useMemo, useState} from 'react';
import {
  getCardType,
  validateCVV,
  validateCardNumber,
  validateExpiryMonth,
  validateExpiryYear,
  validateRequiredField
} from '@oracle-cx-commerce/react-components/utils/payment';

import Alert from '@oracle-cx-commerce/react-components/alert';
import Form from '@oracle-cx-commerce/react-components/form';
import {PAGE_PROFILE_SAVED_CARDS_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import PropTypes from 'prop-types';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {WARNING_ICON_HTML} from '@oracle-cx-commerce/react-components/form/constants';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {isAddressValid} from '@oracle-cx-commerce/react-components/utils/address';
import {t} from '@oracle-cx-commerce/utils/generic';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {getCurrentProfileId} from '@oracle-cx-commerce/commerce-utils/selector';
import css from './styles.css';
import {getPageData} from './selectors';
import ProfileCardDetails from './components/card-details';
import CreditCardHostedFields from './components/credit-card-hosted-fields';
import AddressProvider from './providers/addressProvider';
import {HostedFieldsProviderContext} from './providers/hostedFieldsProvider';
import DefaultPayment from './components/default-payment';
import CardButtons from './components/card-form-buttons';
import BillingAddress from './components/billing-address';

//constants
const PROFILE_SAVED_CARDS = PAGE_PROFILE_SAVED_CARDS_LINK,
  INFO = 'info',
  ERROR = 'error';

/**
 * This is the top component which combines all the sub components of add credit card widget
 * It provides functionality to add a new credit/debit card to the profile
 * @param {Object} props the required properties
 */
const ProfileAddCreditCard = props => {
  const {hostedFieldsState, handleSubmit, cards, invalidFields, inProgress} = useContext(HostedFieldsProviderContext);
  const goToPage = useNavigator();
  const {action, getState} = useContext(StoreContext);
  const state = getState();
  const {cardTypes, isUserLoggedIn, isB2BUser, ...remProps} = props;
  const [selectedCardType, setSelectedCardType] = useState({});
  //card details
  const [cardPayload, setCardPayload] = useState({
    setAsDefault: true,
    billingAddress: {
      firstName: '',
      lastName: '',
      country: '',
      postalCode: '',
      state: '',
      address1: '',
      city: '',
      phoneNumber: ''
    }
  });
  const profileId = getCurrentProfileId(state);

  // local state to show action result in alert
  const [actionResponse, setActionResponse] = useState({type: '', message: ''});

  /**
   * Call back method which gets trigger on successful completion of action
   * It will navigated to the profile page.
   * @param {String} cardNumber - the saved card number
   */
  const onOk = useCallback(
    cardNumber => {
      action('notifyClearAll');
      const cardNum = cardNumber.substr(cardNumber.length - 4);
      action('notify', {level: INFO, message: t(remProps.alertCardAdded, {cardNumber: cardNum})});
      goToPage(PROFILE_SAVED_CARDS);
    },
    [action, goToPage, remProps.alertCardAdded]
  );

  /**
   * Call back method which gets trigger on occurrence of any error at server side while performing action
   * It will trigger 'notify' action to show relevant error message.
   */
  const onNotOk = useCallback(({error = {}}) => {
    setActionResponse({type: ERROR, message: error.message});
  }, []);

  /**
   * update card
   * @param {Object} update the card update object
   */
  const updateCardPayload = useCallback(update => {
    setCardPayload(card => {
      return {...card, ...update};
    });
  }, []);

  return (
    <Styled id="ProfileAddCreditCard" css={css}>
      <Form
        onSubmit={e => {
          handleSubmit(e, {
            profileId,
            makeDefault: cardPayload.setAsDefault,
            onNotOk,
            onOk
          });
        }}
        noValidate={true}
        enableUnsavedChangesTracking={true}
      >
        {useMemo(
          () =>
            isUserLoggedIn && (
              <>
                <div className="ProfileAddCreditCard">
                  <h1>{remProps.headingAddACreditCard}</h1>
                  {actionResponse.message !== '' && actionResponse.type !== '' && (
                    <div className="ProfileAddCreditCard__ActionResponse">
                      <Alert
                        id={`ProfileAddCreditCard__Alert-${remProps.id}`}
                        type={actionResponse.type}
                        message={actionResponse.message}
                      />
                    </div>
                  )}
                  <AddressProvider>
                    <CreditCardHostedFields {...remProps} />
                    <DefaultPayment {...remProps} updateCardPayload={updateCardPayload} />
                  </AddressProvider>
                  <CardButtons {...remProps} inProgress={inProgress} />
                </div>
              </>
            ),
          [actionResponse.message, actionResponse.type, inProgress, isUserLoggedIn, remProps, updateCardPayload]
        )}
      </Form>
    </Styled>
  );
};

ProfileAddCreditCard.propTypes = {
  /**
   * The unique id for the component
   */
  id: PropTypes.string.isRequired,

  /**
   * Flag to indicate if user is logged in or not.
   */
  isUserLoggedIn: PropTypes.bool.isRequired,

  /**
   * Flag to indicate if user is B2B user
   */
  isB2BUser: PropTypes.bool.isRequired,

  /**
   * Types of credit/debit cards
   */
  cardTypes: PropTypes.objectOf(
    PropTypes.shape({
      /**
       * card type mapped to card type's repository id
       */
      img: PropTypes.shape({
        /**
         * image url for card type
         */
        url: PropTypes.string.isRequired
      }).isRequired,

      /**
       * IIN value for card
       */
      iin: PropTypes.string.isRequired,

      /**
       * name of card type
       */
      name: PropTypes.string.isRequired,

      /**
       * repository id for card type
       */
      repositoryId: PropTypes.string.isRequired
    })
  )
};

/**
 * Default values for not required properties
 */
ProfileAddCreditCard.defaultProps = {
  cardTypes: undefined
};

export default connect(getPageData)(ProfileAddCreditCard);
