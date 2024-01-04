/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {isEmptyObject, noop} from '@oracle-cx-commerce/utils/generic';
import {
  getAddressManagerRoles,
  updateShippingAddressInShippingGroup,
  isAddressValid
} from '@oracle-cx-commerce/react-components/utils/address';
import React, {useMemo, useCallback, useContext, useState, useEffect} from 'react';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';

import PropTypes from 'prop-types';
import {CheckoutShippingContext} from '@oracle-cx-commerce/react-widgets/checkout/checkout-shipping-container/context';
import AddNewAddress from '../add-new-address';
import ShippingCartItemDetails from '../shipping-cart-item-details';
import AddressInformation from '../address-information';
import GHWAddressInformation from '../ghw-address-information';
import ShippingOptions from '../shipping-options';
import css from './styles.css';
import LocalStorageService from '../../../utils/localStorageService ';
import CheckoutDeliveryAddressForm from '../delivery-address-form';

const ShippingGroupDetails = props => {
  //resources
  const {
    alertShippingGroupUpdated,
    alertAddressCreatedSuccessfully,
    alertAddressChangedSuccessfully,
    labelEdit,
    headingAddShippingAddress,
    headingEditShippingAddress,
    headingHomeDelivery,
    headingShippingOptions,
    headingShippingTo,
    labelShippingOptions,
    textEnterAShippingAddress,
    textNoShippingMethods
  } = props;

  const {
    defaultShippingCountry,
    shippingCountries,
    shippingGroup = {},
    commerceItems = {},
    shippingDeliveryIndex = '',
    isUserLoggedIn,
    shippingMethodSelectorType,
    isB2BUser,
    roles,
    showEdit = false,
    onEditClick = noop,
    isMultiShipping = false,
    currentOrder = {},
    contactInfos
  } = props;
  const {shippingGroupId, shippingAddress = {}, shippingMethod = {}, priceInfo = {amount: 0}} = shippingGroup;

  const addressManagerRoles = useMemo(() => getAddressManagerRoles(roles), [roles]);
  const store = useContext(StoreContext);

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
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [billingAddress, setBillingAddress] = useState({});
  const [sameAsShippingAddress, setSameAsShippingAddress] = useState(true);
  const [showNewBAddress, setShowNewBAddress] = useState(false);
  const localSameAsShipping = useCallback(() => {
    if (sameAsShippingAddress) {
      LocalStorageService.setItem('sameAsShipping', true);
    } else {
      LocalStorageService.setItem('sameAsShipping', false);
    }
  });

  /**
   *  Called when address is updated through address-form modal or address-book modal
   */
  const onAddressUpdated = useCallback(
    ({address = {}, handleCloseAction = noop, isEditAddress}) => {
      /* When new address is added to shipping group, display proper notification */
      let message = alertShippingGroupUpdated;
      if (isEditAddress === true) {
        message = alertAddressChangedSuccessfully;
      }
      if (isEditAddress === false) {
        message = alertAddressCreatedSuccessfully;
        setShowNewAddress(false);
      }
      const sameShipBill = LocalStorageService.getItem('sameAsShipping');
      if (sameShipBill !== null) {
        if (sameShipBill) {
          setBillingAddress(address);
          LocalStorageService.setItem('sameAsShipping', true);
          if (isAddressValid(address)) {
            LocalStorageService.setItem('billingAddress', address);
          }
        }
      } else {
        setBillingAddress(address);
        LocalStorageService.setItem('sameAsShipping', true);
        if (isAddressValid(address)) {
          LocalStorageService.setItem('billingAddress', address);
        }
      }
      updateShippingAddressInShippingGroup(store, {
        shippingGroup,
        shippingAddress: address,
        alertShippingGroupUpdated: message,
        handleCloseAction,
        fetchShippingMethods: true
      });
    },
    [alertAddressChangedSuccessfully, alertAddressCreatedSuccessfully, alertShippingGroupUpdated, shippingGroup, store]
  );

  useEffect(() => {
    LocalStorageService.removeItem('billingAddress');
    LocalStorageService.removeItem('sameAsShipping');
  }, []);

  const toggelSocalSameAsShipping = () => {
    const sameShipBill = LocalStorageService.getItem('sameAsShipping');
    if (sameShipBill !== null) {
      if (sameShipBill) {
        LocalStorageService.setItem('sameAsShipping', false);
        setSameAsShippingAddress(false);
      } else {
        LocalStorageService.setItem('sameAsShipping', true);
        LocalStorageService.setItem('billingAddress', shippingAddress);
        setBillingAddress(shippingAddress);
        setSameAsShippingAddress(true);
      }
    }
    setSameAsShippingAddress(!sameAsShippingAddress);
  };
  useEffect(() => {
    const sameShipBill = LocalStorageService.getItem('sameAsShipping');
    const billingadd = LocalStorageService.getItem('billingAddress');
    if (sameShipBill !== null) {
      if (sameShipBill) {
        setBillingAddress(shippingAddress);
        LocalStorageService.setItem('sameAsShipping', true);
      } else {
        setBillingAddress(billingadd);
      }
    } else {
      LocalStorageService.setItem('sameAsShipping', true);
    }
    hideAddressForm();
  }, [shippingAddress]);
  useEffect(() => {
    setSameAsShippingAddress(LocalStorageService.getItem('sameAsShipping'));
  }, [billingAddress]);

  const onBAddressUpdated = useCallback(
    ({address = {}, handleCloseAction = noop, isEditAddress}) => {
      /* When new address is added to shipping group, display proper notification */
      let message = alertShippingGroupUpdated;
      if (isEditAddress === true) {
        message = alertAddressChangedSuccessfully;
      }
      if (isEditAddress === false) {
        message = alertAddressCreatedSuccessfully;
        // setShowNewBAddress(false);
      }
      LocalStorageService.setItem('billingAddress', address);
      setBillingAddress(address);
      setShowNewBAddress(false);
    },
    [alertAddressChangedSuccessfully, alertAddressCreatedSuccessfully, alertShippingGroupUpdated]
  );

  const {
    shippingStatus = {},
    setShippingStatus = noop,
    deliveryAddressForm = {},
    checkoutShippingTabs
  } = useContext(CheckoutShippingContext);

  const displayBillingAdd = () => {
    if (isAddressValid(shippingAddress) && !showNewAddress) {
      return true;
    }
    // setShippingStatus(prevState => {
    //   return {...prevState, showConinueToPayment: false};
    // });

    return false;
  };

  useEffect(() => {
    if (!isAddressValid(shippingAddress)) {
      setShowNewAddress(true);
      setShippingStatus(prevState => {
        return {...prevState, enableContinue: false};
      });
    }
  }, [shippingAddress]);

  const showAddressForm = () => {
    // onAddressUpdated({}, noop, false);
    setShippingStatus(prevState => {
      return {...prevState, enableContinue: false};
    });
    setShowNewAddress(true);
  };
  const billingAdd = () => {
    if (showNewAddress) {
      return true;
    }
    if (sameAsShippingAddress) {
      return true;
    }

    return false;
  };
  const hideAddressForm = () => {
    // if (isAddressValid(shippingAddress)) {
    setShippingStatus(prevState => {
      return {...prevState, enableContinue: true, showConinueToPayment: true};
    });
    // }
    setShowNewAddress(false);
  };

  const showBAddressForm = () => {
    setShippingStatus(prevState => {
      return {...prevState, enableContinue: false, showConinueToPayment: false};
    });
    setShowNewBAddress(true);
  };
  const hideBAddressForm = () => {
    setShippingStatus(prevState => {
      return {...prevState, enableContinue: true, showConinueToPayment: true};
    });
    setShowNewBAddress(false);
  };

  const headingBillingAddress = () => {};
  const headingEditBillingAddress = () => {};
  const headingAddBillingAddress = () => {
    setShippingStatus(prevState => {
      return {...prevState, enableContinue: true, showConinueToPayment: true};
    });
  };

  return (
    <Styled id="ShippingGroupDetails" css={css}>
      <div className="ShippingGroupDetails">
        {((shippingGroup || {}).items || []).length > 0 && (
          <>
            <div className="ShippingGroupDetails__Wrapper">
              <div className="ShippingGroupDetails__ShippingGroupData">
                <AddressInformation
                  showTitle={true}
                  address={shippingAddress}
                  headingAddress={headingShippingTo}
                  headingEditAddress={headingEditShippingAddress}
                  countries={shippingCountries}
                  onAddressUpdated={onAddressUpdated}
                  showAddressForm={showAddressForm}
                  {...props}
                />
              </div>
              {shouldDisplayAddNewAddressLink() && (
                <div className="ShippingGroupDetails__AddANewAddress">
                  <AddNewAddress
                    {...props}
                    showTitle={true}
                    showNewAddress={showNewAddress}
                    hideAddressForm={hideAddressForm}
                    headingAddAddress={headingAddShippingAddress}
                    countries={shippingCountries}
                    defaultCountry={defaultShippingCountry}
                    onAddressUpdated={onAddressUpdated}
                    usercontactInfos={contactInfos ? contactInfos : []}
                  />
                  {/* <CheckoutDeliveryAddressForm {...props} /> */}
                </div>
              )}
            </div>

            <div className="ShippingGroupDetails__Wrapper">
              <div className="ShippingGroupDetails__ShippingGroupData">
                {displayBillingAdd() ? (
                  <>
                    <h3 className="section-title">Billing Information</h3>
                    <div>
                      <label className="label">
                        <input
                          type="checkbox"
                          value={sameAsShippingAddress}
                          checked={sameAsShippingAddress}
                          onChange={() => toggelSocalSameAsShipping()}
                        />
                        <span className="checkmark"></span> Billing information is the same as shipping. (Uncheck if
                        different)
                      </label>
                    </div>
                  </>
                ) : (
                  ''
                )}
                {sameAsShippingAddress || showNewAddress ? (
                  ''
                ) : (
                  <>
                    <GHWAddressInformation
                      address={billingAddress}
                      showTitle={false}
                      headingAddress={headingBillingAddress}
                      headingEditAddress={headingEditBillingAddress}
                      countries={shippingCountries}
                      onAddressUpdated={onBAddressUpdated}
                      showAddressForm={showBAddressForm}
                      {...props}
                    />

                    {(shouldDisplayAddNewAddressLink() || displayBillingAdd()) && (
                      <div className="ShippingGroupDetails__AddANewBillingAddress">
                        <AddNewAddress
                          {...props}
                          showTitle={false}
                          showNewAddress={showNewBAddress}
                          hideAddressForm={hideBAddressForm}
                          headingAddAddress={headingAddBillingAddress}
                          countries={shippingCountries}
                          defaultCountry={defaultShippingCountry}
                          onAddressUpdated={onBAddressUpdated}
                          isBilling={true}
                        />
                        {/* <CheckoutDeliveryAddressForm {...props} /> */}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {displayBillingAdd() ? (
              <ShippingOptions
                shippingAddress={shippingAddress}
                shippingGroupId={shippingGroupId}
                shippingMethod={shippingMethod}
                isB2BUser={isB2BUser}
                shippingDeliveryIndex={shippingDeliveryIndex}
                shippingMethodSelectorType={shippingMethodSelectorType}
                currentOrder={currentOrder}
                {...{
                  cartAmount: priceInfo.amount,
                  headingShippingOptions,
                  labelShippingOptions,
                  textEnterAShippingAddress,
                  textNoShippingMethods
                }}
              />
            ) : (
              ''
            )}
          </>
        )}
      </div>
    </Styled>
  );
};

ShippingGroupDetails.propTypes = {
  /**
   * This is the default shipping country code
   */
  defaultShippingCountry: PropTypes.string,

  /** The countries object from redux state(countryRegionRepository->shippingCountries) */
  shippingCountries: PropTypes.objectOf(
    PropTypes.shape({
      countryCode: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      repositoryId: PropTypes.string.isRequired,
      regions: PropTypes.shape.isRequired
    })
  ),

  /**
   * Shipping Group
   */
  shippingGroup: PropTypes.shape({
    shippingGroupId: PropTypes.string,
    shippingAddress: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      address1: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      postalCode: PropTypes.string,
      country: PropTypes.string,
      phoneNumber: PropTypes.string
    }),
    shippingMethod: PropTypes.shape({})
  }).isRequired,

  /**
   * Commerce Items.
   */
  commerceItems: PropTypes.objectOf(PropTypes.object),

  /**
   * Shipping Group index.
   */
  shippingDeliveryIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /**
   * Logged in status of the user.
   */
  isUserLoggedIn: PropTypes.bool.isRequired,

  /**
   * Type of the UI element to display shipping options.
   */
  shippingMethodSelectorType: PropTypes.string.isRequired,

  /**
   * Type of the shopper.
   */
  isB2BUser: PropTypes.bool.isRequired,

  /**
   * The roles (user roles) object from redux state(ProfileRepository->roles)
   */
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      repositoryId: PropTypes.string.isRequired,
      function: PropTypes.string.isRequired
    })
  ),

  /**
   * Flag to know if edit link to be displayed
   */
  showEdit: PropTypes.bool,

  /** Callback function to handle edit link click  */
  onEditClick: PropTypes.func,

  /**
   * Flag to know if this component is rendered for multi-shipping-widget
   */
  isMultiShipping: PropTypes.bool
};

ShippingGroupDetails.defaultProps = {
  defaultShippingCountry: '',
  shippingCountries: {},
  shippingDeliveryIndex: '',
  showEdit: undefined,
  onEditClick: noop,
  isMultiShipping: undefined,
  commerceItems: {},
  roles: []
};

export default React.memo(ShippingGroupDetails);
