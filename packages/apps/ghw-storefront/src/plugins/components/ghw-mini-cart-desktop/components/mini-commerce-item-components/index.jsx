/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {
  FreeGiftMessage,
  FreeMessage
} from '@oracle-cx-commerce/react-widgets/cart/cart-item-details/components/gwp-free-labels';
import React, {useContext} from 'react';
import {CartItemContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import GiftIcon from '@oracle-cx-commerce/react-components/icons/gift';
import Styled from '@oracle-cx-commerce/react-components/styled';
import giftCss from '@oracle-cx-commerce/react-widgets/cart/cart-item-details/styles.css';
import {useNumberFormatter} from '@oracle-cx-commerce/react-components/utils/hooks';
import Link from '@oracle-cx-commerce/react-components/link';
import {getCurrentOrder, getOrder, getPage} from '@oracle-cx-commerce/commerce-utils/selector';
import {ORDER_STATE_QUOTED} from '@oracle-cx-commerce/commerce-utils/constants';
import css from './styles.css';
import Img from '../../../ghw-product-result-image/components/img';

/**
 * It displays commerce item name.
 */
export const CommerceItemName = () => {
  // context primaryThumbImageURL
  const {commerceItem = {}, pdpUrl} = useContext(CartItemContext);
  console.log('cart details -->', useContext(CartItemContext));

  return (
    <Styled id="GHWCommerceItemName" css={css}>
      {/* <Link className="GHWCommerceItemName" href={pdpUrl}>
        {commerceItem.displayName}
      </Link> */}
      <div className="GHWCommerceItemName">{commerceItem.displayName}</div>
    </Styled>
  );
};

export const CommerceItemPriceGroup = props => {
  const {shippingGroupCommerceItem = {}, commerceItem = {}} = useContext(CartItemContext);

  const formatCurrency = useNumberFormatter({style: 'currency'}, props.priceListGroup);
  let totalPriceInfo = null;

  if (
    commerceItem.giftWithPurchaseCommerceItemMarkers &&
    (commerceItem.giftWithPurchaseCommerceItemMarkers.length === 0 ||
      (commerceItem.giftWithPurchaseCommerceItemMarkers.length > 0 && shippingGroupCommerceItem.quantity > 1))
  ) {
    totalPriceInfo = !isNaN(shippingGroupCommerceItem.amount) && formatCurrency(shippingGroupCommerceItem.amount);
  } else if (
    commerceItem.giftWithPurchaseCommerceItemMarkers &&
    commerceItem.giftWithPurchaseCommerceItemMarkers.length > 0 &&
    shippingGroupCommerceItem.quantity === 1
  ) {
    if (
      shippingGroupCommerceItem.discountInfo[0] &&
      shippingGroupCommerceItem.discountInfo[0].promotionId ===
        commerceItem.giftWithPurchaseCommerceItemMarkers[0].value
    ) {
      totalPriceInfo = <FreeMessage textFree={textFree} />;
    } else {
      totalPriceInfo = !isNaN(shippingGroupCommerceItem.amount) && formatCurrency(shippingGroupCommerceItem.amount);
    }
  }

  return (
    <Styled id="GHWCommerceItemPriceGroup" css={css}>
      <div className="price-info">
        <h2 className="offer-price">{totalPriceInfo}</h2>
        <div className="label-price">{formatCurrency(commerceItem.salePrice)}</div>
      </div>
    </Styled>
  );
};

const returnpipe = (size, frequency) => {
  if (size === '' || frequency === '') {
    return '';
  }

  return '|';
};

export const GetSizeAndFreqDetails = () => {
  const {commerceItem = {}} = useContext(CartItemContext);
  console.log('cart details -- for>', commerceItem);
  let size = '';

  commerceItem.variant?.forEach(ele => {
    if (ele.optionName === 'Count') {
      size = `Size: ${ele.optionValue}`;
    }
  });

  const newArray = commerceItem.dynamicProperties?.filter(function (item) {
    return item.id === 'ghwSubscription';
  });
  const frequency =
    newArray[0].value != null && newArray[0].value !== 'Onetime' ? `Auto Ship: ${newArray[0].value}` : '';
  const pipe = returnpipe(size, frequency);

  return `${size} ${pipe} ${frequency}`;
};

/**
 * It displays commerce item name.
 */
// export const CommerceItemImage = () => {
//   // context primaryThumbImageURL
//   const {commerceItem = {}} = useContext(CartItemContext);

//   return (
//     <Styled id="GHWCommerceItemName" css={css}>
//       <img src={commerceItem.primaryThumbImageURL} alt={commerceItem.displayName} id="IMG_3" />
//     </Styled>
//   );
// };

/**
 * It displays commerce item image.
 */
export const CommerceItemImage = () => {
  // context
  const {commerceItem = {}, pdpUrl} = useContext(CartItemContext);
  const imageUrl =
    commerceItem.isItemValid &&
    commerceItem.childSKUs &&
    commerceItem.childSKUs.length > 0 &&
    commerceItem.childSKUs[0].primaryThumbImageURL
      ? commerceItem.childSKUs[0].primaryThumbImageURL
      : commerceItem.primaryThumbImageURL;

  return (
    <Styled id="GHWCommerceItemImage" css={css}>
      {/* <Link className="GHWCommerceItemImage" href={pdpUrl}>
        {imageUrl && (
          <Img src={imageUrl} title={commerceItem.displayName} alt={commerceItem.displayName} size="xsmall" />
        )}
      </Link> */}

      <div className="GHWCommerceItemImage">
        {imageUrl && (
          <Img src={imageUrl} title={commerceItem.displayName} alt={commerceItem.displayName} size="xsmall" />
        )}
      </div>
    </Styled>
  );
};

/**
 *  It displays commerce line item total price.
 *
 * @param {*} props
 */
export const CommerceItemTotalPrice = props => {
  // resources
  const {textFree} = props;

  // context
  const {shippingGroupCommerceItem = {}, commerceItem = {}} = useContext(CartItemContext);

  const formatCurrency = useNumberFormatter({style: 'currency'}, props.priceListGroup);

  let totalPriceInfo = null;

  if (
    commerceItem.giftWithPurchaseCommerceItemMarkers &&
    (commerceItem.giftWithPurchaseCommerceItemMarkers.length === 0 ||
      (commerceItem.giftWithPurchaseCommerceItemMarkers.length > 0 && shippingGroupCommerceItem.quantity > 1))
  ) {
    totalPriceInfo = !isNaN(shippingGroupCommerceItem.amount) && formatCurrency(shippingGroupCommerceItem.amount);
  } else if (
    commerceItem.giftWithPurchaseCommerceItemMarkers &&
    commerceItem.giftWithPurchaseCommerceItemMarkers.length > 0 &&
    shippingGroupCommerceItem.quantity === 1
  ) {
    if (
      shippingGroupCommerceItem.discountInfo[0] &&
      shippingGroupCommerceItem.discountInfo[0].promotionId ===
        commerceItem.giftWithPurchaseCommerceItemMarkers[0].value
    ) {
      totalPriceInfo = <FreeMessage textFree={textFree} />;
    } else {
      totalPriceInfo = !isNaN(shippingGroupCommerceItem.amount) && formatCurrency(shippingGroupCommerceItem.amount);
    }
  }

  return (
    <Styled id="GHWCommerceItemTotalPrice" css={css}>
      <span className="GHWCommerceItemTotalPrice">{totalPriceInfo}</span>
      {/* {commerceItem?.shippingSurchargeValue > 0 && (
        <div className="GHWCommerceItemTotalPrice__ShippingSurcharge">
          {formatCurrency(commerceItem.shippingSurchargeValue + commerceItem.amount)}
        </div>
      )} */}
    </Styled>
  );
};

/**
 * It displays commerce item price.
 */
export const CommerceItemPrice = props => {
  // context
  const {shippingGroupCommerceItem = {}, commerceItem = {giftWithPurchaseCommerceItemMarkers: []}} =
    useContext(CartItemContext);
  const {getState} = useContext(StoreContext);
  const orderId = getPage(getState()).contextId;
  const currentOrder = orderId ? getOrder(getState(), {id: orderId}) : getCurrentOrder(getState());
  const quoted = currentOrder.state === ORDER_STATE_QUOTED ? true : false;
  const {detailedItemPriceInfo = [], unitPrice} = shippingGroupCommerceItem;
  detailedItemPriceInfo.sort(function (a, b) {
    return b.amount - a.amount;
  });
  const formatCurrency = useNumberFormatter({style: 'currency'}, props.priceListGroup);

  return (
    <Styled id="GHWCommerceItemPrice" css={css}>
      <div className="GHWCommerceItemPrice">
        {commerceItem.giftWithPurchaseCommerceItemMarkers &&
          (commerceItem.giftWithPurchaseCommerceItemMarkers.length === 0 ||
            (commerceItem.giftWithPurchaseCommerceItemMarkers.length > 0 && shippingGroupCommerceItem.quantity > 1)) &&
          shippingGroupCommerceItem.listPrice &&
          (!detailedItemPriceInfo || (detailedItemPriceInfo && detailedItemPriceInfo.length === 1) ? (
            <>
              <span>
                Unit Price: {formatCurrency(props.cartPrice ? unitPrice : detailedItemPriceInfo[0].detailedUnitPrice)}
              </span>
            </>
          ) : (
            detailedItemPriceInfo.map((itemPrice, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} className="GHWCommerceItemPrice__PriceBreakUp">
                {itemPrice.quantity}
                <span className="GHWCommerceItemPrice__PriceBreakUpAtRate">{props.messageAtTheRate}</span>
                {formatCurrency(itemPrice.detailedUnitPrice)}
              </div>
            ))
          ))}
      </div>
    </Styled>
  );
};

