/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import Card from '@oracle-cx-commerce/react-components/card';
import CardIcon from '@oracle-cx-commerce/react-components/icons/credit-card';
import Link from '@oracle-cx-commerce/react-components/link';
import {PAGE_PROFILE_ADD_CREDIT_CARD_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import React from 'react';

/***
 * Displays No saved card View
 * @param {object} the required property object
 */
const NoSavedCardView = props => {
  const {actionAddPayment, textProfilePaymentHelper1, textProfilePaymentHelper2} = props;

  return (
    <div className="ProfileSavedPaymentSummary__NoCardContent">
      <Card type="primary">
        <span>{textProfilePaymentHelper1}</span>
        <span>{textProfilePaymentHelper2}</span>
        <div className="ProfileSavedPaymentSummary__AddACardLinkContainer">
          <span aria-label={`${textProfilePaymentHelper1} ${textProfilePaymentHelper2} ${actionAddPayment}`}>
            <Link href={PAGE_PROFILE_ADD_CREDIT_CARD_LINK}>
              <CardIcon />
              <span>{actionAddPayment}</span>
            </Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default NoSavedCardView;
