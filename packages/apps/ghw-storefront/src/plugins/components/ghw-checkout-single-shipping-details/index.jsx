import {CheckoutShippingContext} from '@oracle-cx-commerce/react-widgets/checkout/checkout-shipping-container/context';
import React, {useCallback, useContext, useEffect, useState, useMemo, useRef} from 'react';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {fetchShippingCountries} from '@oracle-cx-commerce/fetchers/shipping-countries';
import {
  getHardgoodShippingGroupsWithItems,
  isShippingDetailsComplete
} from '@oracle-cx-commerce/react-components/utils/shipping';
import {isAddressValid, updateSGWithProfileDefaultAddress} from '@oracle-cx-commerce/react-components/utils/address';
import {isEmptyObject, noop} from '@oracle-cx-commerce/utils/generic';
import {useCartInitializer} from '@oracle-cx-commerce/react-components/utils/cart/hooks';
import {useShippingCountriesFetcher} from '@oracle-cx-commerce/fetchers/shipping-countries/hooks';
import PropTypes from 'prop-types';
import {getComponentData} from './selectors';
import css from './ghw-checkout-single-shipping-details.css';
import ShippingGroupDetails from './components/shipping-group-details';
import CheckoutDeliveryAddressForm from './components/delivery-address-form';

// export fetchers to load all shipping countries into the state during server-side rendering.
export const fetchers = [fetchShippingCountries];

// Checkout shipping tab values for the single shipping flow
const SINGLE_SHIPPING_ADDRESS_FORM_TAB_INDEX = 0;
const SINGLE_SHIPPING_SUMMARY_TAB_INDEX = 1;

/**
 * Widget to handle the checkout shipping flow for a single shipping scenario
 * @param {Object} props The properties object
 * @memberof Components
 * @class GHWCheckoutSingleShippingDetails
 * @category Component-list
 * @param {String} headingDeliveryAddress - Set of regions defined in CheckoutShippingContainer layout.
 * @param {Object} [currentOrder = {}] - Current order object.
 * @param {Object} [currentProfile = {}] -  Current profile details
 * @param {Boolean} isGetCartInProgress -  Locale for shipping heading
 * @param {Boolean} isUserLoggedIn -  Boolean flag indicating if user is logged in.
 * @param {Boolean} isGetPriceCartInProgress -  Boolean indicating if get price cart is in progress
 * @param {Boolean} isB2BUser -  Boolean flag to indicate if the user is a B2B user
 * @author Oracle
 * @since 2.10.0
 */
