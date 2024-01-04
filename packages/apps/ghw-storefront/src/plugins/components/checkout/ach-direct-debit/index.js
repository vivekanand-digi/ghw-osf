import {useShippingCountriesFetcher} from '@oracle-cx-commerce/fetchers/shipping-countries/hooks';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useContext, useEffect, useState} from 'react';
import {loadAchDirectDebitScript} from '../helpers/ach-direct-debit-loader';
import {Braintree as initializeBraintree} from '../helpers/braintree-loader';
import paymentSettingsReader from '../helpers/payment-settings-reader';
import AccountForm from './components/account-form';
import SaveBankCheckbox from './components/save-bank-checkbox';
import {ACDHDirectDebitProvider} from './context';
import {getPageData} from './selectors';
import css from './styles.css';

const setupAchDirectDebitPayment = async props => {
  const {clientToken} = props;
  const braintree = await initializeBraintree();
  const clientInstance = await braintree.client.create({authorization: clientToken});
  const response = await loadAchDirectDebitScript();

  if (response) {
    const usBankAccountInstance = await braintree.usBankAccount.create({client: clientInstance});

    return usBankAccountInstance;
  }
};

const ACHDirectDebit = props => {
  const store = useContext(StoreContext);
  const {
    clientToken,
    defaultBillingCountryCode,
    isUserLoggedIn,
    labelSavePaymentCheckbox,
    mandateText,
    shippingCountries = [],
    widgetId: id,
    ...labelProps
  } = props;

  const settings = paymentSettingsReader.getPaymentWidgetSettings(store.getState());

  useShippingCountriesFetcher(store);

  const [usBankAccountInstance, setUsBankAccountInstancee] = useState(null);

  useEffect(() => {
    setupAchDirectDebitPayment({clientToken}).then(instance => {
      setUsBankAccountInstancee(instance);
    });
  }, [clientToken]);

  return (
    <Styled id="achdirectdebit" css={css}>
      <ACDHDirectDebitProvider
        isUserLoggedIn={isUserLoggedIn}
        mandateText={mandateText}
        usBankAccountInstance={usBankAccountInstance}
      >
        <AccountForm
          {...labelProps}
          defaultCountry={defaultBillingCountryCode}
          id={id}
          shippingCountries={shippingCountries}
        />
        {isUserLoggedIn && settings.enabledSavePayment && (
          <>
            <div className="achdirectdebit__MandateText">{mandateText}</div>
            <SaveBankCheckbox labelSavePaymentCheckbox={labelSavePaymentCheckbox} id={id} />
          </>
        )}
      </ACDHDirectDebitProvider>
    </Styled>
  );
};

export default connect(getPageData)(ACHDirectDebit);
