import {StoreContext, ContainerContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useContext, useEffect, useState} from 'react';
import Region from '@oracle-cx-commerce/react-components/region';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import PageLoader from '@oracle-cx-commerce/react-components/page-loader';
import {getComponentData} from './selectors';
import OrderConfirmationPlaceholder from './components/order-confirmation-placeholder';

import css from './styles.css';

const GHWCheckoutOrderConfirmationContainer = props => {
  const {regions = [], uuid = '', orderId = '', thankYou, ...order} = props;
  const [showPageLoader, setShowPageLoader] = useState(true);

  //context
  const {action} = useContext(StoreContext);

  /**
   * Invokes get order confirmation details action to get the details of placed order
   */
  useEffect(() => {
    if (uuid) {
      const payload = {uuid};
      action('getOrderConfirmation', payload).then(response => {
        setShowPageLoader(false);
        if (response.ok === false) {
          action('notify', {level: 'error', message: response.error.message});
        }
      });
    }
  }, [action, uuid]);

  return (
    <Styled id="GHWCheckoutOrderConfirmationContainer" css={css}>
      <div className="GHWCheckoutOrderConfirmationContainer">
        <PageLoader show={showPageLoader}>
          <OrderConfirmationPlaceholder />
        </PageLoader>
        {orderId && (
          <React.Fragment>
            <ContainerContext.Provider value={{orderId, ...order}}>
              <section className="GHWCheckoutOrderConfirmationContainer__Section">
                {regions.map((regionId, index) => (
                  /*
                     Using region ids as keys causes unnecessary DOM reconciliation.
  
                     https://reactjs.org/docs/reconciliation.html#keys
                   */
                  // eslint-disable-next-line react/no-array-index-key
                  <Region key={index} regionId={regionId} />
                ))}
              </section>
            </ContainerContext.Provider>
          </React.Fragment>
        )}
      </div>
    </Styled>
  );
};

export default connect(getComponentData)(GHWCheckoutOrderConfirmationContainer);
