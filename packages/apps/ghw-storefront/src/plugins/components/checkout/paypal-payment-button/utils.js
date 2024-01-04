import {loadShippingMethodsAndSetDefaultForSG} from '@oracle-cx-commerce/react-components/utils/address';
import {SHIPPING_GROUP_HARDGOOD} from '@oracle-cx-commerce/commerce-utils/constants';
import orderRepoReader from '../helpers/order-repo-reader';

const getHardgoodShippingGroups = (shippingGroups = {}) => {
  const hardgoodShippingGroups = (Object.values(shippingGroups || {}) || []).filter(shippingGroup => {
    return shippingGroup.type === SHIPPING_GROUP_HARDGOOD;
  });

  return hardgoodShippingGroups;
};

export const updateShippingAddress = async (store, payload) => {
  const {action} = store;
  const state = store.getState();
  const shippingGroups = orderRepoReader.getShippingGroups(state);
  const hardgoodShippingGroups = getHardgoodShippingGroups(shippingGroups);
  if (hardgoodShippingGroups.length === 1) {
    const address = {
      firstName: payload.details.firstName,
      lastName: payload.details.lastName,
      address1: payload.details.shippingAddress.line1,
      address2: payload.details.shippingAddress.line2,
      city: payload.details.shippingAddress.city,
      country: payload.details.shippingAddress.countryCode,
      postalCode: payload.details.shippingAddress.postalCode,
      state: payload.details.shippingAddress.state,
      phoneNumber: payload.details.phone,
      email: payload.details.email,
    };
    const updatePayload = {
      shippingAddress: address,
      type: SHIPPING_GROUP_HARDGOOD,
      // shippingMethod: {value: shippingMethod},
      shippingGroupId: hardgoodShippingGroups[0].shippingGroupId
    };

    const updateCartShippingGroup = () => {
      return new Promise(resolve => {
        action('updateCartShippingGroup', updatePayload)
          .then(async response => {
            if (response.ok) {
              await loadShippingMethodsAndSetDefaultForSG(store, hardgoodShippingGroups[0]);
              resolve(true);
            } else {
              resolve(false);
              console.log('#### SAVE SHIPPING ADDRESS FROM PAYPAL ERROR ####', response);
            }
          })
          .catch(() => {
            resolve(false);
            console.log('#### SAVE SHIPPING ADDRESS FROM PAYPAL ERROR ####');
          });
      });
    };
    await updateCartShippingGroup();
  }
};
