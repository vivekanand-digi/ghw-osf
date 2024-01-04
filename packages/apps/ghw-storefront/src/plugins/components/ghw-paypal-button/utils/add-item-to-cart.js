import {getCurrentOrder} from '@oracle-cx-commerce/commerce-utils/selector';

const addItemToCart = (store, productId, skuId) => {
  return new Promise(resolve => {
    const currentState = store.getState();
    const currentOrder = getCurrentOrder(currentState);

    // Product is already added in the cart
    if (
      currentOrder.numberOfItems &&
      Object.values(currentOrder.commerceItems).some(item => item.productId === productId)
    ) {
      resolve(true);
    }

    const payload = {
      productId,
      catRefId: skuId || '',
      quantity: 1
    };
    store
      .action('addItemsToCart', {
        items: [{...payload}]
      })
      .then(response => {
        if (response.error) {
          store.action('notify', {level: 'error', message: response.error.message || ''});
          resolve(false);

          return;
        }
        resolve(true);
      })
      .catch(error => {
        store.action('notify', {level: 'error', message: error.message || ''});
        resolve(false);
      });
  });
};

export default addItemToCart;
