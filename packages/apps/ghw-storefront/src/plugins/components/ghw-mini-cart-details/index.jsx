/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {PAGE_HOME_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import PropTypes from 'prop-types';
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect, useSelector} from '@oracle-cx-commerce/react-components/provider';
import {getComponentData} from '@oracle-cx-commerce/react-widgets/cart/cart-item-details/selectors';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {useCartInitializer} from '@oracle-cx-commerce/react-components/utils/cart/hooks';
import {getCurrentSiteId} from '@oracle-cx-commerce/commerce-utils/selector';
import css from './ghw-mini-cart-details.css';
import GHWCartItemsTable from '../ghw-mini-cart-desktop/components/ghw-cart-item-table';

import {REFUSE_SITE_ID} from '../../utils/constants';
/**
 * CartItemDetails widget displays shopping cart commerce items to view each item quantity, price and promotion information.
 * It supports single shipping group only.
 * @param {*} props
 */
const GHWMiniCartDetails = props => {
  //resources
  const {actionContinueShopping} = props;
  //current order and shipping group info.
  const {currentOrder, isGetCartInProgress} = props;
  const {commerceItems = {}} = currentOrder;
  console.log('mini-card GHWMiniCartDetails-3-> ', props.miniCartItemsBeforeScrolling);

  useCartInitializer(currentOrder, isGetCartInProgress);
  const siteID = useSelector(getCurrentSiteId);
  const curentSiteID = typeof siteID === 'number' ? siteID.toString() : siteID;
  const fontColor = curentSiteID === REFUSE_SITE_ID ? 'GHWLimeGreen__Color' : '';

  return (
    <Styled id="GHWMiniCartDetails" css={css}>
      <div className="GHWMiniCartDetails">
        {isGetCartInProgress !== 1 && (
          <>
            {isEmptyObject(commerceItems) ? (
              <>
                {/* <a href={PAGE_HOME_LINK}>
                  <button type="button" className={`GHWMiniCartDetails__ContiueShopping ${fontColor}`}>
                    {actionContinueShopping}
                  </button>
                </a> */}
              </>
            ) : (
              <>
                <GHWCartItemsTable {...props} />
              </>
            )}
          </>
        )}
      </div>
    </Styled>
  );
};

GHWMiniCartDetails.propTypes = {
  isGetCartInProgress: PropTypes.number.isRequired,
  currentOrder: PropTypes.shape({
    commerceItems: PropTypes.objectOf(PropTypes.object)
  }).isRequired
};

export default connect(getComponentData)(GHWMiniCartDetails);