const GHWCheckoutSingleShippingDetails = props => {
  // resources
  const {headingDeliveryAddress} = props;

  const {
    currentOrder = {},
    currentProfile = {},
    isGetCartInProgress,
    isUserLoggedIn,
    isGetPriceCartInProgress,
    isB2BUser
  } = props;

  const [priceCartStatus, setPriceCartStatus] = useState('');

  useMemo(() => {
    if (isGetPriceCartInProgress === 1) {
      setPriceCartStatus('inprogress');
    } else if (priceCartStatus === 'inprogress') {
      setPriceCartStatus('done');
    }
  }, [isGetPriceCartInProgress, priceCartStatus]);

  const {shippingGroups = {}, commerceItems = {}, priceInfo = {}} = currentOrder;
  const {shippingAddresses = []} = currentProfile;

  const store = useContext(StoreContext);

  // Checkout Shipping Context
  const {
    shippingStatus = {},
    setShippingStatus = noop,
    deliveryAddressForm = {},
    setDeliveryAddressForm = noop,
    setCheckoutShippingTabs = noop
  } = useContext(CheckoutShippingContext);

  // To find the right tab index only for the initial page load
  const loadInitialTabIndexRef = useRef(false);

  /**
   * Invoke fetcher hook to load all the shipping countries into the state
   * This will not perform any task if the state has already the shipping countries
   * It is effective if the SSR didn't populate the state with shipping countries data
   */
  useShippingCountriesFetcher(store);

  /**
   * Reprices the current incomplete order on page load.
   */
  useCartInitializer(currentOrder, isGetCartInProgress);

  // shipping group
  const currentShippingGroup = useMemo(() => {
    const hardgoodShippingGroups = getHardgoodShippingGroupsWithItems(shippingGroups);

    return hardgoodShippingGroups[0] || {};
  }, [shippingGroups]);
  const {shippingAddress = {}} = currentShippingGroup;

  // default address for the profile
  const profileDefaultAddress = useMemo(() => {
    if (isUserLoggedIn) {
      return isB2BUser ? currentProfile.contactShippingAddress : currentProfile.shippingAddress;
    }

    return null;
  }, [currentProfile.contactShippingAddress, currentProfile.shippingAddress, isB2BUser, isUserLoggedIn]);

  // this scenario should never happen.
  if (shippingStatus.tabIndex === SINGLE_SHIPPING_SUMMARY_TAB_INDEX && deliveryAddressForm.isModified) {
    setDeliveryAddressForm({address: {}, isModified: false});
    setShippingStatus(prevState => {
      return {...prevState, showConinueToPayment: true};
    });
  }

  /**
   * Function to check if the shipping address is available
   * @returns {boolean} returns true if the shipping address is valid or if the profile has a default address
   */
  const isShippingAddressAvailable = useCallback(() => {
    if (isAddressValid(shippingAddress, isB2BUser)) {
      return true;
    }

    return false;
  }, [isB2BUser, shippingAddress]);

  /**
   * Function to check if the delivery address form should be displayed
   * @returns {boolean} returns true if the address form should be displayed
   */
  const shouldDisplayDeliveryForm = () => {
    if (shippingStatus.tabIndex === SINGLE_SHIPPING_ADDRESS_FORM_TAB_INDEX) {
      if (isUserLoggedIn) {
        if (isB2BUser) {
          // Do not show form for any role
          return false;
        }

        /* Valid-Default-Address available then don't display delivery-form to avoid flickering */
        /* B2C user, show shipping-details screen with below message - 
         that no selected address, please open address-book and choose */
        if ((profileDefaultAddress && !isAddressValid(shippingAddress, isB2BUser)) || shippingAddresses.length > 0) {
          return false;
        }

        return false;
      }

      // Guest user
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (isShippingAddressAvailable()) {
      if (isShippingDetailsComplete(currentOrder, isB2BUser)) {
        // If the shipping is complete in the shipping details phase(tabIndex = 1),
        // then display the 'Continue to Payment' button and enable it
        setShippingStatus(prevState => {
          return {
            ...prevState,
            tabIndex: SINGLE_SHIPPING_SUMMARY_TAB_INDEX,
            showConinueToPayment: true,
            enableContinue: true
          };
        });
      } else {
        setShippingStatus(prevState => {
          return {
            ...prevState,
            tabIndex: SINGLE_SHIPPING_SUMMARY_TAB_INDEX,
            showConinueToPayment: true,
            enableContinue: false
          };
        });
      }
    } else if (shippingStatus.tabIndex === SINGLE_SHIPPING_SUMMARY_TAB_INDEX) {
      // If the address is not valid in the shipping details phase, then disable the 'Continue to Payment' button
      setShippingStatus(prevState => {
        return {...prevState, showConinueToPayment: true, enableContinue: false};
      });
    } else if (priceCartStatus === 'done') {
      // If the shipping address is not available, then update the shipping group with the profile default address
      updateSGWithProfileDefaultAddress(store, currentShippingGroup);
    }
  }, [
    currentOrder,
    currentShippingGroup,
    isB2BUser,
    priceCartStatus,
    isShippingAddressAvailable,
    setShippingStatus,
    shippingStatus.tabIndex,
    store
  ]);

  /**
   * Handles the initial load of the shipping page
   * Loads the shipping methods for the multi shipping summary screen
   */
  useEffect(() => {
    if (loadInitialTabIndexRef.current === false && isGetCartInProgress !== 1 && !isEmptyObject(commerceItems)) {
      setCheckoutShippingTabs({
        SINGLE_SHIPPING_ADDRESS_FORM_TAB_INDEX,
        SINGLE_SHIPPING_SUMMARY_TAB_INDEX
      });
      if (setShippingStatus.tabIndex === SINGLE_SHIPPING_SUMMARY_TAB_INDEX) {
        setShippingStatus(prevState => {
          return {...prevState, loadShippingMethods: true};
        });
      }
    }
  }, [commerceItems, isGetCartInProgress, setCheckoutShippingTabs, setShippingStatus, setShippingStatus.tabIndex]);

  /**
   * Gets shipping methods for all home delivery shipping groups on change of amount of the order
   */
  useEffect(() => {
    setShippingStatus(prevState => {
      return {...prevState, loadShippingMethods: true};
    });
  }, [priceInfo.amount, setShippingStatus, store]);

  return (
    <Styled css={css} id="GHWCheckoutSingleShippingDetails">
      <div className="GHWCheckoutSingleShippingDetails shipping-info">
        {shouldDisplayDeliveryForm() ? (
          // Display the address form if the shipping address is not available or there is no profile address for the B2C user
          <>
            {/* <h3>{headingDeliveryAddress}</h3> */}
            <CheckoutDeliveryAddressForm {...props} />
          </>
        ) : (
          // Display the shipping group details phase if the shipping address is valid
          // or if the address can be selected from the profile addresses or if the user is a B2B user
          <ShippingGroupDetails shippingGroup={currentShippingGroup} commerceItems={commerceItems} {...props} />
        )}
      </div>
    </Styled>
  );
};

GHWCheckoutSingleShippingDetails.propTypes = {
  /**
   * Logged in status of the user.
   */
  isUserLoggedIn: PropTypes.bool.isRequired,

  /**
   * Type of the shopper.
   */
  isB2BUser: PropTypes.bool.isRequired,

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
   * This is the flag to know whether get-cart action is in-progress.
   */
  isGetCartInProgress: PropTypes.number.isRequired,

  /**
   * This is the object to get the current order
   */
  currentOrder: PropTypes.shape({
    shippingGroups: PropTypes.object,
    commerceItems: PropTypes.object
  }).isRequired,

  /**
   * This is the object to get the current profile
   */
  currentProfile: PropTypes.shape({
    shippingAddresses: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,

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
   * This is the array of shipping countries
   */
  shippingCountries: PropTypes.objectOf(PropTypes.object).isRequired,

  /**
   * This is the default shipping country code
   */
  defaultShippingCountry: PropTypes.string
};

GHWCheckoutSingleShippingDetails.defaultProps = {
  contactInfos: {},
  roles: [],
  defaultShippingCountry: ''
};

export default connect(getComponentData)(GHWCheckoutSingleShippingDetails);
