/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback, useState, useEffect} from 'react';

import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import PropTypes from 'prop-types';
import CheckoutAddressBookDropDownCard from '../address-book-card';
import {getComponentData} from './selectors';
import css from './styles.css';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * Component to list and manage profile addresses.
 * @param {Object} props The properties object
 * @memberof Components
 * @class CheckoutAddressBookDropDown
 * @category Component-list
 * @param {String} labelNoProfileAddressesAvailable - Label specifying to add a new address.
 * @param {Object} contactInfos - The contactInfos (address) object from redux state(ProfileRepository->contactInfos)
 * @param {String} shippingAddress - Shipping address
 * @param {Array} shippingAddressIds - List of shipping address ids
 * @param {String} handleSelectAddress - Callback function called when address is selected
 * @author Oracle
 * @since 2.10.0
 */
const CheckoutAddressBookDropDown = props => {
  //resources
  const {labelNoProfileAddressesAvailable, showAddressForm} = props;
  const {contactInfos, shippingAddress, shippingAddressIds, handleSelectAddress, showTitle = true} = props;
  const sortedShippingAddressIds = [];

  console.log('CheckoutAddressBookDropDown --> ', props);

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

  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState(false);
  useEffect(() => {
    const handler = () => setShowMenu(false);
    window.addEventListener('click', handler);

    return () => {
      window.removeEventListener('click', handler);
    };
  });

  const handleInputClick = e => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };
  const getDisplay = () => {
    // if (selectedValue) {
    //   return selectedValue;
    // }

    return 'Select Address';
  };
  const onItemClick = item => {
    setSelectedValue(item);
    selectThisAddress(item);
  };

  const getAddressCart = address => {
    return (
      <div className="address">
        {/* {address.firstName && address.lastName ? <p>{`${address.firstName} ${address.lastName}`}</p> : ``} */}
        <p>
          {`${address.address1}`} {address.address2 ? `, ${address.address2}` : ``}
        </p>
        <p>{`${address.city}, ${address.state} ${address.postalCode}`}</p>
        <p>{`${address.country}`}</p>
        {address.phoneNumber && <p>{`${address.phoneNumber}`}</p>}
      </div>
    );
  };
  const newAddress = useCallback(() => {
    console.log('new address click');
    showAddressForm(true);
  }, []);

  const checkShippingAddress = () => {
  };

  return (
    <Styled id="CheckoutAddressBookDropDown" css={css}>
      <div className="CheckoutAddressBookDropDown">
        <div className="CheckoutAddressBookDropDown__AddressesList">
          {checkShippingAddress()}
          {showTitle ? (
            <h3 className="section-title" id="test">
              Shipping information
            </h3>
          ) : (
            ''
          )}

          <div className="dropdown-container">
            
            <div onClick={handleInputClick} className="dropdown-input">
              <div className="dropdown-selected-value">{getDisplay()}</div>
              {showMenu && (
                <div className="dropdown-tool">
                  <div className="dropdown-menu">
                    {contactInfos && shippingAddressIds && shippingAddressIds.length > 0 ? (
                      <>
                        {(getSortedShippingAddressIds(contactInfos, shippingAddressIds) || []).map(itemId => (
                          <div className="address-card" onClick={() => onItemClick(itemId)} key={`${itemId}`}>
                            <div className="address-radio">
                              <input
                                type="radio"
                                id="html"
                                name={itemId}
                                value={itemId}
                                checked={itemId === selectedValue}
                              />
                            </div>
                            {getAddressCart(contactInfos[itemId])}
                          </div>
                        ))}
                        <div className="action-btn-cnr"  onClick={newAddress} key={`newAddress`}>
                          <button className="btn-link"> Add New Address  <span className='add-icon'>+</span></button>
                        </div>
                      </>
                    ) : (
                      <div className="dropdown-content-cnr">
                        <div className='disable-msg'>{labelNoProfileAddressesAvailable}</div>
                        <div className="action-btn-cnr" onClick={newAddress} key={`newAddress`}>
                          <button className="btn-link">Add New Address <span className='add-icon'>+</span></button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div class="Dropdown__Icon">
              {/* <svg width="18px" height="20px" color="" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.875 2.84766L9.75 9.55078C9.51562 9.78516 9.23438 9.87891 9 9.87891C8.71875 9.87891 8.4375 9.78516 8.20312 9.59766L1.07812 2.84766C0.609375 2.42578 0.609375 1.72266 1.03125 1.25391C1.45312 0.785156 2.15625 0.785156 2.625 1.20703L9 7.20703L15.3281 1.20703C15.7969 0.785156 16.5 0.785156 16.9219 1.25391C17.3438 1.72266 17.3438 2.42578 16.875 2.84766Z" fill="#D0D5DD"></path></svg> */}
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
};

CheckoutAddressBookDropDown.propTypes = {
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

CheckoutAddressBookDropDown.defaultProps = {
  contactInfos: {},
  shippingAddressIds: []
};

export default connect(getComponentData)(CheckoutAddressBookDropDown);
