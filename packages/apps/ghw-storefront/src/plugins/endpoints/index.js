/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

export * from '@oracle-cx-commerce/endpoints';
export * from '@oracle-cx-commerce/oce-endpoints';
//  payment start
export const initiateOrder = () => import('./initiateOrder');
export const retrieveShopperProfile = () => import('./retrieveShopperProfile');
export const initializeBraintreeWidget = () => import('./initializeBraintreeWidget');
export const setDefaultSavedPayment = () => import('./setDefaultSavedPayment');
export const addSavedPayment = () => import('./addSavedPayment');
export const deleteSavedPayment = () => import('./deleteSavedPayment');
// payment end
export const initializeBraintree = () => import('./initializeBraintree');
export const contactus = () => import('./contactus');
export const getSubscriptions = () => import('./getSubscriptions');
export const getSubscriptionDetails = () => import('./getSubscriptionDetails');

export const getOrderShipments = () => import('./getOrderShipments');
export const getOrdersDetails = () => import('./getOrdersDetails');
export const accountVerification = () => import('./accountVerification');
export const signifydCheckout = () => import('./signifydCheckout');
export const numberOfOrders = () => import('./numberOfOrders');
export const uspsValidation = () => import('./uspsValidation');
