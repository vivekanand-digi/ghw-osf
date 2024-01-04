import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {getCurrentProfileId, getCurrentSiteId} from '@oracle-cx-commerce/commerce-utils/selector';
import {validateFields} from '../components/credit-card-hosted-fields/validate';
import {getWidgetInfoEntity} from '../../../../selectors/braintree-selector';

export const HostedFieldsProviderContext = createContext();

const HostedFieldsProvider = ({children}) => {
  const {action, getState} = useContext(StoreContext);
  const [hostedFieldsState, setHostedFieldsState] = useState(null);
  const [invalidFields, setInvalidFields] = useState([]);
  const [inProgress, setInProgress] = useState(false);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (hostedFieldsState) {
      const hostedFieldsStateCards = hostedFieldsState.getState();

      setCards(hostedFieldsStateCards.cards);
    }
  }, [hostedFieldsState]);

  const handleSubmit = useCallback(
    async (event, {makeDefault, profileId, onOk, onNotOk}) => {
      if (!hostedFieldsState) {
        return;
      }
      event.preventDefault();

      action('notifyClearAll');

      const payload = {
        basicAuth: getWidgetInfoEntity(state, {entityName: 'basicAuth'}),
        profileId,
        site: getCurrentSiteId(state),
        makeDefault
      };

      const invalidFields = validateFields(hostedFieldsState.getState().fields);
      setInvalidFields(invalidFields);

      if (invalidFields.length) {
        return;
      }
      setInProgress(true);
      const {
        nonce,
        details: {lastFour}
      } = await hostedFieldsState.tokenize();
      const response = await action('addSavedPaymentAction', {
        ...payload,
        nonce
      });
      if (response.ok) {
        onOk(lastFour);
      } else {
        onNotOk(response);
      }
      setInProgress(false);
    },
    [hostedFieldsState]
  );

  return (
    <HostedFieldsProviderContext.Provider
      value={{hostedFieldsState, setHostedFieldsState, invalidFields, handleSubmit, cards, inProgress, setInProgress}}
    >
      {children}
    </HostedFieldsProviderContext.Provider>
  );
};

export default HostedFieldsProvider;