/**
 * It displays commerce item variant information.
 */
export const CommerceItemVariants = () => {
  const {
    commerceItem: {variant = []}
  } = useContext(CartItemContext);

  return (
    <Styled id="GHWCommerceItemVariants" css={css}>
      <div className="GHWCommerceItemVariants">
        {variant &&
          variant.map(item => (
            <div key={item.optionName}>
              {item && item.optionName && item.optionValue && (
                <>
                  {item.optionName} : {item.optionValue}
                </>
              )}
            </div>
          ))}
      </div>
    </Styled>
  );
};

/**
 * It displays commerce item free gift icon message.
 *
 * @param {*} props
 */
export const CommerceItemFreeGiftIconMessage = props => {
  // resources
  const {textFreeGift} = props;
  // context
  const {
    commerceItem: {giftWithPurchaseCommerceItemMarkers = []},
    shippingGroupCommerceItem
  } = useContext(CartItemContext);

  return (
    <Styled id="GHWFreeGiftIconMessage" css={giftCss}>
      {giftWithPurchaseCommerceItemMarkers &&
        giftWithPurchaseCommerceItemMarkers.length > 0 &&
        shippingGroupCommerceItem.discountInfo[0] &&
        shippingGroupCommerceItem.discountInfo[0].promotionId === giftWithPurchaseCommerceItemMarkers[0].value && (
          <div className="GHWFreeGiftIconMessage">
            <GiftIcon className="GHWFreeGiftIconMessage__GiftIcon" />
            <FreeGiftMessage textFreeGift={textFreeGift} />
          </div>
        )}
    </Styled>
  );
};

/**
 * It displays commerce item quantity.
 *
 * @param {*} props
 */
export const CommerceItemQty = () => {
  const {shippingGroupCommerceItem = {}} = useContext(CartItemContext);
  const {quantity} = shippingGroupCommerceItem;

  return (
    <Styled id="GHWCommerceItemQty" css={css}>
      <div className="GHWCommerceItemQty">{quantity}</div>
      {/* <fieldset id="FIELDSET_12">
                    <legend id="LEGEND_13">Qty</legend>
                    <div id="DIV_14">1</div>
                    <div id="DIV_15">
                      <div className="arrow-top" id="DIV_16" />
                      <div className="arrow-down" id="DIV_17" />
                    </div>
                  </fieldset> */}
    </Styled>
  );
};
