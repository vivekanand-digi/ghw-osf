import React, {useEffect, useContext, useState} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {getPage} from '@oracle-cx-commerce/commerce-utils/selector';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import css from './styles.css';
import TabComponent from '../../commom/TabComponent';
import {textMyAccount, textMyOrder} from './locales/en';
import GHWProfileContainer from '../ghw-profile-container';
import {getPageData} from './selectors';
import GHWOrderContainer from '../ghw-order-container';
import GhwOrdersDetails from '../ghw-orders-details';
import GhwOrdersDetailsInvoice from '../ghw-orders-details-invoice';
import GhwSubscriptionDetails from '../ghw-subscription-details';
import GhwSubscriptionDetailsInvoice from '../ghw-subscription-details-invoice';
import GhwSubscriptionMultiple from '../ghw-subscription-multiple';
import GHWProfileSavedCards from '../ghw-profile-saved-cards';
import { t } from "@oracle-cx-commerce/utils/generic";

const GHWMyAccount = props => {
  const {currentProfile, textTest} = props;
  const store = useContext(StoreContext);
  const {route = '', contextId = ''} = getPage(store.getState());
  const [currentProfileDetails, setCurrentProfileDetails] = useState();

  useEffect(() => {
    setCurrentProfileDetails(currentProfile);
  }, [store, currentProfile]);

  return (
    <Styled id="GHWMyAccount" css={css}>
      {route === '/order-history' && contextId && (
        <div className="col-xs-12 col-lg-9 gw-col-9">
          <GhwOrdersDetails route={route} contextId={contextId} {...props} />
        </div>
      )}
      {route === '/order-detail-invoice' && (
        <div className="col-xs-12 col-lg-9 gw-col-9">
          <GhwOrdersDetailsInvoice route={route} contextId={contextId} {...props} />
        </div>
      )}
      {route === '/Subscription' && contextId && (
        <div className="col-xs-12 col-lg-9 gw-col-9">
          <GhwSubscriptionDetails route={route} contextId={contextId} {...props} />
        </div>
      )}
      {route === '/subscription-detail-invoice' && (
        <div className="col-xs-12 col-lg-9 gw-col-9">
          <GhwSubscriptionDetailsInvoice route={route} contextId={contextId} {...props} />
        </div>
      )}
      {route === '/subscription-multple' && (
        <div className="col-xs-12 col-lg-9 gw-col-9">
          <GhwSubscriptionMultiple route={route} contextId={contextId} {...props} />
        </div>
      )}
       {/* {route === '/profile-saved-cards' && (
        <div className="col-xs-12 col-lg-9">
          <GHWProfileSavedCards route={route} contextId={contextId} {...props} />
        </div>
      )} */}
      {((route === '/order-history' && !contextId) ||
        route === '/profile' ||
        (route === '/Subscription' && !contextId) ||
        route === '/add-profile-address' ||
        route === '/address-book' ||
        route === '/profile-saved-cards' ||
        route === '/edit-profile-address' ||
        route === '/update-password') && (
        <div className="GHWMyAccount">
          <TabComponent
            tabLabelOne={textMyAccount}
            tabLabelTwo={textMyOrder}
            route={route}
            initiateActiveTab="tab1"
            tabComponentOne={() => (
              <GHWProfileContainer
                currentProfileDetails={currentProfileDetails}
                setCurrentProfileDetails={setCurrentProfileDetails}
                route={route}
                {...props}
              />
            )}
            tabComponentTwo={() => (
              <GHWOrderContainer
                currentProfileDetails={currentProfileDetails}
                setCurrentProfileDetails={setCurrentProfileDetails}
                route={route}
                contextId={contextId}
                {...props}
              />
            )}
          />
        </div>
      )}
    </Styled>
  );
};

export default connect(getPageData)(GHWMyAccount);
