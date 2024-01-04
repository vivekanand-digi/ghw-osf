/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback} from 'react';

import CheckoutAddressBookCard from '../address-book-card';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {getComponentData} from './selectors';
import css from './styles.css';
import PropTypes from 'prop-types';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * Component to list and manage profile addresses.
 * @param {Object} props The properties object
 * @memberof Components
 * @class CheckoutAddressBook
 * @category Component-list
 * @param {String} labelNoProfileAddressesAvailable - Label specifying to add a new address.
 * @param {Object} contactInfos - The contactInfos (address) object from redux state(ProfileRepository->contactInfos)
 * @param {String} shippingAddress - Shipping address
 * @param {Array} shippingAddressIds - List of shipping address ids
 * @param {String} handleSelectAddress - Callback function called when address is selected
 * @author Oracle
 * @since 2.10.0
 */
const CheckoutAddressBook = props => {
  //resources
  const {labelNoProfileAddressesAvailable} = props;
  const {contactInfos, shippingAddress, shippingAddressIds, handleSelectAddress} = props;
  const sortedShippingAddressIds = [];

  const selectThisAddress = useCallback(
    addressId => {
      handleSelectAddress(contactInfos[addressId]);
    },
    [contactInfos, handleSelectAddress]
  );

  /* returns options array sorted by lastName */
  const getSortedShippingAddressIds = (contactInfos, shippingAddressIds) => {
    if (shippingAddress) {
      sortedShippingAddressIds[0] = shippingAddress;
    }
    const addressIdsWithoutDefaultAddress = shippingAddressIds.filter(addressId => addressId !== shippingAddress);
    const sortedAddressIds = addressIdsWithoutDefaultAddress.sort((a, b) => {
      if (contactInfos[a] && contactInfos[a].lastName && contactInfos[b] && contactInfos[b].lastName) {
        if (contactInfos[a].lastName.toLowerCase() > contactInfos[b].lastName.toLowerCase()) {
          return 1;
        }
        if (contactInfos[a].lastName.toLowerCase() < contactInfos[b].lastName.toLowerCase()) {
          return -1;
        }
      }
      if (
        contactInfos[a] &&
        contactInfos[a].address1 &&
        contactInfos[b] &&
        contactInfos[b].address1 &&
        contactInfos[a].address1.toLowerCase() > contactInfos[b].address1.toLowerCase()
      ) {
        return 1;
      }

      return -1;
    });

    return sortedShippingAddressIds.concat(sortedAddressIds);
  };

  return (
    <Styled id="CheckoutAddressBook" css={css}>
      <div className="CheckoutAddressBook">
        <div className="CheckoutAddressBook__AddressesList">
          {contactInfos && shippingAddressIds && shippingAddressIds.length > 0 ? (
            <div className="CheckoutAddressBook__List">
              {(getSortedShippingAddressIds(contactInfos, shippingAddressIds) || []).map(itemId => (
                <React.Fragment key={`${itemId}`}>
                  <CheckoutAddressBookCard {...props} itemId={itemId} selectThisAddress={selectThisAddress} />
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="CheckoutAddressBook__NoAddressLabel">
              <span>{labelNoProfileAddressesAvailable}</span>
            </div>
          )}
        </div>
      </div>
    </Styled>
  );
};

CheckoutAddressBook.propTypes = {
  // eslint-disable-next-line spellcheck/spell-checker
  /**
   * The contactInfos (address) object from redux state(ProfileRepository->contactInfos)
   */
  contactInfos: PropTypes.objectOf(
    PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      address1: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      postalCode: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string
    })
  ),

  /**
   * This is the default shipping address id
   */
  shippingAddress: PropTypes.string.isRequired,

  /** Address Ids */
  shippingAddressIds: PropTypes.arrayOf(PropTypes.string),

  /** Callback function to handle selection of address */
  handleSelectAddress: PropTypes.func.isRequired
};

CheckoutAddressBook.defaultProps = {
  contactInfos: {},
  shippingAddressIds: []
};

export default connect(getComponentData)(CheckoutAddressBook);
