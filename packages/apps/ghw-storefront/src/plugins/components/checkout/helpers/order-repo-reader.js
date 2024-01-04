import {getCurrentOrder} from '@oracle-cx-commerce/commerce-utils/selector';

export default {
  getTotalAmountDue(state) {
    if (!state.orderRepository) {
      return {amount: 0.0, currencyCode: state.clientRepository.context.global.currencyCode};
    }
    const {priceInfo} = getCurrentOrder(state);
    if (!!priceInfo) {
      const {total: amount, currencyCode} = priceInfo;
      return {amount, currencyCode};
    }
    return null;
  },
  getShippingAddress(state) {
    const {shippingGroups} = getCurrentOrder(state);
    if (!shippingGroups) {
      return null;
    }
    const shippingGroupId = Object.keys(shippingGroups)[0];
    return shippingGroups[shippingGroupId].shippingAddress;
  },
  getPaymentGroups(state) {
    const currentOrder = getCurrentOrder(state);
    return currentOrder.paymentGroups;
  },
  getShippingGroups(state) {
    const currentOrder = getCurrentOrder(state);
    return currentOrder.shippingGroups;
  }
};
