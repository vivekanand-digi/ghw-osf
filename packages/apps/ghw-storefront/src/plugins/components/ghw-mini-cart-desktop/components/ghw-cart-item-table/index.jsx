/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import GWPPlaceholder from '@oracle-cx-commerce/react-widgets/cart/cart-item-details/components/gwp-placeholder';
import React, {useState, useContext, useMemo, useEffect} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {useCartState} from '@oracle-cx-commerce/react-components/utils/cart/hooks';
import Alert from '@oracle-cx-commerce/react-components/alert';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {useSelector, connect} from '@oracle-cx-commerce/react-components/provider';
import {getCurrentSiteId} from '@oracle-cx-commerce/commerce-utils/selector';
import {getComponentData} from '@oracle-cx-commerce/react-widgets/cart/cart-container/selectors';
import CartOrderSummary from '@oracle-cx-commerce/react-widgets/cart/cart-order-summary/component';
import {getOrderData} from '@oracle-cx-commerce/react-widgets/cart/cart-order-summary/selectors';
import {getCheckoutLink} from '@oracle-cx-commerce/react-widgets/checkout/checkout-button/utils';
import GenericCarousel from '@oracle-cx-commerce/react-components/generic-carousel';
import css from './styles.css';
import GHWMiniCartItemsTableHeader from '../ghw-mini-cart-item-table-header';
import GHWCartItemRow from '../ghw-mini-cart-item-row';
// import {MiniCartSubTotal} from '../ghw-mini-cart-desktop/components/mini-cart-components';
import {
  MiniCartButtons,
  MiniCartSubTotal,
  RenderOrderDiscounts,
  RenderTax,
  MiniCartTotal
} from '../mini-cart-components';
import {PAGE_CART_LINK} from '../../../../utils/constants/page-links';
import GHWModal from '../../../ghw-modal';
import {REFUSE_SITE_ID} from '../../../../utils/constants';
import GhwPromotionCodeEntry from '../../../ghw-promotion-code-entry';
import GHWPromotionsDisplay from '../../../ghw-promotions-display';
import Img from '../../../ghw-product-result-image/components/img';

/**
 * It display cart items table header, cart item list and GWP place holder (if cart has complex gift item) in shopping cart.
 *
 * @param {*} props
 */
