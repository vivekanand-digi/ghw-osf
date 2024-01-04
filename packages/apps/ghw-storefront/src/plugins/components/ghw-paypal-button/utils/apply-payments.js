import {getCurrentOrder} from '@oracle-cx-commerce/commerce-utils/selector';
import {PAYMENT_STATE_INITIAL} from '@oracle-cx-commerce/commerce-utils/constants';
import {deleteAppliedPaymentsByIds} from '@oracle-cx-commerce/react-components/utils/payment';

const applyPayments = async (store, paymentToApply) => {
  const {paymentGroups} = getCurrentOrder(store.getState());

  //get payment group ids to be deleted
  if (paymentGroups) {
    const paymentGroupsToRemoved = Object.values(paymentGroups)
      .filter(pGroup => pGroup.paymentState === PAYMENT_STATE_INITIAL)
      .map(pGroup => pGroup.paymentGroupId);

    if (paymentGroupsToRemoved.length) {
      const response = await deleteAppliedPaymentsByIds(store.action, paymentGroupsToRemoved);
      if (!response.ok) {
        store.action('notify', {level: 'error', message: response.error.message});

        return false;
      }
    }
  }

  return new Promise(resolve => {
    store.action('notifyClearAll');

    store.action('applyPayments', {items: [{...paymentToApply, seqNum: 0}]}).then(response => {
      if (response.ok) {
        resolve(true);
      } else {
        store.action('notify', {level: 'error', message: response.error.message});
        resolve(false);
      }
    });
  });
};

export default applyPayments;
