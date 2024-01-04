/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

export * from '@oracle-cx-commerce/actions';
export const getShopperProfile= () => import('./get-shopper-profile');
export const updateSavedPaymentDefault= () => import('./update-saved-payment-default');
export const addSavedPaymentAction = () => import ('./add-saved-payment-action');
export const deleteSavedPaymentAction = () =>import('./delete-saved-payment-action');
export const contactus = () => import('./contactus');
export const accountVerification = () => import('./account-verification');
export const signifydCheckout = () => import('./signifyd-checkout');
export const numberOfOrders = () => import('./number-of-orders');
export const uspsValidation = () => import('./usps-validation');
