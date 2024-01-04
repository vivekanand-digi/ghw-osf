import React, {useContext, useEffect, useState} from 'react';

import Alert from '@oracle-cx-commerce/react-components/alert';
import Card from '@oracle-cx-commerce/react-components/card';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {getPageData} from './selectors';

import css from './styles.css';
import ProfileSubscription from './components/ProfileSubscription';
import {useInitializeWidget} from '../../../fetchers/hooks';

const ProfileRecurringPaymentSubscriptions = props => {
  const {clientToken, id, isUserLoggedIn, subscriptionList} = props;
  const {headingSubscriptions = 'Subscriptions', textNoSubscriptionListMessage = 'No subscriptions'} = props;
  const [actionCompletedSuccessfully, setActionCompletedSuccessfully] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const store = useContext(StoreContext);
  const {action} = store;
  // local state to show action result in alert
  const [actionResponse, setActionResponse] = useState({type: '', message: ''});

  useInitializeWidget(store);

  useEffect(() => {
    if (clientToken && !actionCompletedSuccessfully && isUserLoggedIn && !errorOccurred) {
      action('getShopperProfile').then(response => {
        if (response.ok) {
          setActionCompletedSuccessfully(true);
        }
        if (!response.ok) {
          const {error} = response;
          setActionResponse({type: 'error', message: error.message});
          setErrorOccurred(true);
        }
      });
    }
  }, [action, actionCompletedSuccessfully, clientToken, errorOccurred, isUserLoggedIn]);

  return (
    <Styled id="ProfileRecurringPaymentSubscriptions" css={css}>
      {isUserLoggedIn && (
        <div className="ProfileRecurringPaymentSubscriptions">
          <div>
            <h1>{headingSubscriptions}</h1>
          </div>
          {actionResponse.message && actionResponse.type && (
            <div className="ProfileRecurringPaymentSubscriptions__ActionResponse">
              <Alert
                id={`ProfileRecurringPaymentSubscriptions__Alert-${props.id}`}
                type={actionResponse.type}
                message={actionResponse.message}
              />
            </div>
          )}
          {actionCompletedSuccessfully &&
            (subscriptionList.length === 0 ? (
              <div>
                <Card type="primary" className="ProfileRecurringPaymentSubscriptions__NoSubscriptions">
                  <span>{textNoSubscriptionListMessage}</span>
                </Card>
              </div>
            ) : (
              <ul id={`subscriptionList-${id}`} className="ProfileRecurringPaymentSubscriptions__Items">
                {subscriptionList.sort((a, b) => a.id < b.id ? 1 : -1).map(subscriptionDetails => (
                  <li key={subscriptionDetails.id} className="ProfileRecurringPaymentSubscriptions__Item">
                    <ProfileSubscription {...props} subscriptionDetails={subscriptionDetails} />
                  </li>
                ))}
              </ul>
            ))}
        </div>
      )}
    </Styled>
  );
};

export default connect(getPageData)(ProfileRecurringPaymentSubscriptions);
