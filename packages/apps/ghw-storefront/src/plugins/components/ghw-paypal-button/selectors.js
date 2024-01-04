/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {PAYMENT_STATE_INITIAL} from '@oracle-cx-commerce/commerce-utils/constants';
import {getCurrentOrder, getCurrentSiteId, getPaymentRepository} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';

export const getWidgetInfo = state => {
  const configuration = getPaymentRepository(state).paymentConfigurations || {};
  const {priceInfo = {}} = getCurrentOrder(state) || {};
  const currentOrder = getCurrentOrder(state);
  const currentSiteId = getCurrentSiteId(state);

  return {
    configuration,
    priceInfo,
    currentOrder,
    currentSiteId
  };
};

export const removePaypalMethodPaymentGroups = async (
  store,
  paymentGroups,
  setLoading,
  textOrderProcessingTimedOut
) => {
  if (paymentGroups && !isEmptyObject(paymentGroups)) {
    const expiredPaymentGroups = Object.values(paymentGroups).filter(
      paymentGroup =>
        paymentGroup.paymentMethod === 'onlinePaymentGroup' &&
        paymentGroup.paymentState === PAYMENT_STATE_INITIAL &&
        paymentGroup.type === 'generic'
    );
    // Calling deleteAppliedPayment action to remove expired payment groups
    if (expiredPaymentGroups.length > 0) {
      setLoading(true);
      // notify the user to re-enter payment details since payment groups have expired
      store.action('notifyClearAll');
      store.action('notify', {level: 'error', message: textOrderProcessingTimedOut});

      // remove each expired payment group
      for (const paymentGroup of expiredPaymentGroups) {
        const {paymentGroupId} = paymentGroup;
        await store.action('deleteAppliedPayment', {paymentGroupId}).then(response => {
          if (response.ok) {
            console.log('Expired Payments deleted...', paymentGroupId);
          }
        });
      }
      setLoading(false);
    }
  }
};

export const removeCCMethodPaymentGroups = async (store, paymentGroups, setLoading, textOrderProcessingTimedOut) => {
  if (paymentGroups && !isEmptyObject(paymentGroups)) {
    const expiredPaymentGroups = Object.values(paymentGroups).filter(
      paymentGroup =>
        paymentGroup.paymentMethod === 'creditCard' &&
        paymentGroup.paymentState === PAYMENT_STATE_INITIAL &&
        paymentGroup.type !== 'generic'
    );
    // Calling deleteAppliedPayment action to remove expired payment groups
    if (expiredPaymentGroups.length > 0) {
      setLoading(true);
      // notify the user to re-enter payment details since payment groups have expired
      store.action('notifyClearAll');
      store.action('notify', {level: 'error', message: textOrderProcessingTimedOut});

      // remove each expired payment group
      for (const paymentGroup of expiredPaymentGroups) {
        const {paymentGroupId} = paymentGroup;
        await store.action('deleteAppliedPayment', {paymentGroupId}).then(response => {
          if (response.ok) {
            console.log('Expired Payments deleted...', paymentGroupId);
          }
        });
      }
      setLoading(false);
    }
  }
};
