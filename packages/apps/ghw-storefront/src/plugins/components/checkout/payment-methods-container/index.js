import Styled from '@oracle-cx-commerce/react-components/styled';
import Region from '@oracle-cx-commerce/react-components/region';
import {PaymentsContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import SpinnerContent from '@oracle-cx-commerce/react-components/page-loader/spinner-content';
import Card from '@oracle-cx-commerce/react-components/card';
import Badge from '@oracle-cx-commerce/react-components/badge';
import React, {createContext, useContext, useState, useEffect} from 'react';
import {getRegion, getWidget, isAuthenticated, getCurrentProfileId} from '@oracle-cx-commerce/commerce-utils/selector';
import Alert from '@oracle-cx-commerce/react-components/alert';
import {TabContainer, Tab} from '@oracle-cx-commerce/react-components/tabs';
import css from './payment-methods-container.css';
import payMethodIcons from '../helpers/icons';
import {setSelectedPaymentInfo} from '../helpers/payment-info-data';
import {compareSavedPayments} from '../helpers/saved-payment-comparer';
import {getPaymentType, getPaymentDescription} from './utils/payment';

export const PaymentMethodsContext = createContext();

const PaymentMethodsContainer = props => {
  const {
    regions = [],
    hostedFieldsTabLabel,
    paypalTabLabel,
    googlePayTabLabel,
    venmoPayTabLabel,
    applePayTabLabel,
    secureRemoteCommerceTabLabel,
    localPaymentTabLabel,
    achDirectDebitTabLabel,
    selectNewPaymentMethodButtonLabel,
    selectSavedPaymentMethodButtonLabel,
    useThisPaymentMethodButtonLabel,
    selectedPaymentMethodLabel,
    textSavedPaymentBankDescription
  } = props;
  const {addOrUpdatePaymentToContext, removePaymentFromContextByType} = useContext(PaymentsContext) || {};
  const [loading, setLoading] = useState(false);
  const [addMethod, setAddMethod] = useState(false);
  const store = useContext(StoreContext);
  const labelMapping = {
    CreditCardHostedFields: hostedFieldsTabLabel,
    PayPalPaymentButton: paypalTabLabel,
    GooglePayButton: googlePayTabLabel,
    VenmoPayButton: venmoPayTabLabel,
    ApplePayButton: applePayTabLabel,
    SecureRemoteCommerceButton: secureRemoteCommerceTabLabel,
    LocalPaymentButton: localPaymentTabLabel,
    ACHDirectDebit: achDirectDebitTabLabel,
    GHWCheckoutCreditCard: hostedFieldsTabLabel
  };
  const state = store.getState();
  const items = regions.map(regionId => {
    const region = getRegion(state, {regionId});
    const widget = getWidget(state, {widgetId: region.widgets[0]});
    const summaryLabel = labelMapping[widget.componentId];

    return {
      label: summaryLabel,
      content: <Region regionId={regionId} />,
      id: widget.componentId
    };
  });

  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  const [actionCompletedSuccessfully, setActionCompletedSuccessfully] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const [actionResponse, setActionResponse] = useState({type: '', message: ''});
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  // const [selectedNewPaymentMethod, setSelectedNewPaymentMethod] = useState(!isUserLoggedIn);
  const [selectedNewPaymentMethod, setSelectedNewPaymentMethod] = useState(true);
  const [paymentMethodToken, setPaymentMethodToken] = useState('');
  useEffect(() => {
    if (isUserLoggedIn && !actionCompletedSuccessfully && !errorOccured) {
      store.action('getShopperProfile').then(response => {
        if (response.ok) {
          const {paymentMethods} = response.delta.shopperProfileRepository.profile;
          setSavedPaymentMethods(paymentMethods);
          setActionCompletedSuccessfully(true);
        }
        if (!response.ok) {
          const {error} = response;
          setSavedPaymentMethods([]);
          setActionResponse({type: 'error', message: error.message});
          setErrorOccured(true);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoggedIn]);
  useEffect(() => {
    if (savedPaymentMethods) {
      const defaultPaymentMethod = savedPaymentMethods.find(p => p.default);
      if (defaultPaymentMethod) {
        const p = defaultPaymentMethod;
        const paymentType = getPaymentType(p);
        setPaymentMethodToken(defaultPaymentMethod.token);
        setSelectedPaymentInfo({imageUrl: defaultPaymentMethod.imageUrl, paymentType});
      }
    }
  }, [savedPaymentMethods]);
  useEffect(() => {
    if (paymentMethodToken) {
      addOrUpdatePaymentToContext({seqNum: 0, customProperties: {paymentMethodToken}, type: 'generic'});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethodToken]);

  const paymentMethodsContext = {
    setLoading,
    addMethod,
    setAddMethod
  };

  const tabHeaders = {
    PayPalPaymentButton: payMethodIcons.paypalIcon(),
    VenmoPayButton: payMethodIcons.venmoIcon(),
    SecureRemoteCommerceButton: payMethodIcons.srcIcon(),
    ApplePayButton: payMethodIcons.applePayIcon(),
    GooglePayButton: payMethodIcons.googlePayIcon(),
    CreditCardHostedFields: payMethodIcons.creditCardIcon(),
    ACHDirectDebit: payMethodIcons.usBankBTSrc(),
    GHWCheckoutCreditCard: payMethodIcons.creditCardIcon()
  };
  const hasSavedPayments = !!savedPaymentMethods && !!savedPaymentMethods.length;

  return (
    <Styled id="PaymentMethodsContainer" css={css}>
      {actionResponse.message && actionResponse.type && (
        <div className="PaymentMethodsContainer__ActionResponse">
          <Alert id="PaymentMethodsContainer__Alert" type={actionResponse.type} message={actionResponse.message} />
        </div>
      )}
      <PaymentMethodsContext.Provider value={paymentMethodsContext}>
        {/* {isUserLoggedIn && hasSavedPayments && !selectedNewPaymentMethod && (
          <button
            type="button"
            onClick={() => {
              setSelectedNewPaymentMethod(true);
              removePaymentFromContextByType('generic');
            }}
          >
            {selectNewPaymentMethodButtonLabel}
          </button>
        )}
        {isUserLoggedIn && hasSavedPayments && selectedNewPaymentMethod && (
          <button
            type="button"
            onClick={() => {
              setSelectedNewPaymentMethod(false);
              if (paymentMethodToken) {
                removePaymentFromContextByType('generic');
                setTimeout(() => {
                  addOrUpdatePaymentToContext({seqNum: 0, customProperties: {paymentMethodToken}, type: 'generic'});
                }, 1000);
              }
            }}
          >
            {selectSavedPaymentMethodButtonLabel}
          </button>
        )}
        {isUserLoggedIn && hasSavedPayments && (
          <ul className="PaymentMethodsContainer__Items">
            {!selectedNewPaymentMethod &&
              savedPaymentMethods.sort(compareSavedPayments).map(p => (
                <li key={p.globalId} className="PaymentMethodsContainer__Item">
                  <Card className="PaymentMethodsContainer__Card">
                    <div>
                      <div>
                        <img src={p.imageUrl} alt="payment-method"></img>
                      </div>
                    </div>
                    <div className="PaymentMethodsContainer__CardDetails">
                      <span>
                        {getPaymentDescription(p, {
                          textSavedPaymentBankDescription
                        })}
                      </span>
                      {paymentMethodToken === p.token ? (
                        <Badge badgeText={selectedPaymentMethodLabel} ariaLabel={selectedPaymentMethodLabel} />
                      ) : (
                        <button
                          className="PaymentMethodsContainer__SelectSavedPayment"
                          type="button"
                          onClick={() => {
                            const paymentType = getPaymentType(p);
                            setPaymentMethodToken(p.token);
                            setSelectedPaymentInfo({imageUrl: p.imageUrl, paymentType});
                          }}
                        >
                          {useThisPaymentMethodButtonLabel}
                        </button>
                      )}
                    </div>
                  </Card>
                </li>
              ))}
          </ul>
        )} */}
        {(selectedNewPaymentMethod || !hasSavedPayments) && (
          <div className="PaymentMethodsContainer">
<div className="payment">
							<h2 className="h2">Payment</h2>
							<div className="payments-strip">
							</div>
            </div>
            <h3 className="h3">Pay With:</h3>
            {loading && <SpinnerContent />}
            <TabContainer>
              {items.map(option => (
                <Tab key={option.id} header={tabHeaders[option.id] || option.label}>
                  {option.content}
                </Tab>
              ))}
            </TabContainer>
          </div>
        )}
      </PaymentMethodsContext.Provider>
    </Styled>
  );
};

// add connect HOC to connect to state
export default PaymentMethodsContainer;
