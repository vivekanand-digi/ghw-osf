/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

export * from '@oracle-cx-commerce/react-widgets';
export const GHWSyndicateKnowledgeWidget = () => import('./ghw-syndicate-knowledge-widget');
export const GHWAbout = () => import('./ghw-about');
// PDP start
export const GHWProductDetailsContainer = () => import('./product/ghw-product-details-container');
export const GHWProductAddToCartButton = () => import('./product/ghw-product-add-to-cart-button');
export const GHWProductImageViewer = () => import('./product/ghw-product-image-viewer');
export const GHWProductLongDescription = () => import('./product/ghw-product-long-description');
export const GHWProductName = () => import('./product/ghw-product-name');
export const GHWProductPrice = () => import('./product/ghw-product-price');
export const GHWProductQuantity = () => import('./product/ghw-product-quantity');
export const GHWProductOneTimePurchase = () => import('./product/ghw-product-one-time-purchase');
export const GHWProductTabContainer = () => import('./product/ghw-product-tab-container');
// PDP end
// cart start
export const GHWMiniCartDesktop = () => import('./ghw-mini-cart-desktop');
export const GHWMiniCartDetails = () => import('./ghw-mini-cart-details');
// cart end
//PLP start
export const GHWProductLandingBanner = () => import('./product-landing/ghw-product-landing-banner');
export const GHWProductLandingContent = () => import('./product-landing/ghw-product-landing-content');
export const GHWProductLandingHowtouse = () => import('./product-landing/ghw-product-landing-howtouse');
export const GHWProductLandingSupplement = () => import('./product-landing/ghw-product-landing-supplement');
export const GHWProductLandingDetail = () => import('./product-landing/ghw-product-landing-detail');
//PLP end
//BrandAmb start
export const GHWBrandAmbassador = () => import('./ghw-brand-ambassador');
export const GHWBrandAmbassador2 = () => import('./ghw-brand-ambassador2/component');
export const GHWHomeMoneyback = () => import('./ghw-home-moneyback');
//BrandAmb start
export const GHWProductTest = () => import('./ghw-product-test');
export const GHWProductTypeSelection = () => import('./ghw-product-type-selection');
export const GHWProductVariantOptions = () => import('./ghw-product-variant-options');
//Footer start
export const GHWFooter = () => import('./ghw-footer');
export const GHWBanner2 = () => import('./ghw-banner2');
export const GHWReviews = () => import('./ghw-reviews');
export const GHWBanner = () => import('./ghw-banner');
export const GHWNavLogin = () => import('./ghw-nav-login');
export const GHWBuyCombos = () => import('./ghw-buy-combos');
export const GHWReviewMoneyback = () => import('./ghw-review-moneyback');
export const GHWHomepageVideo = () => import('./ghw-homepage-video');
export const GHWStandardReturnPolicy = () => import('./ghw-standard-return-policy');
export const GHWTermsAndConditions = () => import('./ghw-terms-and-conditions');
export const GHWPrivacyPolicy = () => import('./ghw-privacy-policy');
export const GHWOurGuarantee = () => import('./ghw-our-guarantee');
export const GHWCopyright = () => import('./ghw-copyright');
export const GHWReturnPolicy = () => import('./ghw-return-policy');
export const GHWCaliforniaPrivacyChoices = () => import('./ghw-california-privacy-choices');
export const GHWBenefits = () => import('./ghw-benefits');
export const GHWOmegaxlDifference = () => import('./ghw-omegaxl-difference');
//Footer start
export const GHWContactUs = () => import('./ghw-contact-us');
export const GHWOurProduct = () => import('./ghw-our-product');
export const GHWVideoWithCard = () => import('./ghw-video-with-card');
export const GHWFeaturedProducts = () => import('./ghw-featured-products');
export const GHWImageGrid = () => import('./ghw-image-grid');
export const GHWProductGrid = () => import('./ghw-product-grid');
export const GHWCartOrderSummary = () => import('./ghw-cart-order-summary');
export const GHWCheckoutSingleShippingDetails = () => import('./ghw-checkout-single-shipping-details');
export const GHWPromotionCodeEntry = () => import('./ghw-promotion-code-entry');
//Header start
export const GHWHeader = () => import('./ghw-header');
export const GHWLogin = () => import('./ghw-login/component');
export const GHWProfileUpdateExpiredPassword = () => import('./ghw-profile-update-expired-password');
export const GHWNavigationBreadcrumbs = () => import('./ghw-navigation-breadcrumbs');


