import React from 'react';

import {useDateFormatter, useNumberFormatter} from '@oracle-cx-commerce/react-components/utils/hooks';
import {t} from '@oracle-cx-commerce/utils/generic';
import Styled from '@oracle-cx-commerce/react-components/styled';

import css from './styles.css';

export const SubscriptionDetailsItem = props => {
  const formatCurrency = useNumberFormatter({style: 'currency'});
  const formatDate = useDateFormatter();

  const {subscriptionDetails} = props;
  const {
    id,
    planId,
    createdAt,
    billingPeriodStartDate,
    billingPeriodEndDate,
    billingDayOfMonth,
    nextBillAmount,
    nextBillingDate,
    numberOfBillingCycles,
    currentBillingCycle
  } = subscriptionDetails;
  const {
    labelSubscriptionId,
    labelPlanId,
    labelOrderId,
    labelCreatedOn,
    labelBillingPeriodStartDate,
    labelBillingPeriodEndDate,
    labelBillingDayOfMonth,
    labelNextBillAmount,
    labelNextBillDate,
    labelNumberOfBillingCycles,
    labelCurrentBillingCycle
  } = props;

  const orderId = id.split('-')[1];

  const labelValueList = [
    {
      label: labelSubscriptionId,
      value: id
    },
    {
      label: labelPlanId,
      value: planId
    },
    {
      label: labelOrderId,
      value: orderId
    },
    {
      label: labelCreatedOn,
      value: formatDate(new Date(createdAt))
    },
    {
      label: labelBillingPeriodStartDate,
      value: formatDate(new Date(billingPeriodStartDate))
    },
    {
      label: labelBillingPeriodEndDate,
      value: formatDate(new Date(billingPeriodEndDate))
    },
    {
      label: labelBillingDayOfMonth,
      value: billingDayOfMonth
    },
    {
      label: labelNextBillAmount,
      value: formatCurrency(nextBillAmount)
    },
    {
      label: labelNextBillDate,
      value: nextBillingDate
    },
    {
      label: labelNumberOfBillingCycles,
      value: numberOfBillingCycles
    },
    {
      label: labelCurrentBillingCycle,
      value: currentBillingCycle
    }
  ];

  return (
    <Styled id="SubscriptionDetailsItem" css={css}>
      <ul className="SubscriptionDetailsItem">
        {labelValueList.map(
          ({label, value}) =>
            value && (
              <li key={value}>
                <div className="SubscriptionDetailsItem__ItemLabel">{label}</div>
                <div className="SubscriptionDetailsItem__ItemValue">{value}</div>
              </li>
            )
        )}
      </ul>
    </Styled>
  );
};
