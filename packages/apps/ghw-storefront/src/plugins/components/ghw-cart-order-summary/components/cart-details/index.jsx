/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {GetSizeAndFreqDetails} from '../../../ghw-mini-cart-desktop/components/mini-commerce-item-components';
import css from './cart-details.css';
import {useNumberFormatter} from '@oracle-cx-commerce/react-components/utils/hooks';

const CartDetails = props => {
  const {orderItes = {}} = props;
  const formatCurrency = useNumberFormatter({style: 'currency'});

  const getSize = commerceItem => {
    let size = '';

    commerceItem.variant?.forEach(ele => {
      if (ele.optionName === 'Count') {
        size = `Size: ${ele.optionValue}`;
      }
    });

    return size;
  };
  const getFreqDetails = commerceItem => {
    const newArray = commerceItem.dynamicProperties?.filter(function (item) {
      return item.id === 'ghwSubscription';
    });
    const frequency =
      newArray[0].value != null && newArray[0].value !== 'Onetime' ? `${newArray[0].value}` : '';
      // newArray[0].value != null && newArray[0].value !== 'Onetime' ? `Auto Ship: ${newArray[0].value}` : '';

    return frequency;
  };

  const getPaymentMethod = () => {
    return (
      <Styled id="CartDetails" css={css}>
        <div className="CartDetails">
          {Object.keys(orderItes).map(item => {
            console.log('item-->', orderItes[item]);

            return (
              <div key={orderItes[item].id} className="capsule-sec">
                <div className="img">
                  <img src={orderItes[item].primaryThumbImageURL} alt={orderItes[item].primaryImageAltText} />
                </div>

                <div className="content">
                  <h4 className="title">{orderItes[item].displayName}</h4>
                  <p className="para">Includes Savings with Convenient Monthly Auto-Ship Program</p>
                  <div className="quantity">
                      {/* <p>{getSize(orderItes[item])}</p> */}
                      <p>Auto Ship:<span>{getFreqDetails(orderItes[item])}</span></p>
                    </div>
                    <div className="quantity">
                    <p>
                      Qty:
                      <span className='qty-value'>{orderItes[item].quantity}</span>
                    </p>
                  </div>
                </div>
                <div class='content'>                  
                  <h2 class="offer-price title">{formatCurrency(orderItes[item].amount)}</h2> 
                </div>
              </div>
            );
          })}
        </div>
      </Styled>
    );
  };

  return <>{getPaymentMethod()}</>;
};

export default CartDetails;
