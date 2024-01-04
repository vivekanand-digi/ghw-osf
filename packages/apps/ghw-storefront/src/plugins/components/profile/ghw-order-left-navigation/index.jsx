import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';

const GHWOrderLeftNav = props => {
  const {route} = props;

  return (
    <Styled id="GHWOrderLeftNav" css={css}>
            <div className="v-tab_tab-head v-tab-list">
                <a href="/order-history" className={route === '/order-history' && 'active'}>
                  Order
                </a>
                <a href="/subscription" className={route === '/Subscription' && 'active'}>
                  Subscription
                </a>
            </div>
    </Styled>
  );
};

export default GHWOrderLeftNav;
