export default {
  getPaymentWidgetSettings(state, id) {
    if (!state.paymentRepository) {
      return null;
    }
    console.log('paymentRepository --->', state.paymentRepository);
    const p = state.paymentRepository.paymentConfigurations.settings.filter(
      s => s.paymentGatewayName === 'braintree-payment-gateway-settings'
    )[0];
    console.log('paymentRepository p --->', p);
    let enableFunding = p.enableFunding
    let environment = p.environment;
    let merchantAccountId = p.merchantAccountId;
    // let merchantAccountId = 'EUR_local';
    let intent = p.paypalIntent;
    let offerCredit = p.paypalOfferCredit === 'yes';
    let flow = p.storeInVault === 'vaultAlways' ? 'vault' : 'checkout';
    let vault = p.storeInVault === 'vaultAlways' ? true : false;
    let enabledSavePayment = p.storeInVault !== 'doNotVault'
    // let flow = 'vault';
    // let vault = true;
    let acceptedLocalPayments = !!p.acceptedLocalPayments ? p.acceptedLocalPayments.split(',') : [];
    if (offerCredit && flow === 'vault') {
      intent = 'tokenize';
    }
    let offerPayLater = p.paypalOfferPayLater === 'yes';
    // if (flow !== 'checkout') {
    //   offerPayLater = false;
    // }
    const googlePayMerchantId = p.googlePayMerchantId;
    const enable3DSecure = p.enable3DSecure === 'yes';
    return {
      environment,
      merchantAccountId,
      flow,
      vault,
      displayName: p.paypalDisplayName,
      enableShippingAddress: p.paypalEnableShippingAddress === 'yes',
      commit: p.paypalCommit === 'yes',
      intent,
      offerCredit,
      offerPayLater,
      googlePayMerchantId,
      enable3DSecure,
      acceptedLocalPayments,
      enabledSavePayment,
      enableFunding,
    };
  }
};
