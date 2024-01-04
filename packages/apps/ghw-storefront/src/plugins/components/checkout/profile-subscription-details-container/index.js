/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {StoreContext, OrderContext, ProductSelectionContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import Region from '@oracle-cx-commerce/react-components/region';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import PropTypes from 'prop-types';
import css from './styles.css';
import {getOrderData} from './selectors';

/**
 * Container that holds all the widget for the Order Details Page
 */
const ProfileSubscriptionDetailsContainer = props => {
  const {headingOrderDetails} = props;
  const {regions = []} = props;

  const {orderId, order} = props;

  const {action} = useContext(StoreContext);

  const [productSelection, setProductSelection] = useState([]);

  /**
   * Failure call back for the getOrder action
   */
  const onNotOk = useCallback(
    ({error: {message = ''} = {}} = {}) => {
      action('notify', {level: 'error', message});
    },
    [action]
  );

  /**
   * Get the order details for the specific order id
   */
  useEffect(() => {
    if (orderId) {
      action('getOrder', {orderId})
        .then(response => {
          if (response.ok === false) {
            onNotOk(response);
          }
        })
        .catch(error => {
          onNotOk({error});
        });
    }
  }, [action, onNotOk, orderId]);

  return (
    <Styled id="ProfileSubscriptionDetailsContainer" css={css}>
      <div className="ProfileSubscriptionDetailsContainer">
        {order && order.id && (
          <React.Fragment>
            <h1>{headingOrderDetails}</h1>
            <OrderContext.Provider value={order}>
              <ProductSelectionContext.Provider value={{productSelection, setProductSelection}}>
                <section className="ProfileSubscriptionDetailsContainer__Section">
                  {regions.map((regionId, index) => (
                    /*
                     Using region ids as keys causes unnecessary DOM reconciliation.
  
                     https://reactjs.org/docs/reconciliation.html#keys
                   */
                    // eslint-disable-next-line react/no-array-index-key
                    <Region key={index} regionId={regionId} />
                  ))}
                </section>
              </ProductSelectionContext.Provider>
            </OrderContext.Provider>
          </React.Fragment>
        )}
      </div>
    </Styled>
  );
};

ProfileSubscriptionDetailsContainer.propTypes = {
  order: PropTypes.shape({
    priceInfo: PropTypes.shape({
      subTotal: PropTypes.number,
      secondaryCurrencyShippingAmount: PropTypes.number,
      shipping: PropTypes.number,
      shippingSurchargeValue: PropTypes.number,
      secondaryCurrencyShippingSurchargeValue: PropTypes.number,
      secondaryCurrencyTaxAmount: PropTypes.number,
      tax: PropTypes.number,
      taxExclusiveAmount: PropTypes.number,
      totalWithoutTax: PropTypes.number,
      primaryCurrencyTotal: PropTypes.number,
      secondaryCurrencyTotal: PropTypes.number,
      total: PropTypes.number
    }),
    discountInfo: PropTypes.shape({
      orderDiscount: PropTypes.number,
      shippingDiscount: PropTypes.number,
      secondaryCurrencyShippingDiscount: PropTypes.number
    })
  }).isRequired,
  orderId: PropTypes.string.isRequired,
  regions: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default connect(getOrderData)(ProfileSubscriptionDetailsContainer);
