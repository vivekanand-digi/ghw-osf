/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {useCallback, useState, useEffect, useMemo, useContext} from 'react';
import {getAddressManagerRoles} from '@oracle-cx-commerce/react-components/utils/address';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {isEmptyObject, noop} from '@oracle-cx-commerce/utils/generic';
import {useBillingCountriesFetcher} from '@oracle-cx-commerce/fetchers/payments/hooks';
import AddressInformation from '@oracle-cx-commerce/react-widgets/checkout/checkout-single-shipping-details/components/address-information';
import AddNewAddress from '@oracle-cx-commerce/react-widgets/checkout/checkout-single-shipping-details/components/add-new-address';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import css from './styles.css';
import {getBillingAddressData} from './selectors';
import LocalStorageService from '../../../utils/localStorageService ';
import orderRepoReader from '../../../checkout/helpers/order-repo-reader';

/**
 * Widget for billing address.
 * Provides option for entering billing address.
 */
const CheckoutBillingAddress = props => {
  const {
    appliedPaymentGroupBillingAddress = {},
    billingCountries,
    defaultBillingCountry,
    headingAddBillingAddress,
    headingBillingAddress,
    headingEditBillingAddress,
    textEnterABillingAddress,
    textOpenAddressBookAndChooseBillingAddress,
    onInput = noop,
    roles,
    defaultAddress,
    isB2BUser,
    isUserLoggedIn = false,
    currentProfile,
    useAnotherCard = true
  } = props;

  const [billingAddress, setBillingAddress] = useState({});

  const store = useContext(StoreContext);
  const {action} = store;
  const addressManagerRoles = useMemo(() => getAddressManagerRoles(roles), [roles]);
  const shippingAddress = orderRepoReader.getShippingAddress(store.getState()) || {};

  // Fetches the billing counties
  useBillingCountriesFetcher(store);

  /**
   * Triggers the action to get the default organization addresses(default billing address)
   */
  useEffect(() => {
    if (isB2BUser) {
      action('getOrganizationDefaultAddresses');
    }
  }, [isB2BUser, action]);

  /**
   * Updates the passed in billing address to the local billing address state
   * Updates regionList according to the passed in country and sets the selected region.
   * @param {Object} The billing address to be set.
   */
  const updateBillingAddress = useCallback(
    address => {
      const billingAddress = {
        /* for b2b user, firstName, lastName is not available for account-address, take it from current-profile */
        firstName: address.firstName ? address.firstName : currentProfile.firstName,
        lastName: address.firstName ? address.lastName : currentProfile.lastName,
        country: address.country,
        postalCode: address.postalCode,
        state: address.state,
        address1: address.address1,
        city: address.city,
        phoneNumber: address.phoneNumber ? address.phoneNumber : '',
        ...(address.companyName && {companyName: address.companyName}),
        ...(address.addressType && {addressType: address.addressType})
      };
      setBillingAddress(billingAddress);
    },
    [currentProfile.firstName, currentProfile.lastName]
  );

  // Calls onInput callback to update the billing address in the parent component
  useEffect(() => {
    if (useAnotherCard) {
      onInput({billingAddress});
    }
  }, [useAnotherCard, billingAddress, onInput]);
  const [addr, setAddr] = useState({});

  // If there is an appliedPaymentGroup with billingAddress set the billing address state with its value.
  // else if there is default address set the billing address to default address
  useEffect(() => {
    // Checking for country, so as to not add object dependency to appliedBillingAddress in the effect
    // The applied payment group billing address will always have country property set.
    const billigAddr = LocalStorageService.getItem('billingAddress');
    const sameShipBill = LocalStorageService.getItem('sameAsShipping');
    let flag = false;
    if (billigAddr !== null && !sameShipBill) {
      flag = true;
    }
    if (appliedPaymentGroupBillingAddress.country) {
      if (!isEmptyObject(billigAddr) && flag) {
        const {firstName, lastName, country, postalCode, state, address1, city, phoneNumber, companyName} = billigAddr;
        updateBillingAddress({
          firstName,
          lastName,
          country,
          postalCode,
          state,
          address1,
          city,
          phoneNumber,
          companyName
        });
      } else {
        updateBillingAddress({
          firstName: appliedPaymentGroupBillingAddress.firstName,
          lastName: appliedPaymentGroupBillingAddress.lastName,
          country: appliedPaymentGroupBillingAddress.country,
          postalCode: appliedPaymentGroupBillingAddress.postalCode,
          state: appliedPaymentGroupBillingAddress.state,
          address1: appliedPaymentGroupBillingAddress.address1,
          city: appliedPaymentGroupBillingAddress.city,
          phoneNumber: appliedPaymentGroupBillingAddress.phoneNumber,
          companyName: appliedPaymentGroupBillingAddress.companyName
        });
      }
    } else if (defaultAddress.country) {
      // Checking for country, so as to not add object dependency to defaultAddress in the effect
      // The default address will always have country property set.
      if (!isEmptyObject(billigAddr) && flag) {
        const {firstName, lastName, country, postalCode, state, address1, city, phoneNumber, companyName} = billigAddr;
        updateBillingAddress({
          firstName,
          lastName,
          country,
          postalCode,
          state,
          address1,
          city,
          phoneNumber,
          companyName
        });
      } else {
        shippingAddress
        //  previously it was firstName: defaultAddress.firstName,
        updateBillingAddress({
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          country: shippingAddress.country,
          postalCode: shippingAddress.postalCode,
          state: shippingAddress.state,
          address1: shippingAddress.address1,
          city: shippingAddress.city,
          phoneNumber: shippingAddress.phoneNumber,
          addressType: shippingAddress.addressType || shippingAddress.alias,
          companyName: shippingAddress.companyName
        });
      }
    }
  }, [
    appliedPaymentGroupBillingAddress.address1,
    appliedPaymentGroupBillingAddress.city,
    appliedPaymentGroupBillingAddress.companyName,
    appliedPaymentGroupBillingAddress.country,
    appliedPaymentGroupBillingAddress.firstName,
    appliedPaymentGroupBillingAddress.lastName,
    appliedPaymentGroupBillingAddress.phoneNumber,
    appliedPaymentGroupBillingAddress.postalCode,
    appliedPaymentGroupBillingAddress.state,
    defaultAddress.addressType,
    defaultAddress.address1,
    defaultAddress.city,
    defaultAddress.companyName,
    defaultAddress.country,
    defaultAddress.firstName,
    defaultAddress.lastName,
    defaultAddress.phoneNumber,
    defaultAddress.postalCode,
    defaultAddress.state,
    defaultAddress.alias,
    updateBillingAddress,
    shippingAddress
  ]);

  const shouldDisplayAddNewAddressLink = () => {
    if (isUserLoggedIn) {
      if (isB2BUser) {
        if (
          addressManagerRoles.isProfileAddrManager ||
          addressManagerRoles.isAccountAddrManager ||
          addressManagerRoles.isAdmin
        ) {
          return true;
        }

        // Buyer Role
        return false;
      }

      // B2C user
      return true;
    }

    // Guest user
    return false;
  };

  /**
   * Function to handle address updated on address book modal or address form
   */
  const onAddressUpdated = useCallback(
    payload => {
      if (payload.address) {
        updateBillingAddress({...billingAddress, ...payload.address});
        if (payload.handleCloseAction) {
          payload.handleCloseAction();
        }
      }
    },
    [billingAddress, updateBillingAddress]
  );

  return (
    <Styled id="CheckoutBillingAddress" css={css}>
      <div className="CheckoutBillingAddress">
       {(isUserLoggedIn || (!isUserLoggedIn && !isEmptyObject(billingAddress))) && (
          <div className="HomeDeliveryAddressInformation__AddressSummary">
            {/* {billingAddress.firstName && (
              <div className="HomeDeliveryAddressInformation__AddressDetails">
                <span className="HomeDeliveryAddressInformation__FirstName">{billingAddress.firstName}</span>
                {billingAddress.lastName && (
                  <>
                    <span>&nbsp;</span>
                    <span className="HomeDeliveryAddressInformation__LastName">{billingAddress.lastName}</span>
                  </>
                )}
              </div>
            )}
            {billingAddress.address1 && (
              <div className="HomeDeliveryAddressInformation__AddressDetails">
                {billingAddress.address1 && <span>{`${billingAddress.address1},`}</span>}
              </div>
            )}
            {billingAddress.address2 && (
              <div className="HomeDeliveryAddressInformation__AddressDetails">
                {billingAddress.address1 && <span>{`${billingAddress.address2},`}</span>}
              </div>
            )}
            {billingAddress.state && (
              <div className="HomeDeliveryAddressInformation__AddressDetails">
                {billingAddress.city && <span>{billingAddress.city}</span>}
                {billingAddress.state && <span>{billingAddress.state}</span>}
                {billingAddress.postalCode && <span>{billingAddress.postalCode}</span>}
                {billingAddress.country && <span>{billingAddress.country}</span>}
              </div>
            )} */}
          </div>
        )}
      </div>
    </Styled>
  );
};

export default connect(getBillingAddressData)(CheckoutBillingAddress);
