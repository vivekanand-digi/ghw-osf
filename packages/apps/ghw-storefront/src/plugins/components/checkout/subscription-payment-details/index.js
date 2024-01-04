import React, {useContext, useEffect} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {useSelector} from '@oracle-cx-commerce/react-components/provider';
import {t} from '@oracle-cx-commerce/utils/generic';
import {getCurrentOrder} from '@oracle-cx-commerce/commerce-utils/selector';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {getShopperSubscription} from '../../../selectors/shopper-profile-selector';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */

import css from './styles.css';

const SubscriptionPaymentDetails = props => {
  const {subscriptionMessageBase, subscriptionMessageSingleMonth, subscriptionMessageMonthsPlural} = props;

  const {numberOfItems} = useSelector(getCurrentOrder);
  const subscriptionBillingFrequency = useSelector(getShopperSubscription).billingFrequency;

  const store = useContext(StoreContext);
  const {action: executeAction} = store;

  useEffect(() => {
    if (numberOfItems || !subscriptionBillingFrequency) {
      return;
    }

    executeAction('clearRecurringSubscription');
  }, [executeAction, numberOfItems, subscriptionBillingFrequency]);

  if (!subscriptionBillingFrequency || !numberOfItems) {
    return null;
  }

  return (
    <Styled id="SubscriptionPaymentDetails" css={css}>
      <div className="SubscriptionPaymentDetails">
        {subscriptionMessageBase}
        <span>
          {subscriptionBillingFrequency === '1'
            ? subscriptionMessageSingleMonth
            : t(subscriptionMessageMonthsPlural, {billingFrequency: subscriptionBillingFrequency})}
        </span>
      </div>
    </Styled>
  );
};

export default SubscriptionPaymentDetails;
