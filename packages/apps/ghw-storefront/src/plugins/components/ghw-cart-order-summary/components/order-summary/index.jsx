/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext, useMemo} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {getAmountRemaining, isPaymentGroupPaid} from '@oracle-cx-commerce/react-components/utils/payment';
import {useNumberFormatter} from '@oracle-cx-commerce/react-components/utils/hooks';
import {PAYMENT_TYPE_GIFTCARD, ORDER_STATE_PENDING_PAYMENT} from '@oracle-cx-commerce/commerce-utils/constants';
import {ScheduledOrderContext} from '@oracle-cx-commerce/react-ui/contexts';
import PaymentDetails from '../payment-details';
import {getSiteData} from './selectors';
import css from './styles.css';

const plusSign = '+';
const minusSign = '-';

/**
 * Component to display the order summary information
 * This is used in the Cart Order Summary and the Profile Order Summary widgets
 * @param {*} props
 * @memberof Components
 * @class OrderSummary
 * @category Component-list
 * @param {String} textExcludingTax - Text Excluding tax.
 * @param {String} textFree - Text free.
 * @param {String} textGiftCardBalance - Text Gift card balance.
 * @param {String} textIncludingTax - Text including tax.
 * @param {String} textOrderDiscounts - Text order discounts.
 * @param {String} textShipping - Text shipping.
 * @param {String} textShippingDiscount - Text shipping discount.
 * @param {String} textShippingSurcharge - Text shipping surcharge.
 * @param {String} textSubtotal - Text subtotal.
 * @param {String} textTax - Text tax.
 * @param {String} textTotal - Text total.
 * @param {String} textPriceChangeMessage - Text indicating change in price.
 * @param {String} textConditionalTotal - Text displaying conditional total.
 * @param {String} textRemainingTotal - Text Remaining total.
 * @author Oracle
 * @since 2.10.0
 */
