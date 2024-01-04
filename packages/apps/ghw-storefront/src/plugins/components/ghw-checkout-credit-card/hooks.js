/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {useState, useEffect, useContext, useCallback, useRef} from 'react';
import {PaymentsContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {noop, isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {isAuthenticated, isCurrentUserB2B} from '@oracle-cx-commerce/commerce-utils/selector';
import {isAddressValid} from '@oracle-cx-commerce/react-components/utils/address';
import {PAYMENT_TYPE_CARD} from '@oracle-cx-commerce/commerce-utils/constants';
/** Function which fetches the list of saved cards if user is a logged in.
 * To be hooked into a widget to fetch the saved cards.
 * Invokes the listProfileSavedCardsForCurrentSite action which updates the saved cards for the current site in the redux state.
 */
export const useLoadSavedCards = () => {
  const {action, getState} = useContext(StoreContext);
  const isLoggedIn = isAuthenticated(getState());
  useEffect(() => {
    if (isLoggedIn) {
      action('listProfileSavedCardsForCurrentSite').then(response => {
        if (!response.ok) {
          const {error} = response;
          action('notify', {level: 'error', message: error.message});
        }
      });
    }
  }, [action, isLoggedIn]);
};
/** Function to maintain the card state in the credit card widget.
 * The card state contains the card details along with the seqNum.
 * The useAnotherCard local state variable is used to switch between choosing to select a saved card and entering new card details.
 * Provides utility functions to update card state, reset card state, update saved card state.
 * Provides a callback for addDifferentCard which updates useAnotherCard local state and resets the card state based on the passed in values.
 * Additionally when the card state is updated, checks whether the card details are valid and adds/removes the card details to the PaymentContext.
 * If an applied credit card payment group is passed as a parameter, the payment group id is passed while adding/updating the payment context.
 * @param {Object} isCardPaymentDisabled Determines whether the card payment is disabled.
 * @param {Object} cardFormRef The ref attached to the credit card form element, based on which the validity of the card details wil be determined.
 * @param {Object} appliedCreditCardPaymentGroup The applied credit card payment group.
 * @returns {Object} cardState The current cardState
 * @returns {Function} setCardState Function used to set the card state
 * @returns {boolean} useAnotherCard boolean used to toggle between choosing to entering card details or collapsing it.
 * @returns {Function} setUseAnotherCard Function to switch useAnotherCard boolean value.
 * @returns {Function} updateCardState(cardState) Utility Function to be used to merge the passed in card details with existing card state.
 * @returns {Function} updateSavedCard(savedCardState) Utility Function to update the card state with the passed in saved card details.
 * @returns {Function} addDifferentCard(useAnotherCard, isResetCardState) Utility Function to be called when user chooses to add a different card or collapse the add different card section.Internally sets the useAnotherCard and resets the card state based on the passed in values.
 */
export const useCardState = (isCardPaymentDisabled, cardFormRef, appliedCreditCardPaymentGroup) => {
  const [cardState, setCardState] = useState({});
  const [useAnotherCard, setUseAnotherCard] = useState(false);
  const {
    payments,
    selectedPaymentType,
    addOrUpdatePaymentToContext = noop,
    removePaymentFromContextBySeqNum = noop
  } = useContext(PaymentsContext) || {};
  const {getState} = useContext(StoreContext);
  const isB2BUser = isCurrentUserB2B(getState());
  // set the card number and the payment group id from the applied credit card payment group
  // set whether the applied payment group does not contain saved card id
  let appliedCardNumber, paymentGroupId, isAppliedPaymentGroupNotSavedCard;
  if (appliedCreditCardPaymentGroup && appliedCreditCardPaymentGroup.cardNumber) {
    appliedCardNumber = appliedCreditCardPaymentGroup.cardNumber.replace(/x/g, '*');
    paymentGroupId = appliedCreditCardPaymentGroup.paymentGroupId;
    isAppliedPaymentGroupNotSavedCard = appliedCreditCardPaymentGroup.savedCardId ? false : true;
  }
  const usePreviousValueRef = value => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);

    return ref.current;
  };
  const previousCardState = usePreviousValueRef(cardState);
  // this useEffect to reset seqNum number if card payment is not selected and payments array in payment context does not
  // contain payment of type card
  useEffect(() => {
    if (
      selectedPaymentType !== PAYMENT_TYPE_CARD &&
      cardState.seqNum !== undefined &&
      !payments.some(payment => payment.seqNum === cardState.seqNum)
    ) {
      setCardState(cardState => {
        const {seqNum, ...cardDetails} = cardState;

        return cardDetails;
      });
    }
  }, [cardState.seqNum, cardState, selectedPaymentType, payments]);
  const previousSelectedPaymentType = usePreviousValueRef(selectedPaymentType);
  // Updates payment context on change of card state
  useEffect(() => {
    const {billingAddress} = cardState;
    // Check whether billing address exist and is valid
    // no need to validate in case of saved card, as billing address will not exist in this case(set it as true)
    const isBillingAddressValid = billingAddress && !isAddressValid(billingAddress, isB2BUser) ? false : true;
    const isCardDetailsValid =
      cardFormRef && cardFormRef.current && cardFormRef.current.checkValidity() && isBillingAddressValid;
    // if the sequence number has been not changed,card state has changed and card details are valid
    // add card details to the context
    // If payment type has changed to card from some other payment type,then add the card details to the context
    if (
      !isEmptyObject(cardState) &&
      !isCardPaymentDisabled &&
      previousCardState.seqNum === cardState.seqNum &&
      (previousCardState !== cardState ||
        (selectedPaymentType === PAYMENT_TYPE_CARD && selectedPaymentType !== previousSelectedPaymentType)) &&
      isCardDetailsValid
    ) {
      // If there is an applied credit card payment group
      // Do not add the entered card number to the context if it same as applied card number
      // since it is masked and it cant be updated
      let cardDetailsToAddToContext = cardState;
      if (cardState.cardNumber && appliedCardNumber && appliedCardNumber === cardState.cardNumber) {
        const {cardNumber, ...remainingCardDetails} = cardState;
        cardDetailsToAddToContext = remainingCardDetails;
      }
      // add payment group id to the payload while updating the payment context
      // so updateAppliedPayment action is invoked with the passed in payment group id
      const seqNum = addOrUpdatePaymentToContext({...cardDetailsToAddToContext, paymentGroupId});
      if (seqNum !== cardState.seqNum) {
        setCardState({...cardState, seqNum});
      }
    } else if ((!isCardDetailsValid || isCardPaymentDisabled) && cardState.seqNum !== undefined) {
      // Remove the card details from the context if card details are not valid or it is disabled
      removePaymentFromContextBySeqNum(cardState.seqNum);
      setCardState(cardState => {
        const {seqNum, ...cardDetails} = cardState;

        return cardDetails;
      });
    }
  }, [
    addOrUpdatePaymentToContext,
    appliedCardNumber,
    cardFormRef,
    cardState,
    isB2BUser,
    isCardPaymentDisabled,
    paymentGroupId,
    previousCardState,
    previousSelectedPaymentType,
    removePaymentFromContextBySeqNum,
    selectedPaymentType
  ]);
  // If there is an applied credit card payment group and it does not have a savedCardId,
  // setUseAnotherCard to true so that credit card widget displays the previously entered card details.
  useEffect(() => {
    if (isAppliedPaymentGroupNotSavedCard) {
      setUseAnotherCard(true);
    }
  }, [isAppliedPaymentGroupNotSavedCard]);
  /**
   * Callback for updating card details to the card state
   * To be used for updating card details from checkout-card-details, checkout-billing-address and checkout-save-card-to-profile components
   * The passed in cardDetails will be merged with the existing card details in the state
   * @param {Object} cardDetails The card details
   */
  const updateCard = useCallback(cardDetails => {
    setCardState(paymentState => {
      return {...paymentState, ...cardDetails};
    });
  }, []);
  /**
   * Callback for updating saved card details to the card state
   * To be used for updating card details from checkout-saved-cards component.
   * @param {Object} savedCardDetails The saved card details
   */
  const updateSavedCard = useCallback(savedCardDetails => {
    setCardState(paymentState => {
      const {seqNum} = paymentState;

      return {...savedCardDetails, ...(seqNum !== undefined && {seqNum})};
    });
  }, []);
  /**
   * Handler for add different card
   * @param {boolean} addDifferentCard Indicates whether a new card information is to be entered
   * @param {boolean} resetCardState Indicates whether the card state has to be reset
   */
  const addDifferentCard = useCallback((addDifferentCard, isResetCardState = true) => {
    setUseAnotherCard(addDifferentCard);
    if (isResetCardState) {
      setCardState(paymentState => {
        const {seqNum} = paymentState;

        return {...(seqNum !== undefined && {seqNum})};
      });
    }
  }, []);

  return {
    cardState,
    setCardState,
    useAnotherCard,
    setUseAnotherCard,
    updateCard,
    updateSavedCard,
    addDifferentCard
  };
};
