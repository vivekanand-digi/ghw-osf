/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from '@oracle-cx-commerce/react-widgets/profile/profile-address-book/components/address-book-card/styles.css';
import {PAGE_EDIT_PROFILE_ADDRESS_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import EditIcon from '../../../../commom/Icons/edit-icon';
import DeleteIcon from '../../../../commom/Icons/delete-icon';

/**
 * Component to display an account address card.
 * @param {Object} props the properties object
 */
const AddressBookCard = props => {
  const {itemId, defaultShippingAddressId, contactInfos} = props;
  const goToPage = useNavigator();
  const handleEditAddress = addressId => {
    goToPage(`${PAGE_EDIT_PROFILE_ADDRESS_LINK}?addressId=${addressId}`);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };
  const {action} = useContext(StoreContext);

  const handleDeleteAddress = addressId => {
    action('deleteProfileAddress', {addressId});
  };
  const makeDefaultShippingAddress = addressId => {
    action('updateDefaultProfileAddress', {addressId});
  };

  return (
    <Styled id="AddressBookCard" css={css}>
      {contactInfos && contactInfos[itemId] && (
        <>
          <div className="address-list" key={`${itemId}`}>
            {defaultShippingAddressId === itemId && <span className="default-address-bg">Default</span>}
            <div className={defaultShippingAddressId === itemId && 'default-address'}>
              <div className='name-info'>{`${contactInfos[itemId].firstName} ${contactInfos[itemId].lastName}`}</div>
              {`${contactInfos[itemId].address1}`}{' '}
              {contactInfos[itemId].address2 ? `, ${contactInfos[itemId].address2}` : ``}
              {`${contactInfos[itemId].city}, ${contactInfos[itemId].state} ${contactInfos[itemId].postalCode}`}
              {`${contactInfos[itemId].country}`}
            </div>
            <div className={defaultShippingAddressId === itemId ? 'action-btn-cnr flex-start-display' : 'action-btn-cnr'}>
              <div className='icon-btn-cnr'>
              <a
                className="icon-btn edit-btn"
                onClick={() => {
                  handleEditAddress(itemId);
                }}
              >
                <EditIcon  />
              </a>
              <a
                className="icon-btn delete-btn"
                onClick={() => {
                  handleDeleteAddress(itemId);
                }}
              >
                <DeleteIcon height="14px" width="14px" />
                </a>
                </div>
              {defaultShippingAddressId !== itemId && (
                <a
                  className="icon-btn link-btn txt-btn"
                  onClick={() => {
                    makeDefaultShippingAddress(itemId);
                  }}
                >
                  Set as Default
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </Styled>
  );
};

export default React.memo(AddressBookCard);
