import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import GHWOrderLeftNav from '../ghw-order-left-navigation';
import GhwOrders from '../ghw-orders';
import GhwSubscription from '../ghw-subscription';

const GHWOrderContainer = props => {
  const {route, contextId} = props;

  return (
    <Styled id="GHWOrderContainer" css={css}>
      <div className="profile-container row">
        <div className="col-xs-12 col-lg-3">
          <GHWOrderLeftNav {...props} />
        </div>
        {route === '/order-history' && !contextId && (
          <div className="col-xs-12 col-lg-9">
            <GhwOrders {...props} />
          </div>
        )}
        {route === '/Subscription' && (
          <div className="col-xs-12 col-lg-9">
            <GhwSubscription {...props} />
          </div>
        )}
      </div>
    </Styled>
  );
};

export default GHWOrderContainer;
