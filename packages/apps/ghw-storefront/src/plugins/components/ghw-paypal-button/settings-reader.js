// import {filter} from 'lodash-es';

export default {
  paypalButtonSettings(state) {
    if (!state.paymentRepository || !state.paymentRepository.paymentConfigurations) {
      return {};
    }
    const config = state.paymentRepository.paymentConfigurations;
    if (!config.settings && !config.settings.length) {
      return {};
    }
    // const settings = filter(config.settings, setting => setting.clientId !== undefined)[0];
    const settings = config.settings.filter(setting => setting.clientId !== undefined)[0];

    const {currencyCode} = state.clientRepository.context.global;
    const {page} = state.clientRepository.context.request;
    const {clientId, environment, intent} = settings || {};

    return {
      clientId,
      environment,
      intent,
      currencyCode,
      page
    };
  }
};