const OrderSummary = props => {
  //resources
  const {
    textExcludingTax,
    textFree,
    textGiftCardBalance,
    textIncludingTax,
    textOrderDiscounts,
    textShipping,
    textShippingDiscount,
    textShippingSurcharge,
    textSubtotal,
    textTax,
    textTotal,
    textPriceChangeMessage,
    textConditionalTotal,
    textRemainingTotal
  } = props;

  // order data
  const {order = {}} = props;
  const {priceInfo = {}, discountInfo = {}, paymentGroups = {}} = order;

  // To display shipping and tax in secondary currency
  const {showSecondaryShippingData, showSecondaryTaxData} = props;

  // fix: getting the priceListGroup as props, as the order data is not getting updated with the correct PLG on 'priceCart' call
  const {orderPriceListGroup, secondaryCurrencyPriceListGroup} = props;
  const {isTaxIncluded} = orderPriceListGroup;

  // site setting for displaying the tax summary
  const {showTaxSummary} = props;

  // widget config for displaying the order-level discounts in an itemized list
  const {displayOrderDiscountsList} = props;

  // to show price change warning
  const {showPriceChangeMessage} = props;

  // payment groups of type gift card
  const giftCardPaymentGroups = Object.values(paymentGroups).filter(
    pGroup => pGroup.paymentMethod === PAYMENT_TYPE_GIFTCARD && !pGroup.paymentExpired && pGroup.amount > 0
  );

  const formatCurrency = useNumberFormatter({style: 'currency'}, orderPriceListGroup);
  const formatSecondaryCurrency = useNumberFormatter({style: 'currency'}, secondaryCurrencyPriceListGroup);

  /**
   * Calculate the total deducted gift card balance
   */
  const getTotalGiftCardBalance = () => {
    let giftCardbalance = 0;
    for (const paymentGroup of Object.values(giftCardPaymentGroups)) {
      giftCardbalance += paymentGroup.amount;
    }

    return giftCardbalance;
  };

  /**
   * To check whether scheduled order is enabled or not
   * CheckoutShippingContext is used to check in shipping page
   * component schedule info is used to check in payment and review page
   */
  const {isCurrentOrderScheduled} = props;
  const scheduledOrderContext = useContext(ScheduledOrderContext);
  let createSchedulePayload = {isScheduleCurrentOrder: 'empty'};
  if (scheduledOrderContext) {
    ({createSchedulePayload = {}} = scheduledOrderContext);
  }
  const verifyCurrentOrderScheduled = useMemo(() => {
    if (createSchedulePayload.isScheduleCurrentOrder !== 'empty') {
      return createSchedulePayload.isScheduleCurrentOrder;
    }

    return isCurrentOrderScheduled;
  }, [createSchedulePayload.isScheduleCurrentOrder, isCurrentOrderScheduled]);

  /**
   * Order SubTotal
   */
  const renderSubTotal = () => (
    <div className="OrderSummary__Row">
      <div className="OrderSummary__ColLabel">
        <span className="OrderSummary__Label">{textSubtotal}</span>
        {showTaxSummary && isTaxIncluded && <span className="OrderSummary__Label">{textIncludingTax}</span>}
      </div>
      <div className="OrderSummary__ColValue">
        <span className="OrderSummary__Value">{formatCurrency(priceInfo.subTotal)}</span>
      </div>
    </div>
  );

  /**
   * Shipping Value
   */
  const renderShipping = () => {
    if (priceInfo.secondaryCurrencyShippingAmount || priceInfo.shipping) {
      return (
        <div className="OrderSummary__Row">
          <div className="OrderSummary__ColLabel">
            <span className="OrderSummary__Label">Shipping + Handling</span>
          </div>
          <div className="OrderSummary__ColValue">
            {showSecondaryShippingData ? (
              <span className="OrderSummary__Value">
                {priceInfo.secondaryCurrencyShippingAmount
                  ? formatSecondaryCurrency(priceInfo.secondaryCurrencyShippingAmount)
                  : 'TBD'}
              </span>
            ) : (
              <span className="OrderSummary__Value">
                {priceInfo.shipping ? formatCurrency(priceInfo.shipping) : 'TBD'}
              </span>
            )}
          </div>
        </div>
      );
    }

    return '';
  };

  /**
   * Shipping Discount
   */
  const renderShippingDiscount = () =>
    discountInfo.shippingDiscount !== 0 && (
      <div className="OrderSummary__Row">
        <div className="OrderSummary__ColLabel">
          <span className="OrderSummary__Label">{textShippingDiscount}</span>
        </div>
        <div className="OrderSummary__ColValue">
          {showSecondaryShippingData ? (
            <span className="OrderSummary__Value">
              {minusSign}
              {formatSecondaryCurrency(discountInfo.secondaryCurrencyShippingDiscount)}
            </span>
          ) : (
            <span className="OrderSummary__Value">
              {minusSign}
              {formatCurrency(discountInfo.shippingDiscount)}
            </span>
          )}
        </div>
      </div>
    );

  /**
   * Shipping Surcharge
   */
  const renderShippingSurcharge = () =>
    priceInfo.shippingSurchargeValue > 0 && (
      <div className="OrderSummary__Row">
        <div className="OrderSummary__ColLabel">
          <span className="OrderSummary__Label">{textShippingSurcharge}</span>
        </div>
        <div className="OrderSummary__ColValue">
          {showSecondaryShippingData ? (
            <span className="OrderSummary__Value">
              {formatSecondaryCurrency(priceInfo.secondaryCurrencyShippingSurchargeValue)}
            </span>
          ) : (
            <span className="OrderSummary__Value">{formatCurrency(priceInfo.shippingSurchargeValue)}</span>
          )}
        </div>
      </div>
    );

  /**
   * Tax Value
   * Display the tax value only when the showTaxSummary is set to true in Admin
   */
  const renderTax = () =>
    showTaxSummary && (
      <div className="OrderSummary__Row">
        <div className="OrderSummary__ColLabel">
          <span className="OrderSummary__Label">Estimated Tax</span>
        </div>
        <div className="OrderSummary__ColValue">
          {showSecondaryTaxData ? (
            <span className="OrderSummary__Value">{formatSecondaryCurrency(priceInfo.secondaryCurrencyTaxAmount)}</span>
          ) : (
            <span className="OrderSummary__Value">{formatCurrency(priceInfo.tax)}</span>
          )}
        </div>
      </div>
    );

  /**
   * Total Gift Card Balance Deducted
   */
  const renderGiftCardBalance = () =>
    giftCardPaymentGroups.length > 0 && (
      <div className="OrderSummary__Row">
        <div className="OrderSummary__ColLabel">
          <span className="OrderSummary__Label">{textGiftCardBalance}</span>
        </div>
        <div className="OrderSummary__ColValue">
          {showSecondaryShippingData || showSecondaryTaxData ? (
            <span className="OrderSummary__Value">
              {minusSign}
              {formatSecondaryCurrency(getTotalGiftCardBalance())}
            </span>
          ) : (
            <span className="OrderSummary__Value">
              {minusSign}
              {formatCurrency(getTotalGiftCardBalance())}
            </span>
          )}
        </div>
      </div>
    );

  /**
   * Total (Excluding Tax)
   */
  const renderTotalExcludingTax = () => (
    <div className="OrderSummary__Row">
      <div className="OrderSummary__ColLabel">
        <span className="OrderSummary__LabelTotalExcludingTax">{textTotal}</span>
        <span className="OrderSummary__TextExcludingTax">{textExcludingTax}</span>
      </div>
      <div className="OrderSummary__ColValue">
        {showSecondaryShippingData || showSecondaryTaxData ? (
          <span className="OrderSummary__ValueTotalExcludingTax">
            {formatSecondaryCurrency(priceInfo.taxExclusiveAmount)}
          </span>
        ) : (
          <span className="OrderSummary__ValueTotalExcludingTax">{formatCurrency(priceInfo.totalWithoutTax)}</span>
        )}
      </div>
    </div>
  );

  /**
   * Total
   */
  const renderTotal = () => (
    <div className="OrderSummary__Row">
      <div className="OrderSummary__ColLabel">
        {(showPriceChangeMessage || verifyCurrentOrderScheduled) && (
          <span className="OrderSummary__LabelTotal">{textConditionalTotal}</span>
        )}
        {!showPriceChangeMessage && !verifyCurrentOrderScheduled && (
          <span className="OrderSummary__LabelTotal">{textTotal}</span>
        )}
        {showTaxSummary && isTaxIncluded && <span className="OrderSummary__TextIncludingTax">{textIncludingTax}</span>}
      </div>
      <div className="OrderSummary__ColValue">
        {showSecondaryShippingData || showSecondaryTaxData ? (
          <span className="OrderSummary__ValueTotal">
            {formatCurrency(priceInfo.primaryCurrencyTotal)}
            {plusSign}
            {formatSecondaryCurrency(priceInfo.secondaryCurrencyTotal)}
          </span>
        ) : (
          <span className="OrderSummary__ValueTotal">{formatCurrency(priceInfo.total)}</span>
        )}
      </div>
    </div>
  );

  /**
   * Order level implicit discounts
   */
  const renderOrderLevelImplicitDiscounts = () =>
    (discountInfo.orderImplicitDiscountList || []).map(promotion => (
      <div key={promotion.promotionId}>
        {promotion.promotionLevel === 'order' && (
          <div className="OrderSummary__Promotion">
            <div className="OrderSummary__ColLabel">
              <span className="OrderSummary__Label">{promotion.promotionDesc}</span>
            </div>
            <div className="OrderSummary__ColValue">
              <span className="OrderSummary__Value">{formatCurrency(parseFloat(promotion.totalAdjustment))}</span>
            </div>
          </div>
        )}
      </div>
    ));

  /**
   * Order level explicit promotions
   */
  const renderOrderLevelExplicitPromotions = () =>
    Object.entries(discountInfo.claimedCouponMultiPromotions || {}).map(([couponCode, promotions]) => (
      <div key={couponCode}>
        {promotions.map(promotion => (
          <div key={promotion.promotionId}>
            {promotion.promotionLevel === 'order' && (
              <div className="OrderSummary__Promotion">
                <div className="OrderSummary__ColLabel">
                  <span className="OrderSummary__Label">{promotion.promotionDesc}</span>
                </div>
                <div className="OrderSummary__ColValue">
                  <span className="OrderSummary__Value">{formatCurrency(parseFloat(promotion.totalAdjustment))}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    ));

  /**
   * Order Discounts
   * If the 'displayOrderDiscountsList' config is true for the widget, then display each order level discount
   * otherwise display only the sum total of all the order level discounts
   */
  const renderOrderDiscounts = () =>
    discountInfo.orderDiscount > 0 && (
      <React.Fragment>
        {displayOrderDiscountsList ? (
          // display each order-level discount
          <React.Fragment>
            <div className="OrderSummary__Row">
              <div className="OrderSummary__ColLabel">
                <span className="OrderSummary__Label">Discount</span>
              </div>
            </div>
            {/* order level implicit discounts */}
            {renderOrderLevelImplicitDiscounts()}

            {/* order level explicit promotions */}
            {renderOrderLevelExplicitPromotions()}
          </React.Fragment>
        ) : (
          // display the sum total of all the order-level discounts
          <div className="OrderSummary__Row">
            <div className="OrderSummary__ColLabel">
              <span className="OrderSummary__Label">Discount</span>
            </div>
            <div className="OrderSummary__ColValue">
              <span className="OrderSummary__Value">
                {minusSign}
                {formatCurrency(discountInfo.orderDiscount)}
              </span>
            </div>
          </div>
        )}
      </React.Fragment>
    );

  /**
   * Price may change message
   */
  const renderPriceChangeMessage = () => (
    <div className="OrderSummary__Row">
      <div className="OrderSummary__MessageLabel">
        <span className="OrderSummary__LabelPricingMessage">{textPriceChangeMessage}</span>
      </div>
    </div>
  );

  /**
   * Total
   */
  const renderRemainingTotal = () => (
    <div className="OrderSummary__Row">
      <div className="OrderSummary__ColLabel">
        <span className="OrderSummary__LabelTotal">{textRemainingTotal}</span>
      </div>
      <div className="OrderSummary__ColValue">
        <span className="OrderSummary__ValueTotal">{formatCurrency(getAmountRemaining(order))}</span>
      </div>
    </div>
  );

  const renderAuthorizedPaymentGroups = () =>
    (Object.keys(order.paymentGroups) || []).map(paymentId => (
      <React.Fragment key={`PaymentGroup-${paymentId}`}>
        {isPaymentGroupPaid(paymentGroups[paymentId]) && (
          <div>
            <PaymentDetails payment={paymentGroups[paymentId]} {...props} />
          </div>
        )}
      </React.Fragment>
    ));

  return (
    <Styled id="OrderSummary" css={css}>
      <div className="OrderSummary">
        {!isEmptyObject(order) && (
          <React.Fragment>
            {renderSubTotal()}
            {renderShipping()}
            {/* {renderOrderDiscounts()} */}
            {/* {renderShippingDiscount()}
            {renderShippingSurcharge()} */}
            {renderTax()}
            {order.state !== ORDER_STATE_PENDING_PAYMENT && renderGiftCardBalance()}
            {order.state === ORDER_STATE_PENDING_PAYMENT && renderAuthorizedPaymentGroups()}
            {order.state === ORDER_STATE_PENDING_PAYMENT ? (
              <div className="OrderSummary__Total">
                <React.Fragment>{renderRemainingTotal()}</React.Fragment>
              </div>
            ) : (
              <React.Fragment>
                <div className="OrderSummary__Total">
                  {showTaxSummary && isTaxIncluded && (
                    <React.Fragment>
                      {/* Total (Excluding Tax) */}
                      {renderTotalExcludingTax()}
                    </React.Fragment>
                  )}

                  {renderTotal()}
                </div>
                {(showPriceChangeMessage || verifyCurrentOrderScheduled) && (
                  <React.Fragment>
                    {/* Total (Excluding Tax) */}
                    {renderPriceChangeMessage()}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </Styled>
  );
};

export default connect(getSiteData)(OrderSummary);
