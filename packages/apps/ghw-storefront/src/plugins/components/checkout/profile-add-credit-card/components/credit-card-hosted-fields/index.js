import CardCVVIcon from '@oracle-cx-commerce/react-components/icons/card-cvv';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useContext, useEffect, useState} from 'react';

import {useInitializeWidget} from '../../../../fetchers/hooks';
import {getWidgetInfo} from '../../../../selectors';
import {Braintree} from '../../../helpers/braintree-loader';
import icons from '../../../helpers/icons';

import css from './styles.css';
import {HostedFieldsProviderContext} from '../../providers/hostedFieldsProvider';

const cardTypeFormat = type => type.replace(/\s+/g, '').toLowerCase();
const isInvalidField = invalidFields => id => invalidFields.includes(id);

const loadBraintreeWidget = async (props, state) => {
  const {clientToken, cardHolderNamePlaceHolder, cardNumberPlaceHolder, cardExpirationPlaceHolder, cardCvvPlaceHolder} =
    props;
  const {setHostedFieldsState} = state;
  const braintree = await Braintree();
  const clientInstance = await braintree.client.create({authorization: clientToken});
  const hostedFieldsInstance = await braintree.hostedFields.create({
    client: clientInstance,
    fields: {
      cardholderName: {
        selector: '#card-name',
        placeholder: cardHolderNamePlaceHolder
      },
      number: {
        selector: '#card-number',
        placeholder: cardNumberPlaceHolder
      },
      cvv: {
        selector: '#card-cvv',
        placeholder: cardCvvPlaceHolder
      },
      expirationDate: {
        selector: '#card-expiration',
        placeholder: cardExpirationPlaceHolder
      }
    }
  });
  setHostedFieldsState(hostedFieldsInstance);
};

/**
 * UI component for Card Types
 */
const CardTypes = ({cardTypes, selectedCardType}) => {
  if (!cardTypes) {
    return null;
  }

  return (
    <div className="CardTypes">
      {[...cardTypes, {niceType: 'generic'}].map(({niceType}) => {
        const cardTypeToPropName = cardTypeFormat(niceType);

        return (
          <React.Fragment key={cardTypeToPropName}>
            {icons.hasOwnProperty(cardTypeToPropName) && (
              <div
                className={`CardTypes__Icon${
                  selectedCardType && selectedCardType !== cardTypeToPropName ? ' CardTypes__Icon--Inactive' : ''
                }`}
              >
                {icons[cardTypeToPropName]()}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const CreditCardHostedFields = props => {
  const {hostedFieldsState, setHostedFieldsState, cards, invalidFields, setInProgress} =
    useContext(HostedFieldsProviderContext);
  const {clientToken} = props;
  const store = useContext(StoreContext);
  const [selectedCardType, setSelectedCardType] = useState();
  const invalidFieldsListToCheck = isInvalidField(invalidFields);

  useInitializeWidget(store);

  useEffect(() => {
    setInProgress(true);
    if (!clientToken) {
      return;
    }

    loadBraintreeWidget(props, {
      setHostedFieldsState
    }).finally(() => {
      setInProgress(false);
    });
  }, [clientToken, props, setHostedFieldsState, setInProgress]);

  useEffect(() => {
    if (!hostedFieldsState) {
      return;
    }

    hostedFieldsState.on('cardTypeChange', function (event) {
      if (event.cards.length === 1) {
        setSelectedCardType(cardTypeFormat(event.cards[0].niceType));
      } else {
        setSelectedCardType('generic');
      }
    });
  }, [hostedFieldsState]);

  return (
    <Styled id="CardDetails" css={css}>
      <div className="CardDetails">
        {/* Card Number */}
        <div className="CardDetails__Row CardDetails__CardNumberAndTypeContainer">
          <div className="CardDetails__CardNumberContainer">
            <label htmlFor="card-number">{props.labelCardNumber}</label>
            <div
              id="card-number"
              className={`CardDetails__Field CardDetails__Fields--cardNumber ${
                invalidFieldsListToCheck('number') ? 'CardDetails__Field--invalid' : ''
              }`}
            ></div>
            {invalidFieldsListToCheck('number') && (
              <p className="CardDetails__Field-Error ">Invalid credit card number</p>
            )}
          </div>
          {!!cards.length && (
            <div className="CardDetails__CardTypeContainer">
              <CardTypes cardTypes={cards} selectedCardType={selectedCardType} />
            </div>
          )}
        </div>
        {/* Expiry Date */}
        <div className="CardDetails__Row">
          <label htmlFor="card-expiration">{props.labelExpiryDate}</label>
          <div
            id="card-expiration"
            className={`CardDetails__Field ${invalidFieldsListToCheck('number') ? 'CardDetails__Field--invalid' : ''}`}
          ></div>
          {invalidFieldsListToCheck('expirationDate') && (
            <p className="CardDetails__Field-Error ">Invalid expiration</p>
          )}
        </div>
        {/* CVV */}
        <div className="CardDetails__Row">
          <div className="CardDetails__Cvv">
            <label htmlFor="card-cvv">{props.labelCardCVV}</label>
            <div className="CardDetails__CvvInputAndCCVIconContainer">
              <div
                id="card-cvv"
                className={`CardDetails__Field ${invalidFieldsListToCheck('cvv') ? 'CardDetails__Field--invalid' : ''}`}
              ></div>
              <CardCVVIcon />
            </div>
            {invalidFieldsListToCheck('cvv') && <p className="CardDetails__Field-Error ">Invalid security number</p>}
          </div>
        </div>
        <div className="CardDetails__Row">
          {/* Name on Card */}
          <label htmlFor="card-name">{props.labelNameOnCard}</label>
          <div
            id="card-name"
            className={`CardDetails__Field ${
              invalidFieldsListToCheck('cardholderName') ? 'CardDetails__Field--invalid' : ''
            }`}
          ></div>
          {invalidFieldsListToCheck('cardholderName') && (
            <p className="CardDetails__Field-Error ">Invalid card holder name</p>
          )}
        </div>
      </div>
    </Styled>
  );
};

export default connect(getWidgetInfo)(CreditCardHostedFields);
