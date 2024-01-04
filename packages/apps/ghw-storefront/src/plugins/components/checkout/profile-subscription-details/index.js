import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {getPageData} from './selectors';
import {SubscriptionDetailsItem} from './component/subscription-details-item';
import css from './styles.css';

const CANCEL_SUBSCRIPTION_PAGE = 'cancel-subscription';

const ProfileSubscriptionDetails = props => {
  const goToPage = useNavigator();
  const {subscriptionId} = props;
  const {labelActionCancel} = props;

  const gotoCancelSubscriptionPage = () => {
    goToPage(`${CANCEL_SUBSCRIPTION_PAGE}/${subscriptionId}`);
  };

  return (
    <Styled id="ProfileSubscriptionDetails" css={css}>
      <div className="ProfileSubscriptionDetails">
        <SubscriptionDetailsItem {...props} />
        <div className="ProfileSubscriptionDetails__CardButtons">
          <div className="ProfileSubscriptionDetails__CardButtonsRow">
            <button
              className="ProfileSubscriptionDetails__CardButtonsSubmit"
              type="button"
              disabled={props.inProgress}
              onClick={() => gotoCancelSubscriptionPage()}
            >
              {labelActionCancel}
            </button>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default connect(getPageData)(ProfileSubscriptionDetails);
