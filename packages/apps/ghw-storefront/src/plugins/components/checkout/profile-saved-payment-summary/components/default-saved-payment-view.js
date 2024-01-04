/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import Badge from '@oracle-cx-commerce/react-components/badge';
import Card from '@oracle-cx-commerce/react-components/card';
import Link from '@oracle-cx-commerce/react-components/link';
import {PAGE_PROFILE_SAVED_CARDS_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import React from 'react';
import {formatCardNumber} from '@oracle-cx-commerce/react-components/utils/payment';
import {t} from '@oracle-cx-commerce/utils/generic';

/***
 * Displays default saved card (if no default card then first card) View
 * @param {object} the required property object
 */
const DefaultSavedCardView = props => {
  const {
    actionManage,
    cardType,
    defaultPayment,
    labelManagePaymentLink,
    textDefaultPayment,
    textExpiryDate,
    textACHPaymentAccountDescription
  } = props;

  const isCard = !!defaultPayment.cardType && !!defaultPayment.last4;

  const getPaymentDescription = () => {
    if (isCard) {
      return (
        <>
          <span className="ProfileSavedPaymentSummary__PaymentText">
            {formatCardNumber(defaultPayment.maskedNumber, defaultPayment.cardType)}
          </span>
          <span className="ProfileSavedPaymentSummary__PaymentText">
            {t(textExpiryDate, {MONTH: defaultPayment.expirationMonth, YEAR: defaultPayment.expirationYear})}
          </span>
        </>
      );
    }

    if (defaultPayment.bankName) {
      return (
        <span className="ProfileSavedPaymentSummary__PaymentText">
          {t(textACHPaymentAccountDescription, {
            accountType: defaultPayment.accountType,
            last4: defaultPayment.last4
          })}
        </span>
      );
    }

    return null;
  };

  return (
    <div className="ProfileSavedPaymentSummary__DefaultCardContent">
      <Card>
        <div className="ProfileSavedPaymentSummary__PaymentIconContainer">
          <img
            className="ProfileSavedPaymentSummary__PaymentIcon"
            src={defaultPayment ? defaultPayment.imageUrl : ''}
            alt={isCard ? cardType.cardType : defaultPayment.email}
          />
        </div>
        <div className="ProfileSavedPaymentSummary__PaymentDetailsContainer">
          <span className="ProfileSavedPaymentSummary__PaymentText">
            {defaultPayment.cardholderName || defaultPayment.email || defaultPayment.bankName}
          </span>
          {getPaymentDescription()}
          {defaultPayment.isDefault && (
            <Badge
              className="ProfileSavedPaymentSummary__DefaultBadge"
              badgeText={textDefaultPayment}
              ariaLabel={textDefaultPayment}
            />
          )}
        </div>
        <div className="ProfileSavedPaymentSummary__ManageLinkContainer">
          <span
            aria-label={`${
              isCard ? defaultPayment.maskedNumber : defaultPayment.email
            }${textDefaultPayment}${labelManagePaymentLink}`}
          >
            <Link href={PAGE_PROFILE_SAVED_CARDS_LINK}>{actionManage}</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default DefaultSavedCardView;
