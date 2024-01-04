// import React, {useContext} from 'react';
// import Styled from '@oracle-cx-commerce/react-components/styled';

// /*
//  * Uncomment the following line to get the parameter substitution
//  * function, e.g. t(someParameterizedResourceString, "someValue").
//  */
// import {t} from '@oracle-cx-commerce/utils/generic';

// import css from './styles.css';

// const GHWPromotionCodeEntry = props => {
//   return (
//     <Styled id="GHWPromotionCodeEntry" css={css}>
//       <div className="GHWPromotionCodeEntry"> Base Component GHWPromotionCodeEntry: {t('Hello')}</div>
//     </Styled>
//   );
// };

// export default GHWPromotionCodeEntry;

/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useContext, useEffect, useState, useRef} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import Minus from '@oracle-cx-commerce/react-components/icons/minus';
import Plus from '@oracle-cx-commerce/react-components/icons/plus';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import WarningIcon from '@oracle-cx-commerce/react-components/icons/warning';
import {getComponentData} from './selectors';
import css from './styles.css';

/**
 * GHWPromotionCodeEntry widget displays input field to enter and apply Promotion.
 * It handles promotion validation message.
 * @param {*} props
 * @memberof Components
 * @class GHWPromotionCodeEntry
 * @category Component-list
 * @param {String} messageDuplicateCoupon - Message shown when a duplicate coupon is applied.
 * @param {String} textApplyPromoCode - Locale specifying to apply a promo code.
 * @param {String} lablePromoCode - Label promo code.
 * @param {String} actionApply - Label indicating apply action.
 * @param {String} messageEmptyCoupon- Message shown when an empty promo code is applied.
 * @param {Boolean} [showApplyPromoInput = false] - Boolean flag to show/hide promo input section.
 * @author Oracle
 * @since 2.10.0
 */
const GHWPromotionCodeEntry = props => {
  //resources and configuration
  const {
    messageDuplicateCoupon,
    textApplyPromoCode,
    lablePromoCode,
    actionApply = 'Apply',
    messageEmptyCoupon,
    showApplyPromoInput = false
  } = props;
  const appliedCoupons = props.coupons || [];

  // component state variables
  const [showPromoForm, setShowPromoForm] = useState(showApplyPromoInput === 'true');
  const [couponErrorMessage, setCouponErrorMessage] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [isApplyCodeClicked, setIsApplyCodeClicked] = useState(false);
  const promoCodeInputElement = useRef(null);

  //context
  const {action} = useContext(StoreContext);

  const couponAlreadyApplied = () => {
    let alreadyApplied = false;
    if (appliedCoupons && appliedCoupons.length > 0) {
      const couponCount = appliedCoupons.length;
      for (let i = 0; i < couponCount; i++) {
        if (appliedCoupons[i] === promoCode) {
          alreadyApplied = true;
          break;
        }
      }
    }

    return alreadyApplied;
  };

  const applyPromotion = () => {
    setPromoCode(promoCode.trim());
    if (promoCode && promoCode !== '') {
      if (couponErrorMessage !== '') {
        setCouponErrorMessage('');
      }
      // check if the coupon has already been applied.
      if (couponAlreadyApplied()) {
        setCouponErrorMessage('Code already applied.');
      } else {
        const payload = {
          coupons: [promoCode]
        };
        setIsApplyCodeClicked(true);
        action('applyCouponsToCart', payload).then(response => {
          setIsApplyCodeClicked(false);
          if (response.ok) {
            promoCodeInputElement.current.value = '';
          } else if (response.error && response.error.errors && response.error.errors.length > 0) {
            const errorMessage = response.error.errors.reduce(
              (errorMessage, error) => `${errorMessage} ${error.message}`,
              ''
            );
            promoCodeInputElement.current.focus();
            setCouponErrorMessage(errorMessage);
          }
        });
      }
    } else {
      setCouponErrorMessage(messageEmptyCoupon);
    }
  };

  useEffect(() => {
    if (showPromoForm && promoCodeInputElement && promoCodeInputElement.current) promoCodeInputElement.current.focus();
  }, [showPromoForm]);

  return (
    <Styled id="GHWPromotionCodeEntry" css={css}>
      {props.displayPromoCodeEntry && (
        <div className="GHWPromotionCodeEntry">
          <div className="GHWPromotionCodeEntry__Container">
            <label className="GHWPromotionCodeEntry__Container__Lable" htmlFor="GHWPromotionCodeEntry__Input">
              {lablePromoCode}
            </label>
            <div className="GHWPromotionCodeEntry__InputContainer">
              <input
                name="promoCode"
                onChange={event => {
                  setPromoCode(event.target.value);
                }}
                id="GHWPromotionCodeEntry__Input"
                data-testid="GHWPromotionCodeEntry__Input"
                onKeyUp={event => {
                  if (event.key === 'Enter') applyPromotion();
                }}
                ref={promoCodeInputElement}
                placeholder="Discount Code"
              ></input>
              <span></span>
              <button onClick={applyPromotion} type="button" className="secondary" disabled={isApplyCodeClicked}>
                {actionApply}
              </button>
            </div>
            {couponErrorMessage !== '' && (
              <div className="GHWPromotionCodeEntry__ErrorMessage">
                <WarningIcon></WarningIcon>
                {couponErrorMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </Styled>
  );
};

export default connect(getComponentData)(GHWPromotionCodeEntry);
