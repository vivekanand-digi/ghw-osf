/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {HomeDeliveryAddressInformation} from '@oracle-cx-commerce/react-widgets/profile/shipping-information/components/homedelivery-address-information';
import React, {useState, useCallback} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {isAddressValid} from '@oracle-cx-commerce/react-components/utils/address';
import PropTypes from 'prop-types';
import css from './styles.css';
import AddressFormModal from '../address-form-modal';
import AddressBookModal from '../address-book-modal';

/**
 * Component to display the shipping group address and billing address
 * It provides options to edit the shipping/billing address and to select an address from the address book
 * @param {Object} props The properties object
 * @memberof Components
 * @class AddressInformation
 * @category Component-list
 * @param {String} headingAddress - Heading for address
 * @param {String} labelEditAddress - Label specifying edit address
 * @param {String} labelOpenAddressBook - Label specifying open address book
 * @param {String} textOpenAddressBookAndChooseAddress - Locale for cancel label
 * @param {Boolean} isB2BUser - Boolean indicating if the user is a B2B user.
 * @param {Boolean} isUserLoggedIn - Boolean flag to indicate if the user is logged in
 * @param {Object} address - Address object
 * @author Oracle
 */
const AddressInformation = props => {
  //resources
  const {headingAddress, labelEditAddress, labelOpenAddressBook, textOpenAddressBookAndChooseAddress} = props;

  const {isB2BUser, isUserLoggedIn, address = {}, showAddressForm} = props;

  const [showAddressBookModal, setShowAddressBookModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  /**
   * Click handler for the 'Open Address Book' button
   */
  const openAddressBookModal = () => {
    setShowAddressBookModal(true);
  };

  /**
   * Function to handle the address book modal close
   */
  const handleCloseAddressBookModal = useCallback(() => {
    setShowAddressBookModal(false);
  }, []);

  /**
   * Click handler for the 'Edit Address' button
   */
  const openAddressFormModal = () => {
    setShowAddressModal(true);
  };

  /**
   * Function to handle the edit address modal close
   */
  const handleCloseAddressFormModal = useCallback(() => {
    setShowAddressModal(false);
  }, []);

  return (
    <Styled id="AddressInformation" css={css}>
      <div className="AddressInformation">
        <div className="AddressInformation__Container">
          {isUserLoggedIn && (
            <AddressBookModal
              {...props}
              show={showAddressBookModal}
              handleCloseAction={handleCloseAddressBookModal}
              showAddressForm={showAddressForm}
            ></AddressBookModal>
          )}
          {/* Address */}
          {isAddressValid(address, isB2BUser) && (
            <HomeDeliveryAddressInformation address={address} headingAddress={headingAddress} />
          )}

          {/* Show message when Address not displaying */}
          {/* {isUserLoggedIn && !isAddressValid(address, isB2BUser) && (
            <div className="AddressInformation__NoAddressAvailable">{textOpenAddressBookAndChooseAddress}</div>
          )} */}
        </div>
      </div>
    </Styled>
  );
};

AddressInformation.propTypes = {
  /**
   * Type of the shopper.
   */
  isB2BUser: PropTypes.bool.isRequired,

  /**
   * Logged in status of the user.
   */
  isUserLoggedIn: PropTypes.bool.isRequired,

  /**
   * This is the address object for rendering the view
   */
  address: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    address1: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
    country: PropTypes.string,
    phoneNumber: PropTypes.string
  }),

  /**
   * Flag to know if this component is rendered for multi-shipping-widget
   */
  isMultiShipping: PropTypes.bool
};

AddressInformation.defaultProps = {
  address: {},
  isMultiShipping: undefined
};

export default AddressInformation;
