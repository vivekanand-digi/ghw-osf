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
      firstName: payload.shippingAddress.firstName,
      lastName: payload.shippingAddress.lastName,
      address1: payload.shippingAddress.streetAddress,
      city: payload.shippingAddress.locality,
      country: payload.shippingAddress.countryCode,
      postalCode: payload.shippingAddress.postalCode,
      state: payload.shippingAddress.region,
      phoneNumber: payload.shippingAddress.phoneNumber,
      email: payload.userData.userEmail,
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
              console.log('#### SAVE SHIPPING ADDRESS FROM SRC ERROR ####', response);
            }
          })
          .catch(() => {
            resolve(false);
            console.log('#### SAVE SHIPPING ADDRESS FROM SRC ERROR ####');
          });
      });
    };
    await updateCartShippingGroup();
  }
};
