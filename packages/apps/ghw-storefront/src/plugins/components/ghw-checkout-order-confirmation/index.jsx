import React, { useContext, useState } from "react";
import {
  StoreContext,
  ContainerContext,
} from "@oracle-cx-commerce/react-ui/contexts";
import { getProfile } from "@oracle-cx-commerce/commerce-utils/selector";
import Styled from "@oracle-cx-commerce/react-components/styled";
import LocalStorageService from "../utils/localStorageService ";
import css from "./styles.css";
import { useNumberFormatter } from "@oracle-cx-commerce/react-components/utils/hooks";

// eslint-disable-next-line spellcheck/spell-checker
/**
 * Widget to display Order Confirmation Details
 * @param {props} component props
 * @memberof Components
 * @class GHWCheckoutOrderConfirmation
 * @category Component-list
 * @param {String} textOrderConfirmation - Message specifying for order confirmation.
 * @param {String} textReceiveEmailAfterApproval - Text specifying an email will be sent after order is approved.
 * @param {String} textAfterapprovalPendingPaymentMessage - Text specifying pending payment message after order approval.
 * @param {String} headingOrderConfirmation - Heading for order confirmation.
 * @param {String} textOrderNumber - Text for order number.
 * @author Oracle
 * @since 2.10.0
 */
