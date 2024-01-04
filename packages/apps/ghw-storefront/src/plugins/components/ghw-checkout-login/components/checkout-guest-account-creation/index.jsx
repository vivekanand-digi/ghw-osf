/*
 ** Copyright (c) 2022 Oracle and/or its affiliates.
 */
import React, {useCallback, useContext, useState, useEffect} from 'react';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {noop} from '@oracle-cx-commerce/utils/generic';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import GoogleTypeahead from '../../../profile/ghw-profile-address-form/components/google-typeahead';

const CheckoutGuestAccountCreation = props => {
  const {email, defaultShippingCountry, shippingCountries, alertCreateProfileSuccessful, onReject = noop} = props;

  const store = useContext(StoreContext);
  const {action} = store;

  const [userObject, setUserObject] = useState({});
  const [inProgress, setInProgress] = useState(false);
  const [addressObj, setAddressObj] = useState(null);
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    receiveEmail: 'yes'
  });
  //collect the from data

  //   generate the password

  //create profile and login
  const generatePassword = () => {
    const length = 10,
      charset = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    return `${retVal}$23`;
  };

  const createUserObject = () => {
    const newErrors = {};
    if (!values.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }

    if (!values.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }

    if (Object.keys(newErrors).length === 0) {
      const pwd = generatePassword();
      const obj = {
        autoLogin: 'true',
        firstName: values['firstName'],
        lastName: values['lastName'],
        email,
        password: pwd,
        confirmPassword: pwd,
        receiveEmail: 'yes'
      };

      setUserObject(obj);
    } else {
      // Form has errors, update the state to display error messages
      setErrors(newErrors);
    }

    return true;
  };
  /**
   * success callback of create account.
   */
  const onOk = useCallback(() => {
    // setFormSubmitted(true);
    if (props.authenticated) {
      action('notify', {level: 'info', message: alertCreateProfileSuccessful});
    }
  }, [action, alertCreateProfileSuccessful, props.authenticated]);

  /**
   * failure callback of create account.
   */
  const onNotOk = useCallback(({error}) => {
    // setAccountCreationStatus(error.message);
    console.log('create profile error-->', error.message);
  }, []);

  const createProfile = () => {
    // Invoke the named action passing form json object as payload

    if (Object.keys(userObject).length) {
      setInProgress(true);
      action('createProfile', userObject)
        .then(response => {
          // Callback - action is resolved (i.e. no runtime error)
          // onResolve(response);

          if (response.ok === false) {
            // Callback - action is resolved with !ok status
            onNotOk(response);
          } else {
            // if (enableUnsavedChangesTracking) {
            //   // Mark form as clean
            //   delete form.dataset.dirty;
            // }
            // Callback - action is resolved with ok status
            onOk(response);
          }
        })
        .catch(onReject /* Callback - action is rejected (i.e. runtime error) */)
        .finally((...args) => {
          // Callback to indicate action invocation is complete
          setInProgress(false);

          // Callback - action is complete
          // onComplete(...args);
        });
    }
  };

  useEffect(() => {
    createProfile();
  }, [userObject]);

  const handleChange = event => {
    setValues({...values, [event.target.name]: event.target.value});
    setErrors(current => {
      // 👇️ create copy of state object
      const copy = {...current};

      // 👇️ remove salary key from object
      delete copy[event.target.name];

      return copy;
    });
  };

  const fillInAddress = addressObject => {
    console.log('address -->', addressObject);
    let address1 = '';
    let postcode = '';
    let locality = '';
    let state = '';
    let country = '';
    for (const component of addressObject.address_components) {
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];

      switch (componentType) {
        case 'street_number': {
          address1 = `${component.long_name} ${address1}`;
          break;
        }

        case 'route': {
          address1 += component.short_name;
          break;
        }

        case 'postal_code': {
          postcode = `${component.long_name}${postcode}`;
          break;
        }

        // case 'postal_code_suffix': {
        //   postcode = `${postcode}-${component.long_name}`;
        //   break;
        // }
        case 'locality':
          locality = component.long_name;
          break;
        case 'administrative_area_level_1': {
          state = component.short_name;
          break;
        }
        case 'country':
          country = component.short_name;
          break;
        default:
          obj = component;
      }
    }
    // setAddressObj({
    //   address1,
    //   city: locality,
    //   country,
    //   postalCode: postcode,
    //   state
    // });
  };

  return (
    <Styled id="CheckoutGuestAccountCreation" css={css}>
      <div className="CheckoutGuestAccountCreation">
        <div className="shipping-info guest-info">
          {/* <h4 className="h4" id="ship">
            Shipping Information
          </h4> */}

          <div className="form-check">
            <input
              type="checkbox"
              value={values.receiveEmail === 'yes' ? 'no' : 'yes'}
              checked={values.receiveEmail === 'yes' ? true : false}
              name="receiveEmail"
              id="receiveEmail"
              onClick={handleChange}
            />
            <label htmlFor="receiveEmail">Yes, I want special offers and rewards via email</label>
          </div>

          <div className="form_shipping form-group">
            <div className="form-field">
              <input
                className="form-field__input"
                type="text"
                id=""
                placeholder="&nbsp;"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
              />
              <span className="form-field__label">First Name</span>
              <span className="focus-bg"></span>
              {errors.firstName && <span className="error">{errors.firstName}</span>}
            </div>

            <div className="form-field">
              <input
                className="form-field__input"
                type="text"
                id=""
                placeholder="&nbsp;"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
              />
              <span className="form-field__label">Last Name</span>
              <span className="focus-bg"></span>
              {errors.lastName && <span className="error">{errors.lastName}</span>}
            </div>
            {/* <GoogleTypeahead placeSelectHanlder={addressObject => fillInAddress(addressObject)} /> */}
            {addressObj ? (
              <>
                <div className="form-field">
                  <input
                    className="form-field__input"
                    type="text"
                    id=""
                    placeholder="&nbsp;"
                    name="address1"
                    value={values.adrress1}
                    onChange={handleChange}
                  />
                  <span className="form-field__label">Address 1</span>
                  <span className="focus-bg"></span>
                </div>
                <div className="form-field">
                  <input
                    className="form-field__input"
                    type="text"
                    id=""
                    placeholder="&nbsp;"
                    name="address2"
                    value={values.adrress2}
                    onChange={handleChange}
                  />
                  <span className="form-field__label">Address 2</span>
                  <span className="focus-bg"></span>
                </div>
                <div className="form-field">
                  <input
                    className="form-field__input"
                    type="text"
                    id=""
                    placeholder="&nbsp;"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                  />
                  <span className="form-field__label">City</span>
                  <span className="focus-bg"></span>
                </div>

                <div className="form-field">
                  <input
                    className="form-field__input"
                    type="text"
                    id=""
                    placeholder="&nbsp;"
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                  />
                  <span className="form-field__label">State</span>
                  <span className="focus-bg"></span>
                </div>

                <div className="form-field">
                  <input
                    className="form-field__input"
                    type="text"
                    id=""
                    placeholder="&nbsp;"
                    name="zip"
                    value={values.zip}
                    onChange={handleChange}
                  />
                  <span className="form-field__label">Zip Code</span>
                  <span className="focus-bg"></span>
                </div>

                <div className="form-field">
                  <input
                    className="form-field__input"
                    type="text"
                    id=""
                    placeholder="&nbsp;"
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                  />
                  <span className="form-field__label">Country/Region</span>
                  <span className="focus-bg"></span>
                </div>
                <div className="form-field">
                  <input
                    className="form-field__input"
                    type="text"
                    id=""
                    placeholder="&nbsp;"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                  />
                  <span className="form-field__label">Phone</span>
                  <span className="focus-bg"></span>
                </div>
              </>
            ) : null}
          </div>
          <div className="action-btn-cnr form-field">
            
              <button className="loginBtn" type="button" disabled={inProgress} onClick={() => createUserObject()}>
                Next
              </button>
            
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default CheckoutGuestAccountCreation;
