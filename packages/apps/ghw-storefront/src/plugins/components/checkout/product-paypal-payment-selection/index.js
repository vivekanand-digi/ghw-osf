import {getCurrentOrder, getCurrentProfileId, isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';
import Dropdown from '@oracle-cx-commerce/react-components/dropdown';
import Radio from '@oracle-cx-commerce/react-components/radio';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {ProductContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {ProductAddToCartButton} from '@oracle-cx-commerce/react-widgets';
import AddToCartButton from '@oracle-cx-commerce/react-widgets/product/product-add-to-cart-button/components/add-to-cart-button';
import {noop} from '@oracle-cx-commerce/utils/generic';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {useSelector} from '@oracle-cx-commerce/react-components/provider';

import {PAGE_CHECKOUT_SHIPPING_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import {getShopperProfile} from '../../../selectors/shopper-profile-selector';
import ProductPayPalPaymentButton from '../product-paypal-payment-button';
import css from './styles.css';

const ProductAddToCartButtonComponent = React.lazy(ProductAddToCartButton);

const getBillingFrequencyOptions = billingFrequencyOptionsString => {
  const splitItems = billingFrequencyOptionsString.split(',');

  return splitItems.map(frequency => ({
    value: frequency,
    label: `months${frequency}Label`
  }));
};

const PAYMENT_SELECTIONS = {
  ONE_TIME_PURCHASE: 'ONE_TIME_PURCHASE',
  RECURRING_PAYMENT: 'RECURRING_PAYMENT'
};

const ProductPaypalPaymentSelection = props => {
  const {
    billingFrequencyDropdownTitle = 'Deliver every:',
    billingFrequencyOptions = '1,2,3,4,5,6,7,8,9,10,11,12',
    actionAddSubscriptionToCart = 'Add subscription to cart',
    actionAddToCart,
    alertAddToCartAdding,
    actionAddToCartPreOrder,
    alertTotalItemQuantityExceeded,
    continueToPageAddress = '/checkout-review-order',
    enableFunding = 'credit,paylater,venmo',
    id,
    labelOneTimePurchase = 'One-time purchase:',
    labelRecurringPayment = 'Subscribe',
    messagingColor = 'blue',
    messagingLayout = 'text',
    messagingLogoPosition = 'left',
    messagingLogoType = 'primary',
    messagingPlacement = 'payment',
    messagingRatio = '1x1',
    messagingTextAlign = 'left',
    messagingTextColor = 'black',
    messagingTextSize = '12'
  } = props;

  const store = useContext(StoreContext);
  const {action: executeAction} = store;
  const state = store.getState();
  const isUserLoggedIn = isAuthenticated(state) && getCurrentProfileId(state) !== 'anonymous';
  const hasExistingShopperProfile = getShopperProfile(state).id;

  const billingFrequencySelectOptions = getBillingFrequencyOptions(billingFrequencyOptions);
  const currentOrder = useSelector(getCurrentOrder);
  const goToPage = useNavigator();

  const [isLoading, setIsLoading] = useState(false);
  const [sectionExpanded, setSectionExpanded] = useState(PAYMENT_SELECTIONS.ONE_TIME_PURCHASE);
  const [billingFrequency, setBillingFrequency] = useState(billingFrequencySelectOptions[0].value);
  const billingFrequencyRef = useRef(billingFrequency);

  useEffect(() => {
    billingFrequencyRef.current = billingFrequency;
  }, [billingFrequency]);

  const productContext = useContext(ProductContext);
  const {childSKUs} = productContext;
  const skuId = childSKUs && childSKUs.length ? childSKUs[0] : '';
  const {skus} = state.catalogRepository;
  const {x_isAvailableForSubscription: isAvailableForSubscription} = skuId ? skus[skuId] : false;

  useEffect(() => {
    if (!isUserLoggedIn) {
      return;
    }

    if (!hasExistingShopperProfile) {
      setIsLoading(true);
      // Setup shopperProfileRepository
      store.action('getShopperProfile').then(() => setIsLoading(false));
    }
  }, [hasExistingShopperProfile, isUserLoggedIn, store]);

  useEffect(() => {
    if (!isUserLoggedIn) {
      return;
    }

    // subscribe to 'addItemsToCartComplete', to get notified when an item is added to cart
    return store.subscribeDispatch(action => {
      const {type, originalAction: {payload: {items = []} = {}} = {}} = action;

      if (type !== 'addItemsToCartComplete') {
        return;
      }

      if (sectionExpanded === PAYMENT_SELECTIONS.ONE_TIME_PURCHASE) {
        executeAction('clearRecurringSubscription');

        return;
      }

      if (items && items.length > 0) {
        executeAction('addSubscriptionBillingFrequency', {
          billingFrequency: billingFrequencyRef.current
        });
        goToPage(PAGE_CHECKOUT_SHIPPING_LINK);
      }
    });
  }, [executeAction, goToPage, isUserLoggedIn, sectionExpanded, store]);

  const onAddToCart = useCallback(
    async ({payload, onOk = noop, onNotOk = noop, onComplete = noop}) => {
      let shouldExecuteAddToCart = false;

      if (currentOrder.numberOfItems) {
        const deleteCartResponse = await executeAction('deleteCart', {orderId: currentOrder.id});

        if (deleteCartResponse.ok) {
          shouldExecuteAddToCart = true;
        }
      } else {
        shouldExecuteAddToCart = true;
      }

      if (shouldExecuteAddToCart) {
        executeAction('addItemsToCart', {
          items: [{...payload}]
        })
          .then(response => {
            if (response.ok === true) {
              onOk(response);
            } else {
              onNotOk(response);
            }
          })
          .catch(error => {
            onNotOk({error});
          })
          .finally(onComplete);
      }
    },
    [currentOrder, executeAction]
  );

  // Not allowed for anonymous users
  if (!isUserLoggedIn || !isAvailableForSubscription) {
    return (
      <>
        <ProductAddToCartButtonComponent
          actionAddToCart={actionAddToCart}
          alertAddToCartAdding={alertAddToCartAdding}
          actionAddToCartPreOrder={actionAddToCartPreOrder}
          alertTotalItemQuantityExceeded={alertTotalItemQuantityExceeded}
        />
        <ProductPayPalPaymentButton
          continueToPageAddress={continueToPageAddress}
          enableFunding={enableFunding}
          messagingLayout={messagingLayout}
          messagingLogoType={messagingLogoType}
          messagingLogoPosition={messagingLogoPosition}
          messagingTextColor={messagingTextColor}
          messagingTextSize={messagingTextSize}
          messagingTextAlign={messagingTextAlign}
          messagingColor={messagingColor}
          messagingRatio={messagingRatio}
          messagingPlacement={messagingPlacement}
          id={id}
        />
      </>
    );
  }

  const handleBillingFrequencyChange = event => {
    setBillingFrequency(event.target.value);
  };

  return (
    <Styled id="ProductPaypalPaymentSelection" css={css}>
      <Radio
        id="product-payment-selection"
        name="one-time"
        value="one-time"
        onChange={() => undefined}
        onClick={() => setSectionExpanded(PAYMENT_SELECTIONS.ONE_TIME_PURCHASE)}
        checked={sectionExpanded === PAYMENT_SELECTIONS.ONE_TIME_PURCHASE}
        labelText={labelOneTimePurchase}
      />
      {sectionExpanded === PAYMENT_SELECTIONS.ONE_TIME_PURCHASE && (
        <div className="ProductPaypalPaymentSelection__RadioContent">
          <ProductAddToCartButtonComponent
            actionAddToCart={actionAddToCart}
            alertAddToCartAdding={alertAddToCartAdding}
            actionAddToCartPreOrder={actionAddToCartPreOrder}
            alertTotalItemQuantityExceeded={alertTotalItemQuantityExceeded}
          />
          <ProductPayPalPaymentButton
            continueToPageAddress={continueToPageAddress}
            enableFunding={enableFunding}
            messagingLayout={messagingLayout}
            messagingLogoType={messagingLogoType}
            messagingLogoPosition={messagingLogoPosition}
            messagingTextColor={messagingTextColor}
            messagingTextSize={messagingTextSize}
            messagingTextAlign={messagingTextAlign}
            messagingColor={messagingColor}
            messagingRatio={messagingRatio}
            messagingPlacement={messagingPlacement}
            id={id}
          />
        </div>
      )}
      <Radio
        id="product-payment-selection"
        name="recurring"
        value="recurring"
        onChange={() => undefined}
        onClick={() => setSectionExpanded(PAYMENT_SELECTIONS.RECURRING_PAYMENT)}
        checked={sectionExpanded === PAYMENT_SELECTIONS.RECURRING_PAYMENT}
        labelText={labelRecurringPayment}
      />
      {sectionExpanded === PAYMENT_SELECTIONS.RECURRING_PAYMENT && (
        <div className="ProductPaypalPaymentSelection__RadioContent">
          <Dropdown
            label={billingFrequencyDropdownTitle}
            id={`billingFrequency-${id}`}
            data-testid={`billingFrequency-${id}`}
            name="billingFrequency"
            value={billingFrequency}
            onChange={handleBillingFrequencyChange}
            onBlur={handleBillingFrequencyChange}
            required
          >
            {getBillingFrequencyOptions(billingFrequencyOptions).map(({label: labelKey, value}) => (
              <option
                tabIndex={0}
                value={value}
                key={`billingFrequency-${labelKey}-${value}`}
                aria-label={props[labelKey]}
              >
                {props[labelKey]}
              </option>
            ))}
          </Dropdown>
          <div className="ProductAddToCartButton__Wrapper">
            <AddToCartButton
              actionAddToCart={actionAddSubscriptionToCart}
              alertAddToCartAdding={alertAddToCartAdding}
              actionAddToCartPreOrder={actionAddToCartPreOrder}
              alertTotalItemQuantityExceeded={alertTotalItemQuantityExceeded}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>
      )}
    </Styled>
  );
};

export default ProductPaypalPaymentSelection;