const GHWCheckoutOrderConfirmation = (props) => {
  //locales
  const { textOnlinePaymentMethod, textCreditCardPaymentMethod } = props;
  //context
  const {
    orderId = "",
    orderState,
    paymentData,
    orderSubmittedDate,
    shippingAddress,
    commerceItems,
    dynamicProperties,
  } = useContext(ContainerContext) || {};
  console.log(
    "priceInfo-->",
    orderId,
    orderState,
    paymentData,
    orderSubmittedDate,
    shippingAddress,
    commerceItems,
    dynamicProperties
  );

  console.log("ContainerContext-->", useContext(ContainerContext));
  const store = useContext(StoreContext);
  const { getState } = store;
  const today = new Date();
  const currentProfile = getProfile(getState());
  console.log("currentProfile-->", currentProfile);

  const getPaymentKey = Object.keys(paymentData);
  const getPaymentDetails = paymentData[getPaymentKey];
  const { paymentMethod } = getPaymentDetails;
  const getKey = Object.keys(shippingAddress);
  const getAddredess = shippingAddress[getKey].shippingAddress;
  const { priceInfo, discountInfo } = shippingAddress[getKey];
  let billingAddress = {
    firstName: null,
    lastName: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    country: null,
    postalCode: null,
  };

  dynamicProperties.forEach((obj) => {
    if (obj.id === "x_billingAddress") {
      billingAddress = JSON.parse(obj.value);
    }
  });

  let totalDiscountInfo = 0;
  if (discountInfo?.orderDiscount) {
    totalDiscountInfo += discountInfo.orderDiscount;
  }
  if (Number(discountInfo?.shippingDiscount)) {
    totalDiscountInfo += discountInfo.shippingDiscount;
  }
  console.log("totalDiscountInfo-->", totalDiscountInfo);

  const formatCurrency = useNumberFormatter({ style: "currency" });

  const {
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    country,
    postalCode,
  } = getAddredess;

  const isPendingApproval =
    orderState === "PENDING_APPROVAL" ||
    orderState === "PENDING_APPROVAL_TEMPLATE"
      ? true
      : false;

  let isPaymentRequiredAfterApproval = false;
  if (isPendingApproval) {
    isPaymentRequiredAfterApproval =
      paymentData[0] !== undefined ? paymentData[0].default_initial : true;
  }
  const print = () => {
    window.print();
  };
  const renderCommerceItems = (
    itemImg,
    itemPartNumber,
    itemDisplayName,
    itemQty,
    ghwSubscription,
    itemPrice,
    count
  ) => {
    return (
      <>
        <div className="product">
          <div className="prod-image">
            <img src={itemImg} alt={itemPartNumber} />
          </div>
          <div className="product-content">
            <div className="prod-name">{itemDisplayName}</div>
            <div className="prod-desc">
              {ghwSubscription !== "onetime"
                ? "Includes Savings with Convenient Monthly Auto-Ship Program"
                : ""}
            </div>
            <div className="item-list">
              {count ? (
                <div className="item-info">
                  <h4 className="label">Size:</h4>
                  <h4 className="value">{count}</h4>
                </div>
              ) : (
                ""
              )}
              {ghwSubscription !== "onetime" ? (
                <div className="item-info">
                  <h4 className="label">Auto Ship:</h4>
                  <h4 className="value">{ghwSubscription}</h4>
                </div>
              ) : (
                ""
              )}

              <div className="item-info">
                <h4 className="label">Qty:</h4>
                <h4 className="value">{itemQty}</h4>
              </div>
              <div className="item-info">
                <h4 className="label">Price</h4>
                <h4 className="value mb-value">{formatCurrency(itemPrice)}</h4>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const bundlePlaceholder = () => {
    return (
      <div className="bundle-product">
        <h3 className="bundle-title">Combo Name Here</h3>
        <div className="product-list mb-product-list">
          <div className="product">
            <div className="prod-image">
              <img
                src="/ccstore/v1/images/?source=/file/v2426383475247368400/products/OXL0005.bottle_front_1x.png&amp;height=100&amp;width=100"
                alt="OXL0005"
              />
            </div>
            <div className="product-content">
              <div className="prod-name">OmegaXL-60ct</div>
              <div className="prod-desc">
                Includes Savings with Convenient Monthly Auto-Ship Program
              </div>
              <div className="item-list">
                <div className="item-info">
                  <h4 className="label">Auto Ship:</h4>
                  <h4 className="value">1 Month</h4>
                </div>
                <div className="item-info">
                  <h4 className="label">Qty:</h4>
                  <h4 className="value">1</h4>
                </div>
                <div className="item-info">
                  <h4 className="label">Price</h4>
                  <h4 className="value mb-value">39.95</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="product-list mb-product-list">
          <div className="product">
            <div className="prod-image">
              <img
                src="/ccstore/v1/images/?source=/file/v2426383475247368400/products/OXL0005.bottle_front_1x.png&amp;height=100&amp;width=100"
                alt="OXL0005"
              />
            </div>
            <div className="product-content">
              <div className="prod-name">
                OmegaXL-60ct---seconf sample product
              </div>
              <div className="prod-desc">
                Includes Savings with Convenient Monthly Auto-Ship Program
              </div>
              <div className="item-list">
                <div className="item-info">
                  <h4 className="label">Auto Ship:</h4>
                  <h4 className="value">1 Month</h4>
                </div>
                <div className="item-info">
                  <h4 className="label">Qty:</h4>
                  <h4 className="value">1</h4>
                </div>
                <div className="item-info">
                  <h4 className="label">Price</h4>
                  <h4 className="value mb-value">39.95</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  LocalStorageService.removeItem("sameAsShipping");
  LocalStorageService.removeItem("billingAddress");

  const [numberOfOrders, setNumberOfOrders] = useState(
    LocalStorageService.getItem("numberOfOrders")
  );
  LocalStorageService.removeItem("numberOfOrders");

  return (
    <Styled id="order-confirmation-cnr" css={css}>
      {orderId && (
        <div className="order-confirmation-cnr container-fixed">
          <section className="thank-you">
            <img
              src="/file/general/succes.svg"
              alt="Thank you"
              className="image-align"
            />
            {numberOfOrders <= 0 ? (
              <div className="new-account">
                <img
                  src="/file/general/new-account-img.svg"
                  alt="New Account"
                />
                <div>
                  New Account has been created
                  <p>
                    Credentials are sent to &nbsp;
                    <a href="#">{currentProfile.email}</a>
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="confirmation-email">
              Thank You For Your Purchase
              <p>A confirmation email has been sent to you!</p>
            </div>
          </section>
          <section className="order-detail">
            <div className="order-title">Order Details</div>
            <div className="order-detail-cnr">
              <div className="order-detail-left">
                <div className="order-main">
                  <div className="order-id gh-col-2-cnr">
                    <div className="form-field-info gh-col">
                      <div className="form-label"> Order ID</div>
                      <div className="order-info form-value">{orderId}</div>
                    </div>
                    <div className="form-field-info gh-col">
                      <div className="form-label">Order Date</div>
                      <dv className="order-info form-value">
                        {today.toLocaleString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </dv>
                    </div>
                  </div>

                  <div className="order-id gh-col-2-cnr">
                    <div className="mb-order gh-col">
                      <div className="form-label"> Shipping Address </div>
                      <div className="form-value">
                        <div className="custom-name">
                          {firstName !== null ? (
                            <span>{`${firstName} `}</span>
                          ) : (
                            " "
                          )}
                          {lastName !== null ? <span>{lastName}</span> : " "}{" "}
                        </div>
                        {address1 !== null ? <span>{address1}</span> : " "}
                        {address2 !== null ? <span>{address2}</span> : " "}
                        {city !== null ? <span>{city}</span> : " "}
                        {state !== null ? <span>{state}</span> : " "}
                        {country !== null ? <span>{country}</span> : " "}
                        {postalCode !== null ? <span>{postalCode}</span> : " "}
                      </div>
                    </div>
                    <div className="visa gh-col">
                      Payment
                      <p>
                        {paymentMethod &&
                        paymentMethod === "onlinePaymentGroup" ? (
                          <>
                            <img
                              src="/file/general/paypal-bw.svg"
                              alt="paypal"
                            />
                          </>
                        ) : (
                          <>
                            <img src="/file/general/paypal-bw.svg" alt="card" />
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="order-id gh-col-2-cnr">
                    <div className="desktop-order gh-col">
                      <div className="form-label"> Shipping Address </div>
                      <div className="form-value">
                        <div className="custom-name">
                          {firstName !== null ? (
                            <span>{`${firstName} `}</span>
                          ) : (
                            " "
                          )}
                          {lastName !== null ? <span>{lastName}</span> : " "}{" "}
                        </div>
                        {address1 !== null ? <span>{address1}</span> : " "}
                        {address2 !== null ? <span>{address2}</span> : " "}
                        {city !== null ? <span>{city}</span> : " "}
                        {state !== null ? <span>{state}</span> : " "}
                        {country !== null ? <span>{country}</span> : " "}
                        {postalCode !== null ? <span>{postalCode}</span> : " "}
                      </div>
                    </div>
                    <div className="gh-col">
                      <div className="form-label">Billing Address </div>
                      {billingAddress.country != null ? (
                        <div className="form-value">
                          {billingAddress.firstName !== null ? (
                            <span>{`${billingAddress.firstName} `}</span>
                          ) : (
                            " "
                          )}
                          {billingAddress.lastName !== null ? (
                            <span>{billingAddress.lastName}</span>
                          ) : (
                            " "
                          )}{" "}
                          <br></br>
                          {billingAddress.address1 !== null ? (
                            <span>{billingAddress.address1}</span>
                          ) : (
                            " "
                          )}
                          {billingAddress.address2 !== null ? (
                            <span>{billingAddress.address2}</span>
                          ) : (
                            " "
                          )}
                          {billingAddress.city !== null ? (
                            <span>{billingAddress.city}</span>
                          ) : (
                            " "
                          )}
                          {billingAddress.state !== null ? (
                            <span>{billingAddress.state}</span>
                          ) : (
                            " "
                          )}
                          {billingAddress.country !== null ? (
                            <span>{billingAddress.country}</span>
                          ) : (
                            " "
                          )}
                          {billingAddress.postalCode !== null ? (
                            <span>{billingAddress.postalCode}</span>
                          ) : (
                            " "
                          )}
                        </div>
                      ) : (
                        <div className="form-value">
                          <div className="custom-name">
                            {firstName !== null ? (
                              <span>{`${firstName} `}</span>
                            ) : (
                              " "
                            )}
                            {lastName !== null ? <span>{lastName}</span> : " "}{" "}
                          </div>
                          {address1 !== null ? <span>{address1}</span> : " "}
                          {address2 !== null ? <span>{address2}</span> : " "}
                          {city !== null ? <span>{city}</span> : " "}
                          {state !== null ? <span>{state}</span> : " "}
                          {country !== null ? <span>{country}</span> : " "}
                          {postalCode !== null ? (
                            <span>{postalCode}</span>
                          ) : (
                            " "
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-detail-right">
                {priceInfo ? (
                  <>
                    <div className="cost">
                      <div className="cost-list">
                        <h4 className="h4">Subtotal</h4>
                        <h3 className="h3">
                          {formatCurrency(priceInfo.subTotal)}
                        </h3>
                      </div>
                      <div className="cost-list">
                        <h4 className="h4">Shipping + Handling</h4>
                        <h3 className="h3">${priceInfo.shipping}</h3>
                      </div>
                      <div className="cost-list">
                        <h4 className="h4-discount">Discount</h4>
                        <h5 className="h5">
                          -{totalDiscountInfo ? `$${totalDiscountInfo}` : "-"}
                        </h5>
                      </div>

                      <div className="cost-list">
                        <h4 className="h4">
                          Estimated Tax
                          <i className="fa-thin fa-circle-info"></i>
                        </h4>
                        <h3 className="h3">${priceInfo.tax}</h3>
                      </div>

                    </div>
                    <div className="cost cost-border">
                      <div className="cost-list">
                        <h4 className="h4 total">Total</h4>
                        <h3 className="h3">${priceInfo.total}</h3>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </section>
          <section className="products-cnr">
            {/* product details */}

            <div className="product-list">
              {Object.values(commerceItems).map((ciItem) => {
                console.log("ciItem-->", ciItem);
                const itemImg = ciItem.primaryThumbImageURL;
                const itemQuantity = ciItem.quantity;
                const itemSalePrice = ciItem.salePrice
                  ? ciItem.salePrice
                  : ciItem.listPrice;
                const itemPrice = itemSalePrice * itemQuantity;
                const itemProductId = ciItem.productId;
                const itemDisplayName = ciItem.displayName;
                const itemCouponCode =
                  ciItem?.discountInfo?.length > 0 &&
                  ciItem?.discountInfo[0].coupon;
                let ghwSubscription;
                ciItem.dynamicProperties.forEach((obj) => {
                  if (obj.id === "ghwSubscription") {
                    ghwSubscription = obj.value;
                  }
                });
                let count;
                ciItem.variant.forEach((obj) => {
                  if (obj.optionName === "Count") {
                    count = obj.optionValue;
                  }
                });

                return renderCommerceItems(
                  itemImg,
                  itemProductId,
                  itemDisplayName,
                  itemQuantity,
                  ghwSubscription,
                  itemPrice,
                  count
                );
              })}
            </div>

            {bundlePlaceholder()}
          </section>

          <div className="continue-shopping action-btn-cnr">
            <a href="/home" className="btn primary-btn">
              Continue Shopping
            </a>
            <a onClick={print} className="btn secondary-btn">
              Print Page
            </a>
          </div>
        </div>
      )}
    </Styled>
  );
};

export default GHWCheckoutOrderConfirmation;