export const GHWUserProfile = () => import('./ghw-user-profile');
export const GHWCheckoutContinueToPaymentButton = () => import('./ghw-checkout-continue-to-payment-button/component');
//Header start
export const GHWPaypalButton = () => import('./ghw-paypal-button');
export const GHWBraintreeWidget = () => import('./ghw-braintree-widget');

//checkout braintree start
export const CreditCardHostedFields = () => import('./checkout/credit-card-hosted-fields');
export const PayPalPaymentButton = () => import('./checkout/paypal-payment-button');
export const ProductPayPalPaymentButton = () => import('./checkout/product-paypal-payment-button');
export const PaymentMethodsContainer = () => import('./checkout/payment-methods-container');
export const GooglePayButton = () => import('./checkout/google-pay-button');
export const ContinueToReviewOrderButton = () => import('./checkout/continue-to-review-order-button');
export const VenmoPayButton = () => import('./checkout/venmo-pay-button');
export const ApplePayButton = () => import('./checkout/apple-pay-button');
export const SecureRemoteCommerceButton = () => import('./checkout/secure-remote-commerce-button');
export const LocalPaymentButton = () => import('./checkout/local-payment-button');
// export {MiniCartPayPalDesktop, MiniCartPayPalMobile} from './checkout/mini-cart-paypal';
export const ProfileAddACHBankAccount = () => import('./checkout/profile-add-ach-bank-account');
export const ACHDirectDebit = () => import('./checkout/ach-direct-debit');
export const ProfileSavedPayments = () => import('./checkout/profile-saved-payments');
export const ProfileDeleteSavedPayments = () => import('./checkout/profile-delete-saved-payments');
export const ProfileSavedPaymentSummary = () => import('./checkout/profile-saved-payment-summary');
export const SelectedPaymentInfo = () => import('./checkout/selected-payment-info');
//checkout braintree end
export const GHWCheckoutProgressTracker = () => import('./ghw-checkout-progress-tracker/component');
export const GHWCheckoutCartDetails = () => import('./ghw-checkout-cart-details');
export const GHWCheckoutOrderConfirmationContainer = () => import('./ghw-checkout-order-confirmation-container');
export const GHWCheckoutOrderConfirmation = () => import('./ghw-checkout-order-confirmation');
//profile start
export const GHWProfileAddressForm = () => import('./profile/ghw-profile-address-form');
export const GHWMyAccount = () => import('./profile/ghw-my-account');
export const GHWProfileSavedCards = () => import('./profile/ghw-profile-saved-cards');
export const GHWOrdersDetailsInvoice = () => import('./profile/ghw-orders-details-invoice');
// export const GHWOrdersDetails = () => import('./profile/ghw-orders-details');
//profile end
export const GHWPromotionsDisplay = () => import('./ghw-promotions-display');
export const GHWCheckoutLogin = () => import('./ghw-checkout-login');
export const GHWCheckoutLoginRegistrationContainer = () => import('./ghw-checkout-login-registration-container');

//carousel
export const GHWOurProductsCarousel = () => import('./ghw-our-products-carousel/component');
export const GHWShopAll = () => import('./ghw-shop-all/component');
export const GHWHomeBanner = () => import('./ghw-home-banner/component');
export const GHWProfileResetPassword = () => import('./ghw-profile-reset-password/component');


export const GHWCheckoutCreditCard = () => import('./ghw-checkout-credit-card');
export const GHWPdpBanner = () => import('./ghw-pdp-banner');
export const GHWYouMayLike = () => import('./ghw-you-may-like');
export const GHWBillingShippingWidget = () => import('./ghw-billing-shipping-widget');

export const Softclouds = () => import('./softclouds');

export const GHWProductBreadcrumbs = () => import('./ghw-product-breadcrumbs');

//celebrity banners
export const GHWBannerAnaMariaPolo = () => import('./ghw-banner-ana-maria-polo');
export const GHWBannerBobCircosta = () => import('./ghw-banner-bob-circosta');
export const GHWBannerCelebrityHealthSecrets = () => import('./ghw-banner-celebrity-health-secrets');
export const GHWBannerHelenRodriguez = () => import('./ghw-banner-helen-rodriguez');
export const GHWBannerJavierRomero = () => import('./ghw-banner-javier-romero');
export const GHWBannerJohnWalsh = () => import('./ghw-banner-john-walsh');
export const GHWBannerPiolin = () => import('./ghw-banner-piolin');export const GHWCheckoutPaymentsContainer = () => import('./ghw-checkout-payments-container');
