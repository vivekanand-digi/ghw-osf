/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useState, useCallback, useEffect} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import AddressForm from '../address-form';
import css from './styles.css';

/**
 * Component to add a new shipping/billing address
 * @param {Object} props The properties object
 * @memberof Components
 * @class AddNewAddress
 * @category Component-list
 * @param {String} labelAddANewAddress - Label specifying to add a new address.
 * @author Oracle
 * @since 2.10.0
 */
const AddNewAddress = props => {
  // resource
  const {hideAddressForm, showNewAddress} = props;
  const [showAddressFormModal, setShowAddressFormModal] = useState(false);

  useEffect(() => {
    setShowAddressFormModal(showNewAddress);
  }, [showNewAddress]);

  /**
   * Function to handle the modal close
   */
  const handleCloseAddressFormModal = useCallback(() => {
    setShowAddressFormModal(false);
    hideAddressForm(false);
  }, []);

  return (
    <Styled id="AddNewAddress" css={css}>
      <div className="AddNewAddress">
        {showAddressFormModal && (
          <AddressForm {...props} isEditAddress={false} handleCloseAction={handleCloseAddressFormModal} />
        )}
      </div>
    </Styled>
  );
};

AddNewAddress.propTypes = {};

AddNewAddress.defaultProps = {};

export default React.memo(AddNewAddress);