const GHWMiniCartItemsTable = props => {
  // resources
  const {
    currentOrder: {shippingGroups = {}, commerceItems = {}, cssOverride, closeLinkAltText}
  } = props;

  console.log('currentOrder----2-->', props);
  const {setInvalidItems, invalidItemsOnQuantityChange, setInvalidItemsOnQuantityChange} = useCartState();
  const {
    priceInfo = {},
    currentPriceListGroup,
    currentOrder,
    textSubTotal,
    textAdditionalMessage,
    textViewCart,
    textConfirmClearCartMessage,
    actionCancel,
    actionDelete,
    textRemoveAll,
    isUserLoggedIn,
    miniCartProducts
  } = props;
  const store = useContext(StoreContext);
  const {action} = store;
  const orderOBJ = getOrderData(store.getState());
  console.log('priceInfo--->', priceInfo, orderOBJ);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  // const {action} = useContext(StoreContext);
  const handleClearCart = () => {
    setShowClearCartModal(true);
  };
  const handleCancel = () => {
    setShowClearCartModal(false);
  };
  const clearCart = async () => {
    if (!isEmptyObject(commerceItems)) {
      const commerceItemIds = Object.keys(commerceItems);
      await action('deleteItemsFromCart', {commerceItemIds});
      setShowClearCartModal(false);
    }
  };
  const siteID = useSelector(getCurrentSiteId);
  const curentSiteID = typeof siteID === 'number' ? siteID.toString() : siteID;
  const fontColor = curentSiteID === REFUSE_SITE_ID ? 'GHWLimeGreen__Color' : '';
  console.log('mini-card GHWMiniCartItemsTable-5-> ', props);
  const [products, setProducts] = useState();
  const [details, setDetails] = useState(true);
  useEffect(() => {
    // const payload = {productIds: recommendations, exclude: 'items.relatedProducts', priceListGroupId};const priceListGroupId = useSelector(getCurrentPriceListGroupId);
    const payload = {productIds: miniCartProducts, exclude: 'items.relatedProducts'};
    action('listProducts', payload).then(response => {
      console.log('response--->', response.delta.catalogRepository.products);
      setProducts(response.delta.catalogRepository.products);
      console.log('products--->', products);
    });
  }, [action]);

  const slides = useMemo(() => {
    const slidesList = [];
    if (products !== undefined) {
      for (const prod in products) {
        slidesList.push(
          <div className="product-slide fade">
            <div className="product-main">
              <img
                src={products[prod].primaryFullImageURL}
                alt={products[prod].primaryImageAltText}
                className="prodImg"
              />
              <div className="product-name">
                <h2 className="product-title">{products[prod].displayName}</h2>
                {/* <p>Size: 30ct{products[prod].primaryFullImageURL}</p> */}
                <p className="product-remove">
                  <b>${products[prod].salePrice}</b> <del>${products[prod].listPrice}</del>
                </p>
              </div>
              <a href={products[prod].route} type="button" className="btn primary-btn mini-custom">
                +
              </a>
            </div>
          </div>
        );
      }
    }

    return slidesList;
  }, [products]);

  return (
    <Styled id="GHWMiniCartItemsTable" css={css}>
      <div className="GHWMiniCartItemsTable_Body">
        {(Object.keys(shippingGroups || {}) || []).map(shippingGroupId => (
          <div key={shippingGroupId} className="prod-list-cnr">
            {shippingGroups[shippingGroupId].items.map(item => {
              return (
                <GHWCartItemRow
                  key={`${shippingGroupId}-${item.commerceId}`}
                  shippingGroupCommerceItem={item}
                  shippingGroupId={shippingGroupId}
                  commerceItem={commerceItems[item.commerceId]}
                  setInvalidItems={setInvalidItems}
                  setInvalidItemsOnQuantityChange={setInvalidItemsOnQuantityChange}
                  invalidItemsOnQuantityChange={invalidItemsOnQuantityChange}
                  {...props}
                />
              );
            })}
          </div>
        ))}
        {/* <section className="product-add">
          <div className="product-text">Add Companion Products, Free Shipping with Existing Order </div>
         
          <GenericCarousel
            slides={slides}
            mobile={false}
            showIndicator={true}
            isAutoSlide={false}
            itemsPerSlideDesktop={1}
            itemsPerSlideMobile={1}
          />
        </section> */}
        <section className="cart-checkout pricing-cnr">
          {/* <GhwPromotionCodeEntry {...props} /> */}
          {/* <GHWPromotionsDisplay {...props} /> */}
          {/* <div className={details ? 'hide' : 'show price-breakup'}>
            <div className="discount">
              Discount
              <div>
                <RenderOrderDiscounts
                  discountInfo={currentOrder.discountInfo}
                  orderPriceListGroup={currentPriceListGroup}
                />
              </div>
            </div>
            <div className="shopping-subTotal">
              Subtotal
              <MiniCartSubTotal subTotal={priceInfo.subTotal} orderPriceListGroup={currentPriceListGroup} />
            </div>
          </div> */}
          {/* <div className="shopping-sec">
            <div className='total-label'>Total</div>
            <div class='total-cost'>
            <a
              href
              onClick={() => {
                setDetails(!details);
              }}
            >
              {details ? 'Details' : 'Show Less'}
            </a>
              <MiniCartTotal total={priceInfo.total} orderPriceListGroup={currentPriceListGroup} />
              </div>
          </div> */}

          <div className="shopping-subTotal">
            Subtotal
            <MiniCartSubTotal subTotal={priceInfo.subTotal} orderPriceListGroup={currentPriceListGroup} />
          </div>
          <div className="action-btn-cnr">
            <a href="/home" className="continue-shopping btn btn-lg secondary-btn">
              <img src="/file/general/cart-bag.svg" alt="Shopping icon" />
              Continue Shopping
            </a>

            {!isUserLoggedIn ? (
              <a href="/checkout-login" className="checknow btn btn-lg primary-btn">
                <img src="/file/general/cart-wheel.svg" alt="Checkout icon" />
                Checkout Now
              </a>
            ) : (
              <a href="/checkout-shipping" className="checknow btn btn-lg primary-btn">
                {/* <img src="/file/general/cart-wheel.svg" alt="Checkout icon" /> */}
                Checkout Now
              </a>
            )}
          </div>
        </section>
      </div>
      {/* <GWPPlaceholder {...props} /> */}
    </Styled>
  );
};

export default GHWMiniCartItemsTable;
