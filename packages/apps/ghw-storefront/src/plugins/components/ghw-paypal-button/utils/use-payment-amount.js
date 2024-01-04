import {
  getCurrentOrder,
  getCurrencyCode,
  getProductPrice,
  getSkuPrice
} from '@oracle-cx-commerce/commerce-utils/selector';
import {ContainerContext, ProductContext} from '@oracle-cx-commerce/react-ui/contexts';

import {useSelector} from '@oracle-cx-commerce/react-components/provider';

import {useContext, useMemo} from 'react';

const NEW_OBJ = {};

const usePaymentAmount = () => {
  const currentOrder = useSelector(getCurrentOrder) || NEW_OBJ;
  const currentCurrencyCode = useSelector(getCurrencyCode) || '';

  const {id: productId} = useContext(ProductContext) || {};
  const {selections: {skuId = null} = {}} = useContext(ContainerContext) || NEW_OBJ;

  const productPrices = useSelector(getProductPrice, {productId}) || NEW_OBJ;
  const {sale: productSalePrice = null} = productPrices;

  const {salePrice: skuSalePrice = null} = useSelector(getSkuPrice, {skuId}) || NEW_OBJ;

  const paymentAmount = useMemo(() => {
    if (currentOrder.priceInfo && currentOrder.numberOfItems > 0) {
      const {currencyCode, numberOfItems, total: amount, subTotal: itemTotal, shipping, tax} = currentOrder.priceInfo;

      return {amount, currencyCode, numberOfItems, productId: null, skuId: null, itemTotal, shipping, tax};
    }
    if (productSalePrice === null) {
      return productPrices;
    }

    return {
      amount: skuId ? skuSalePrice : productSalePrice,
      currencyCode: currentCurrencyCode,
      numberOfItems: 1,
      productId,
      skuId
    };
  }, [currentOrder.priceInfo, productId, skuId, skuSalePrice, productSalePrice, currentCurrencyCode, productId]);

  return paymentAmount;
};

export default usePaymentAmount;
