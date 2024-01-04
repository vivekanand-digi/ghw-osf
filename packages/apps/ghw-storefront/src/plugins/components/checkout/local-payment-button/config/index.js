import * as en from './locales/en';
/**
 * Design Studio configuration properties for the WidgetName component.
 */
const config = {
  properties: [
    {
      id: 'testMode',
      type: 'booleanType',
      defaultValue: false,
      labelResourceId: 'testModeLabel',
      helpTextResourceId: 'testModeLabelHelpText'
    },
    {
      id: 'testModeCountry',
      type: 'stringType',
      defaultValue: 'PL',
      labelResourceId: 'testModeCountryLabel',
      helpTextResourceId: 'testModeCountryHelpText'
    },
    {
      id: 'testModeCurrency',
      type: 'stringType',
      defaultValue: 'PLN',
      labelResourceId: 'testModeCurrencyLabel',
      helpTextResourceId: 'testModeCurrencyHelpText'
    },
    {
      id: 'testMerchantAccountId',
      type: 'stringType',
      defaultValue: 'EUR_local',
      labelResourceId: 'testMerchantAccountIdLabel',
      helpTextResourceId: 'testMerchantAccountIdHelpText'
    }
  ],
  locales: {
    en: {
      resources: en
    }
  }
};

export default config;
