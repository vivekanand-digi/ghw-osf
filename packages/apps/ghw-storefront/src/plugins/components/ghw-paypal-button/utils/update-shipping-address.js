import {getCurrentOrder, getDefaultShippingAddressId, getAddresses} from '@oracle-cx-commerce/commerce-utils/selector';

import {loadShippingMethodsAndSetDefaultForSG} from '@oracle-cx-commerce/react-components/utils/address';
import {SHIPPING_GROUP_HARDGOOD} from '@oracle-cx-commerce/commerce-utils/constants';

const getHardgoodShippingGroups = (shippingGroups = {}) => {
  const hardgoodShippingGroups = (Object.values(shippingGroups || {}) || []).filter(shippingGroup => {
    return shippingGroup.type === SHIPPING_GROUP_HARDGOOD;
  });

  return hardgoodShippingGroups;
};

const updateShippingAddress = async (store, payload) => {
  const {action} = store;
  const state = store.getState();
  const {shippingGroups} = getCurrentOrder(state);
  const hardgoodShippingGroups = getHardgoodShippingGroups(shippingGroups);
  if (hardgoodShippingGroups.length === 1) {
    const updatePayload = {
      shippingAddress: payload,
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

export const getShippingAddress = state => {
  const {shippingGroups} = getCurrentOrder(state);
  let rs = null;
  if (shippingGroups) {
    const shippingGroupId = Object.keys(shippingGroups)[0];
    rs = shippingGroups[shippingGroupId].shippingAddress;
  }
  if (!rs || !rs.address1 || !rs.country || !rs.postalCode) {
    const addressId = getDefaultShippingAddressId(state);
    const addresses = getAddresses(state);
    rs = addresses[addressId];
  }
  return rs;
};

export const convertPayPalAddressToOccFormat = payload => {
  const address = {
    firstName: payload.name.given_name,
    lastName: payload.name.surname,
    address1: payload.address_line_1,
    address2: payload.address_line_2,
    city: payload.admin_area_2,
    country: payload.country_code,
    postalCode: payload.postal_code,
    state: payload.admin_area_1,
    phoneNumber: payload.phone ? payload.phone.phone_number.national_number : undefined,
    email: payload.email_address
  };
  return address;
};

export default updateShippingAddress;
