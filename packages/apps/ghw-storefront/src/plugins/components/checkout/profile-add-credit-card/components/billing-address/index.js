/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {getAddressManagerRoles} from '@oracle-cx-commerce/react-components/utils/address';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import css from './styles.css';
import {getPageData} from '../../../selectors';
import {noop, isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import {useBillingCountriesFetcher} from '@oracle-cx-commerce/fetchers/payments/hooks';
import AddressInformation from '@oracle-cx-commerce/react-widgets/checkout/checkout-single-shipping-details/components/address-information';
import AddNewAddress from '@oracle-cx-commerce/react-widgets/checkout/checkout-single-shipping-details/components/add-new-address';
import {AddressProviderContext} from '../../providers/addressProvider';

/**
 * UI component to provide billing address details
 * User can provide billing address details of the card which is about to be added
 * @param {Object} props the property object
 */

const BillingAddress = props => {
  const {
    billingCountries,
    currentProfile,
    defaultAddress,
    defaultBillingCountryCode,
    isB2BUser,
    id,
    roles,
    updateCardPayload = noop,
    ...remProps
  } = props;

  const store = useContext(StoreContext);
  const {billingAddress, setBillingAddress} = useContext(AddressProviderContext);
  const {action} = store;
  const addressManagerRoles = useMemo(() => getAddressManagerRoles(roles), [roles]);

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

  // const [billingAddress, setBillingAddress] = useState({});

  /**
   * Updates the passed in billing address to the local billing address state
   * @param {Object} The billing address to be set.
   */
  const updateBillingAddress = useCallback(
    address => {
      const {country} = address;
      const billingAddress = {
        /* for b2b user, firstName, lastName is not available for account-address, take it from current-profile */
        firstName: address.firstName ? address.firstName : currentProfile.firstName,
        lastName: address.firstName ? address.lastName : currentProfile.lastName,
        country,
        postalCode: address.postalCode,
        state: address.state,
        address1: address.address1,
        city: address.city,
        phoneNumber: address.phoneNumber ? address.phoneNumber : '',
        ...(isB2BUser && address.companyName && {companyName: address.companyName}),
        ...(isB2BUser && address.addressType && {addressType: address.addressType})
      };
      setBillingAddress(billingAddress);
    },
    [currentProfile, isB2BUser]
  );

  const shouldDisplayAddNewAddressLink = () => {
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

  // if there is default address set the billing address to default address
  useEffect(() => {
    if (defaultAddress.country) {
      // Checking for country, so as to not add object dependency to defaultAddress in the effect
      // The default address will always have country property set.
      updateBillingAddress({
        firstName: defaultAddress.firstName,
        lastName: defaultAddress.lastName,
        country: defaultAddress.country,
        postalCode: defaultAddress.postalCode,
        state: defaultAddress.state,
        address1: defaultAddress.address1,
        city: defaultAddress.city,
        phoneNumber: defaultAddress.phoneNumber,
        addressType: defaultAddress.addressType || defaultAddress.alias,
        companyName: defaultAddress.companyName
      });
    }
  }, [
    updateBillingAddress,
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
    defaultAddress.alias
  ]);

  // Calls onInput callback to update the billing address in the parent component
  useEffect(() => {
    updateCardPayload({billingAddress});
  }, [billingAddress, updateCardPayload]);

  return (
    <Styled id="BillingAddress" css={css}>
      <div className="BillingAddress">
        <AddressInformation
          address={billingAddress}
          headingAddress={remProps.headingBillingAddress}
          headingEditAddress={remProps.headingEditBillingAddress}
          textOpenAddressBookAndChooseAddress={remProps.textOpenAddressBookAndChooseBillingAddress}
          countries={billingCountries}
          onAddressUpdated={onAddressUpdated}
          {...props}
        />

        {(shouldDisplayAddNewAddressLink() || isEmptyObject(billingAddress)) && (
          <AddNewAddress
            {...props}
            headingAddAddress={remProps.headingAddBillingAddress}
            countries={billingCountries}
            defaultCountry={defaultBillingCountryCode}
            onAddressUpdated={onAddressUpdated}
          />
        )}
      </div>
    </Styled>
  );
};

export default connect(getPageData)(BillingAddress);
