/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import Modal from '@oracle-cx-commerce/react-components/modal';
import {noop} from '@oracle-cx-commerce/utils/generic';
import PropTypes from 'prop-types';
import CheckoutAccountAddressBook from '../account-address-book';
import CheckoutAddressBook from '../address-book';
import CheckoutAddressBookDropDown from '../address-book-dowpdown';
import css from './styles.css';

/**
 * Component to display address book modal
 * It displays the address book, User can select an address as shipping-address or billing address
 * @param {Object} props The properties object
 * @memberof Components
 * @class GHWAddressBookModal
 * @category Component-list
 * @param {String} actionCancel - Locale for cancel action
 * @param {String} closeLinkAltText - Locale close
 * @param {String} labelAddressBook - Locale address book
 * @param {String} textAccountAddressBook - Text specifying account address book
 * @param {Boolean} show - Boolean flag indicating the open or close status of the modal
 * @param {Function} handleCloseAction - Callback function to handle modal close
 * @param {Boolean} isB2BUser - Boolean indicating if the user is a B2B user.
 * @param {Function} onAddressUpdated - Callback function to handle save or update address
 * @param {Object} currentProfile - This is the object to get the current prof
 * @param {String} cssOverride - Class name to override css
 * @author Oracle
 * @since 2.10.0
 */
const GHWAddressBookModal = props => {
  // resources
  const {actionCancel, closeLinkAltText, labelAddressBook, textAccountAddressBook, showAddressForm} = props;

  const {handleCloseAction, isB2BUser, onAddressUpdated = noop, currentProfile} = props;

  /**
   * Handler when Use-This-Address button clicked
   * @param {*} address
   */
  const handleSelectAddress = useCallback(
    selectedAddress => {
      /* for b2b user, firstName, lastName is not available for account-address, take it from current-profile */
      const address = {
        ...selectedAddress,
        firstName: selectedAddress.firstName || currentProfile.firstName,
        lastName: selectedAddress.lastName || currentProfile.lastName
      };

      // The selected address need to be passed back to the parent component.
      // isEditAddress: true will display a proper notification message on address selection
      onAddressUpdated({address, handleCloseAction, isEditAddress: true});
    },
    [currentProfile.firstName, currentProfile.lastName, handleCloseAction, onAddressUpdated]
  );

  console.log('ghw address book modal-->', props);

  return (
    <Styled id="GHWAddressBookModal" css={css}>
      <div className="AddressBookModal__Body">
        {isB2BUser ? (
          <CheckoutAccountAddressBook {...props} handleSelectAddress={handleSelectAddress}></CheckoutAccountAddressBook>
        ) : (
          <CheckoutAddressBookDropDown
            {...props}
            showAddressForm={showAddressForm}
            handleSelectAddress={handleSelectAddress}
          />
        )}
      </div>
    </Styled>
  );
};

GHWAddressBookModal.propTypes = {
  /**
   * Open or close status of the modal.
   */
  show: PropTypes.bool.isRequired,

  /** Callback function to handle modal close  */
  handleCloseAction: PropTypes.func.isRequired,

  /**
   * Type of the shopper.
   */
  isB2BUser: PropTypes.bool.isRequired,

  /** Callback function to handle save or update address */
  onAddressUpdated: PropTypes.func.isRequired,
  /**
   * This is the object to get the current profile
   */
  currentProfile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string
  }).isRequired,

  /** Class name to override css  */
  cssOverride: PropTypes.string
};

GHWAddressBookModal.defaultProps = {
  cssOverride: ''
};

export default GHWAddressBookModal;
