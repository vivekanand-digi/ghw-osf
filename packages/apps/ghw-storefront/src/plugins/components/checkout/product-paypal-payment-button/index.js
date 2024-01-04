import React, {useCallback, useContext, useMemo} from 'react';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import {getCurrentOrder, getProductPrice, getSkuPrice} from '@oracle-cx-commerce/commerce-utils/selector';
import {useSelector} from '@oracle-cx-commerce/react-components/provider';
import PayPalPaymentButton from '../paypal-payment-button';
import {getCurrencyCode} from '@oracle-cx-commerce/commerce-utils/selector';

import {ContainerContext, ProductContext} from '@oracle-cx-commerce/react-ui/contexts';

const ProductPayPalPaymentButton = props => {
  // Designer config
  const {
    enableFunding = 'credit,paylater,venmo',
    messagingLayout = 'text',
    messagingLogoType = 'primary',
    messagingLogoPosition = 'left',
    messagingTextColor = 'black',
    messagingTextSize = '12',
    messagingTextAlign = 'left',
    messagingColor = 'blue',
    messagingRatio = '1x1',
    messagingPlacement = 'payment',
    id
  } = props;
  const {continueToPageAddress = '/checkout-review-order'} = props;

  const store = useContext(StoreContext);
  const state = store.getState();

  const {id: productId} = useContext(ProductContext);
  const {selections: {skuId = null} = {}} = useContext(ContainerContext);
  const currentCurrencyCode = getCurrencyCode(state);

  const productPrices = useSelector(getProductPrice, {productId}) || {};
  const {sale: productSalePrice = null} = productPrices;

  const {salePrice: skuSalePrice = null} = useSelector(getSkuPrice, {skuId}) || {};
  const {numberOfItems} = useSelector(getCurrentOrder);

  const paymentAmount = useMemo(() => {
    if (productSalePrice === null) {
      return null;
    }
    return {amount: skuId ? skuSalePrice : productSalePrice, currencyCode: currentCurrencyCode};
  }, [skuId, skuSalePrice, productSalePrice, currentCurrencyCode]);

  const handlePaymentSuccess = useCallback(async () => {
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
  }, [productId, skuId]);

  if (!paymentAmount || numberOfItems > 0) {
    return null;
  }

  return (
    <Styled id="ProductPayPalPaymentButton" css={css}>
      <div className="ProductPayPalPaymentButton">
        <PayPalPaymentButton
          paymentAmount={paymentAmount}
          productId={productId}
          continueToPageAddress={continueToPageAddress}
          onPaymentSuccess={handlePaymentSuccess}
          enableFunding={enableFunding}
          messagingLayout={messagingLayout}
          messagingLogoType={messagingLogoType}
          messagingLogoPosition={messagingLogoPosition}
          messagingTextColor={messagingTextColor}
          messagingTextSize={messagingTextSize}
          messagingTextAlign={messagingTextAlign}
          messagingColor={messagingColor}
          messagingRatio={messagingRatio}
          messagingPlacement={messagingPlacement}
          id={id}
        />
      </div>
    </Styled>
  );
};

export default ProductPayPalPaymentButton;
