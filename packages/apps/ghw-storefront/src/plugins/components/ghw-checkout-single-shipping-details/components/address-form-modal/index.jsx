/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import Modal from '@oracle-cx-commerce/react-components/modal';
import AddressForm from '../address-form';
import css from './styles.css';
import PropTypes from 'prop-types';

/**
 * Component to display shipping address/billing address form modal
 * It displays the address form to add or edit a shipping/billing address
 * @param {Object} props The properties object
 * @memberof Components
 * @class AddressFormModal
 * @category Component-list
 * @param {String} headingAddAddress - Locale for add address heading
 * @param {String} headingEditAddress - Locale for edit address heading
 * @param {String} closeLinkAltText - Locale close
 * @param {String} cssOverride - Class name to override css
 * @param {Boolean} isUserLoggedIn - Boolean flag to indicate if the user is logged in
 * @param {Boolean} isB2BUser - Boolean indicating if the user is a B2B user.
 * @param {Function} handleCloseAction - Callback function to handle modal close
 * @author Oracle
 */
const AddressFormModal = props => {
  //resources
  const {headingAddAddress, headingEditAddress, closeLinkAltText} = props;
  const {show, isEditAddress, handleCloseAction, cssOverride = ''} = props;

  /**
   * Function to handle the address form modal close
   */
  const handleCloseModal = useCallback(
    payload => {
      handleCloseAction(payload);
    },
    [handleCloseAction]
  );

  return (
    <Styled id="AddressFormModal" css={css}>
      {show && <AddressForm {...props} handleCloseAction={handleCloseModal} />}
    </Styled>
  );
};

AddressFormModal.propTypes = {
  /**
   * Open or close status of the modal.
   */
  show: PropTypes.bool.isRequired,

  /**
   * Flag to know if address form is opened to edit an address
   */
  isEditAddress: PropTypes.bool.isRequired,

  /** Callback function to handle modal close  */
  handleCloseAction: PropTypes.func.isRequired,

  /** Class name to override css  */
  cssOverride: PropTypes.string
};

AddressFormModal.defaultProps = {
  cssOverride: ''
};

export default React.memo(AddressFormModal);
