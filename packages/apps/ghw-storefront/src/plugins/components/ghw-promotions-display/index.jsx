import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useState, useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
// import css from '@oracle-cx-commerce/react-widgets/cart/promotions-display/styles.css';
import {useNumberFormatter} from '@oracle-cx-commerce/react-components/utils/hooks';
import {t} from '@oracle-cx-commerce/utils/generic';
import Alert from '@oracle-cx-commerce/react-components/alert';
import {getComponentData} from '@oracle-cx-commerce/react-widgets/cart/promotions-display/selectors';
import WarningIcon from '@oracle-cx-commerce/react-components/icons/warning';
import DeleteIcon from '@oracle-cx-commerce/react-components/icons/delete';
import css from "./styles.css";

/**
 * GHWPromotionsDisplay widget displays list of applied Promotions.
 * It handles promotion validation messages occurred while removing a promotion.
 * @param {*} props
 * @memberof Components
 * @class GHWPromotionsDisplay
 * @category Component-list
 * @param {String} actionRemove - Label indicating remove action.
 * @param {String} messagePromoApplied - Message indicating that a specific promo code is applied.
 * @param {String} messagePromoOffer - Message indicating promo code offer.
 * @param {Object} [orderCouponsMap = {}] - A map containing different coupons.
 * @param {Array} [orderImplicitDiscountList = []] - List of implicit discounts.
 * @author Oracle
 * @since 2.10.0
 */
const GHWPromotionsDisplay = props => {
  const {
    actionRemove = 'Remove',
    messagePromoApplied = '__PROMOCODE__  - Applied. ',
    messagePromoOffer = '__OFFPRICE__ off your order. '
  } = props;
  const formatCurrency = useNumberFormatter({style: 'currency'});
  const {orderCouponsMap = {}, orderImplicitDiscountList = []} = props;
  const {action} = useContext(StoreContext);
  const [couponErrorMessage, setCouponErrorMessage] = useState('');

  // it removes the selected explicit promotion
  const removePromoCode = promocode => {
    const payload = {
      coupons: [promocode]
    };
    action('removeCouponsFromCart', payload).then(response => {
      if (!response.ok && response.error && response.error.errors && response.error.errors.length > 0) {
        const errorMessage = response.error.errors.reduce(
          (errorMessage, error) => `${errorMessage} ${error.message}`,
          ''
        );
        setCouponErrorMessage(errorMessage);
      }
    });
  };

  return (
    <Styled id="GHWPromotionsDisplay" css={css}>
      {(Object.keys(orderCouponsMap).length > 0 || orderImplicitDiscountList.length > 0) && (
        <div className="GHWPromotionsDisplay">
          {couponErrorMessage !== '' && (
            <div className="PromotionCodeEntry__ErrorMessage">
              {/* <WarningIcon></WarningIcon> */}
              {couponErrorMessage}
            </div>
          )}
          {/* {Display list of implicit promotions} */}
          {orderImplicitDiscountList.length > 0 &&
            orderImplicitDiscountList.map(promotion => (
              <div key={promotion.promotionName} className="PromotionsDisplay__boldText">
                {t(messagePromoApplied, {PROMOCODE: promotion.promotionName})}
              </div>
            ))}
          {/* {Display list of explicit promotions} */}
          {Object.keys(orderCouponsMap).length > 0 &&
            Object.keys(orderCouponsMap || {}).map(promocode => (
              <div className="coupon-tag" key={promocode}>
                <div className='code'>
                  <span>{promocode}</span>
                </div>
                <button
                  type="button"
                  onKeyDown={event => {
                    if (event.key === 'Enter') removePromoCode(promocode);
                  }}
                  className="PromotionsDisplay__RemoveLink"
                  onClick={() => removePromoCode(promocode)}
                >
                  {/* {t(actionRemove)} */}
                  {/* <DeleteIcon></DeleteIcon> */}
                  <img src="/file/general/close-icon.svg" alt="Close"/>
                </button>
              </div>
            ))}
          <div>
            {Object.keys(orderCouponsMap).length > 0 ? (
              <span className="coupon-success">Coupon Code Applied Successfully</span>
            ) : (
              ''
            )}
          </div>
        </div>
      )}
    </Styled>
  );
};

export default connect(getComponentData)(GHWPromotionsDisplay);
