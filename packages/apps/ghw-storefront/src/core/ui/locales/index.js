/* eslint-env node */
/* eslint-disable camelcase */

// NOTICE: For locales that include a hyphen, such as pt-BR, variable names must use an underscore instead of the hyphen. e.g.:
// const pt_BR = require('@oracle-cx-commerce/core-commerce-reference-store-storefront-prov/src/core/ui/locales/pt-BR.json');

/**
 * NOTICE: The import statements for app locales must include full (not relative) path to each locale file.
 */
// const en = require('@oracle-cx-commerce/core-commerce-reference-store-storefront-prov/src/core/ui/locales/en.json');
const en = {
  helloText: 'sample component text',
  labelExtraInfo: '...with some extra info!',
  labelSampleTranslation: 'A Translated Label',
  labelCurrencies: 'Currencies:',
  labelSelectACurrency: 'Select a currency...',
  labelSelectedCurrency: 'Selected Currency:',
  includeExtraInfoLabel: 'Display extra info',
  includeExtraInfoHelpText: 'If selected, the display will include some extra info.',
  actionRemove: 'Remove',
  messagePromoApplied: '__PROMOCODE__  - Applied. ',
  messagePromoOffer: '__OFFPRICE__ off your order. '
};

export {en};
