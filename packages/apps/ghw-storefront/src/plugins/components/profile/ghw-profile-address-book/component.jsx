/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback, useMemo, useRef, useState, useEffect, useContext} from 'react';

import {PAGE_ADD_PROFILE_ADDRESS_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {getComponentData} from '@oracle-cx-commerce/react-widgets/profile/profile-address-book/selectors';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {getPage} from '@oracle-cx-commerce/commerce-utils/selector';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import css from './styles.css';
import AddressBookCard from './components/address-book-card';

const GHWProfileAddressBook = props => {
  const {actionAddNewAddress, labelNoProfileAddressesAvailable} = props;
  const store = useContext(StoreContext);
  const {route = ''} = getPage(store.getState());
  const {isUserLoggedIn, contactInfos, isGetProfileAddressInProgress, defaultShippingAddressId, shippingAddressIds} =
    props;

  // A flag to keep address action popover toggling
  const [showAddressActions, setShowAddressActions] = useState(new Map());
  const goToPage = useNavigator();

  const hideAllPopover = useCallback(
    addressId => {
      showAddressActions.forEach(function (value, key) {
        if (key !== addressId && value === true) {
          setShowAddressActions(new Map(showAddressActions.set(key, !showAddressActions.get(key))));
        }
      });
    },
    [showAddressActions]
  );

  const handlePopoverToggle = useRef(addressId => {
    hideAllPopover(addressId);
    setShowAddressActions(new Map(showAddressActions.set(addressId, !showAddressActions.get(addressId))));
  });

  /* returns options array sorted by lastName */
  const sortedShippingAddressIds = useMemo(() => {
    const sortedShippingAddressIds = [];

    if (defaultShippingAddressId) {
      sortedShippingAddressIds[0] = defaultShippingAddressId;
    }
    const addressIdsWithoutDefaultAddress = shippingAddressIds.filter(
      addressId => addressId !== defaultShippingAddressId
    );
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
  }, [contactInfos, defaultShippingAddressId, shippingAddressIds]);

  return (
    <Styled id="GHWProfileAddressBook" css={css}>
      {isUserLoggedIn && (
        <div className="v-tab_content profile_address_book">
          <div className="Shipping-detail">
            <div className="Button-wrapper">
              <p className="add-btn">
                <button
                  id="add-profile-address-button"
                  type="button"
                  onClick={() => {
                    goToPage(PAGE_ADD_PROFILE_ADDRESS_LINK);
                    if (typeof window !== 'undefined') {
                      window.location.reload();
                    }
                  }}
                  className="myBtn"
                  aria-label={actionAddNewAddress}
                >
                  Add Address
                </button>
              </p>
            </div>
            <div className="shipping-info">
              {isGetProfileAddressInProgress === 0 && (
                <>
                  {contactInfos && shippingAddressIds && shippingAddressIds.length > 0 ? (
                    <div className="address-main">
                      {sortedShippingAddressIds.map(itemId => (
                        <React.Fragment key={`${itemId}`}>
                          <AddressBookCard
                            {...props}
                            handlePopoverToggle={handlePopoverToggle.current}
                            showMenuPopover={showAddressActions.get(itemId)}
                            itemId={itemId}
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div className="ProfileAddressBook__NoAddressLabel">
                      <span>{labelNoProfileAddressesAvailable}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Styled>
  );
};

export default connect(getComponentData)(GHWProfileAddressBook);
