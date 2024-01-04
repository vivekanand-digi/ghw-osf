import React, {useContext, useEffect, useState} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';
import LocalStorageService from '../utils/localStorageService ';
import css from './ghw-billing-shipping-widget.css';
import {getComponentData} from './selectors';

const GHWBillingShippingWidget = props => {
  const {currentOrder} = props;
  const [billingAddress, setBillingAddress] = useState({});
  const [sameAsShippingAddress, setSameAsShippingAddress] = useState(false);

  const getShippingAddeess = () => {
    if (!isEmptyObject(currentOrder)) {
      const keys = Object.keys(currentOrder.shippingGroups);
      console.log(keys, currentOrder.shippingGroups[keys[0]].shippingAddress);
      const {firstName, lastName, address1, city, state, country, postalCode} =
        currentOrder.shippingGroups[keys[0]].shippingAddress;

      return `<span class="cust-name">${firstName} ${lastName} </span> </br> ${address1} ${city} ${state} </br>${country} ${postalCode}`;
    }

    return '';
  };
  const getBillingAddeess = () => {
    if (!isEmptyObject(billingAddress)) {
      const {firstName, lastName, address1, city, state, country, postalCode} = billingAddress;

      return `<span class="cust-name">${firstName} ${lastName} </span> </br> ${address1} ${city} ${state} </br>${country} ${postalCode}`;
    }

    return '';
  };
  useEffect(() => {
    console.log('bill', LocalStorageService.getItem('billingAddress'));
    const billigAddr = LocalStorageService.getItem('billingAddress');
    const sameShipBill = LocalStorageService.getItem('sameAsShipping');
    if (billigAddr !== null && !sameShipBill) {
      const {firstName, lastName, address1, city, state, country, postalCode} = billigAddr;
      setBillingAddress(billigAddr);

      return `${firstName} ${lastName} </br> ${address1} ${city} ${state} </br>${country} ${postalCode}`;
    }
  }, []);

  return (
    <Styled id="GHWBillingShippingWidget" css={css}>
      <div className="address-cnr">
        <div className="info">
          <h4 className="h4">Shipping Information</h4>
          <p className="meta-info" dangerouslySetInnerHTML={{__html: getShippingAddeess()}}></p>
        </div>
        <div className="info">
          <h4 className="h4">Billing Information</h4>
          {!isEmptyObject(billingAddress) ? (
            <p className="meta-info" dangerouslySetInnerHTML={{__html: getBillingAddeess()}}></p>
          ) : (
            <p className="meta-info" dangerouslySetInnerHTML={{__html: getShippingAddeess()}}></p>
          )}
        </div>
      </div>
    </Styled>
  );
};

export default connect(getComponentData)(GHWBillingShippingWidget);
