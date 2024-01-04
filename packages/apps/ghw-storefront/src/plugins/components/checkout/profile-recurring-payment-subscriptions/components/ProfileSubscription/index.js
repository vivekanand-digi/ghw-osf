/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';

import Card from '@oracle-cx-commerce/react-components/card';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {useDateFormatter, useNumberFormatter} from '@oracle-cx-commerce/react-components/utils/hooks';

import css from './styles.css';

const SUBSCRIPTION_DETAILS = 'subscription-details';

/**
 * UI component for a card.
 * It show basic detail of card like mask car number, name on card expiry date etc.
 * @param {*} props the required properties
 */
const ProfileSubscription = props => {
  const goToPage = useNavigator();

  const {subscriptionDetails} = props;
  const {billingPeriodStartDate, billingPeriodEndDate, id, nextBillingDate, nextBillAmount} = subscriptionDetails;
  const {
    labelPlanID = 'Plan ID',
    labelBillingPeriodStartDate = 'Billing Period Start Date',
    labelBillingPeriodEndDate = 'Billing Period End Date',
    labelNextBillingDate = 'Next Billing Date',
    labelNextBillAmount = 'Next Billing Amount'
  } = props;

  const formatCurrency = useNumberFormatter({style: 'currency'});
  const formatDate = useDateFormatter();

  return (
    <Styled id="ProfileSubscription" css={css}>
      <Card
        className="ProfileSubscription"
        onClick={() => {
          goToPage(`${SUBSCRIPTION_DETAILS}/${id}`);
        }}
      >
        <ul className="ProfileSubscription__List">
          <li>
            <div>{labelPlanID}</div>
            <div>{id}</div>
          </li>
          <li>
            <div>{labelBillingPeriodStartDate}</div>
            <div>{formatDate(new Date(billingPeriodStartDate))}</div>
          </li>
          <li>
            <div>{labelBillingPeriodEndDate}</div>
            <div>{formatDate(new Date(billingPeriodEndDate))}</div>
          </li>
          <li>
            <div>{labelNextBillingDate}</div>
            <div>{formatDate(new Date(nextBillingDate))}</div>
          </li>
          <li>
            <div>{labelNextBillAmount}</div>
            <div>{formatCurrency(nextBillAmount)}</div>
          </li>
        </ul>
      </Card>
    </Styled>
  );
};

export default ProfileSubscription;
