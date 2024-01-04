import React, {useEffect, useState, useContext, useRef} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {getProfile, getRememberMe, isAuthenticated} from '@oracle-cx-commerce/commerce-utils/selector';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import GHWContactusSubmitSuccess from './components';
import {getLoggedInData} from './selectors';
import css from './styles.css';

const GHWContactUs = props => {
  const {authenticated, profileId, currentProfile} = props;
  const {action, getState} = useContext(StoreContext);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    firstName: Object.hasOwn(currentProfile, 'firstName') ? currentProfile.firstName : '',
    lastName: Object.hasOwn(currentProfile, 'lastName') ? currentProfile.lastName : '',
    emailId: Object.hasOwn(currentProfile, 'email') ? currentProfile.email : '',
    phonenumber:
      Object.hasOwn(currentProfile, 'daytimeTelephoneNumber') && currentProfile.daytimeTelephoneNumber
        ? currentProfile.daytimeTelephoneNumber
        : '',
    externalId: 'OCC Contact ID',
    subject: 'User Incident',
    incidentSubTypeId: 'Web Contact US form',
    MarketplaceId: '',
    orderNumber: '',
    requestTypeId: '',
    Comment: '',
    AutoShipUpdateActionId: '',
    ShippingInquiryTypeId: '',
    RefundInquiryTypeId: '',
    GeneralInquiryTypeId: '',
    ProductsSelected: '',
    AutoShipCancelReason: ''
  });

  useEffect(() => {
    if (authenticated && profileId) {
      setValues({
        ...values,
        ...{
          firstName: Object.hasOwn(currentProfile, 'firstName') ? currentProfile.firstName : '',
          lastName: Object.hasOwn(currentProfile, 'lastName') ? currentProfile.lastName : '',
          emailId: Object.hasOwn(currentProfile, 'email') ? currentProfile.email : '',
          phonenumber:
            Object.hasOwn(currentProfile, 'daytimeTelephoneNumber') && currentProfile.daytimeTelephoneNumber
              ? currentProfile.daytimeTelephoneNumber
              : ''
        }
      });
    }
  }, [authenticated, profileId, currentProfile]);

  const handleChange = event => {
    const listArray = ['firstName', 'lastName', 'emailId', 'phonenumber', 'orderNumber'];
    if (listArray.indexOf(event.target.name) >= 0) {
      setValues({...values, [event.target.name]: event.target.value});
    } else {
      setValues({...values, [event.target.name]: Number.parseInt(event.target.value, 10)});
    }
    const errorsObj = errors;
    errorsObj[event.target.name] = '';
    setErrors(errorsObj);
  };
  const resetState = (count, values) => {
    const fname = Object.hasOwn(currentProfile, 'firstName') ? currentProfile.firstName : values.firstName;
    const lname = Object.hasOwn(currentProfile, 'lastName') ? currentProfile.lastName : values.lastName;
    const email = Object.hasOwn(currentProfile, 'email') ? currentProfile.email : values.emailId;
    const phone =
      Object.hasOwn(currentProfile, 'daytimeTelephoneNumber') && currentProfile.daytimeTelephoneNumber
        ? currentProfile.daytimeTelephoneNumber
        : values.phonenumber;
    setValues({
      firstName: fname,
      lastName: lname,
      emailId: email,
      phonenumber: phone,
      externalId: 'OCC Contact ID',
      subject: 'User Incident',
      incidentSubTypeId: 'Web Contact US form',
      MarketplaceId: '',
      orderNumber: '',
      requestTypeId: count,
      Comment: '',
      AutoShipUpdateActionId: '',
      ShippingInquiryTypeId: '',
      RefundInquiryTypeId: '',
      GeneralInquiryTypeId: '',
      ProductsSelected: '',
      AutoShipCancelReason: ''
    });
  };
  const handleClick = event => {
    const value = 24;
    const requestTypeIds = [
      'AutoShipUpdateActionId',
      'ShippingInquiryTypeId',
      'RefundInquiryTypeId',
      'GeneralInquiryTypeId',
      'RewardsProgram'
    ];
    const selectedValue = requestTypeIds.indexOf(event.target.id);
    if (selectedValue >= 0) {
      resetState(value + selectedValue, values);
      // setValues({...values, requestTypeId: value + selectedValue});
    }
    const errorsObj = errors;
    if (errorsObj.requestTypeId !== undefined) {
      errorsObj.requestTypeId = '';
      setErrors(errorsObj);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [incidentId, setIncidentId] = useState('');
  const replaceProductsNames = () => {
    let prodString = '';
    const ProductsSelected = {
      1: 'OmegaXL',
      8: 'ImmuneXL',
      9: 'VitaminXL B',
      10: 'TurmericXL',
      11: 'ProbioticXL',
      12: 'SleepXL',
      13: 'HeartXL',
      54: 'VitaminXL D3'
    };
    if (values['ProductsSelected'] !== '') {
      const prodValueArray = values['ProductsSelected'].split(',');
      const tempProdArray = [];
      prodValueArray.forEach(val => {
        console.log(ProductsSelected[val]);
        tempProdArray.push(ProductsSelected[val]);
      });
      prodString = tempProdArray.toString();
    }

    return prodString;
  };
  const convertRequestInLookupFormat = () => {
    console.log('values---> ', values);
    const newValue = {};
    const mappingObject = {
      requestTypeId: {
        24: 'Auto-Ship Update',
        25: 'Shipping Status Inquiry',
        26: 'Refund Inquiry',
        27: 'General Inquiry',
        28: 'Rewards Program',
        29: 'Leave a Review'
      },
      AutoShipUpdateActionId: {
        1: 'Skip Next Shipment',
        177: 'Cancel Auto-Ship'
      },
      AutoShipCancelReason: {
        1: 'Arrives too frequently- Too much product',
        137: "Price, can't afford",
        138: 'Doctor request',
        139: 'Not working as expected',
        140: 'Does not want Auto-Ship',
        141: 'Unaware of Autoship',
        142: 'No Reason provided',
        143: 'Deceased, Nursing home, Hospice'
      },
      ShippingInquiryTypeId: {
        1: 'Request Tracking Number',
        173: 'Order Not Received'
      },
      RefundInquiryTypeId: {
        1: 'Refund Request',
        176: 'Refund Status'
      },
      GeneralInquiryTypeId: {
        1: 'Product Questions',
        150: 'Product Feedback',
        151: 'Other'
      },
      MarketplaceId: {
        175: 'Phone Order',
        174: 'OmegaXL.com',
        13: 'eBay',
        1: 'Amazon',
        14: 'Walmart',
        15: 'Other'
      }
    };
    const valueKeys = Object.keys(values);

    valueKeys.forEach(key => {
      const replaceObj = mappingObject[key];
      if (replaceObj !== undefined) {
        console.log('replaceValue--> ', replaceObj[values[key]]);
        newValue[key] = replaceObj[values[key]] !== undefined ? replaceObj[values[key]] : '';
      } else {
        console.log(key);
        newValue[key] = values[key] !== undefined ? values[key] : '';
      }
    });
    newValue['ProductsSelected'] = replaceProductsNames();
    console.log('newValue---> ', newValue);

    return newValue;
  };
  const createIncidance = () => {
    const raw = JSON.stringify({
      Request: convertRequestInLookupFormat()
    });

    action('contactus', raw).then(response => {
      console.log('response in contactus ', response);
      if (response.ok) {
        setOpenModal(true);
        setIncidentId(response.delta.myRepository.myTable.myProperty.data.IncidentResponse.incidentId);
        console.log(response.delta.myRepository.myTable.myProperty.data.IncidentResponse.incidentId);
      } else if (response.error && response.error.errors && response.error.errors.length > 0) {
        console.log('response in error', response);
      }
    });
  };
  const handleSubmit = event => {
    event.preventDefault();
    const newErrors = {};

    // Check for required fields
    if (!values.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }

    if (!values.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }

    if (!values.emailId.trim()) {
      newErrors.emailId = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.emailId)) {
      newErrors.emailId = 'Invalid Email format';
    }

    if (!values.phonenumber.trim()) {
      newErrors.phonenumber = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(values.phonenumber)) {
      newErrors.phonenumber = 'Invalid Phone Number';
    }
    if (values.requestTypeId === '') {
      newErrors.requestTypeId = 'Select one of following. ';
    }

    if (Object.keys(newErrors).length === 0) {
      // Form is valid, submit the data
      console.log(values);
      createIncidance();
    } else {
      // Form has errors, update the state to display error messages
      setErrors(newErrors);
    }
    event.preventDefault();
  };

  const onCancel = () => {
    setOpenModal(false);
  };

  const productList = [
    {value: 1, name: 'OmegaXL'},
    {value: 8, name: 'ImmuneXL'},
    {value: 9, name: 'VitaminXL B Complete'},
    {value: 10, name: 'TurmericXL'},
    {value: 11, name: 'ProbioticXL'},
    {value: 12, name: 'SleepXL'},
    {value: 13, name: 'HeartXL'},
    {value: 54, name: 'VitaminXL'},
    {value: 19, name: 'OmegaXL Sport'}
  ];

  const handleOnBoxChange = value => {
    const tempValues = values;
    let tempProduct = tempValues.ProductsSelected === '' ? [] : tempValues.ProductsSelected.split(',');
    //here we look if your checked item is allready in your array. if so, remove with filter.
    // toggle
    if (tempProduct.includes(value.toString())) {
      const index = tempProduct.indexOf(value.toString());
      if (index > -1) {
        tempProduct.splice(index, 1);
      }
      setValues({...tempValues, ProductsSelected: tempProduct.toString()});
    } else if (tempProduct.some(product => product === value)) {
      tempProduct = tempProduct.filter(product => product !== value);
    } else {
      tempProduct.push(value);
    }

    setValues({...tempValues, ProductsSelected: tempProduct.toString()});
  };
  const isSelected = value => {
    const Product = values.ProductsSelected === '' ? [] : values.ProductsSelected.split(',');
    if (Product.some(product => product === value.toString())) {
      return true;
    }

    return false;
  };
  const showProductsSection = () => {
    let flag = false;
    if (values.requestTypeId === 24 || values.requestTypeId === 27) {
      flag = true;
    }
    if (values.requestTypeId === 26 && values.RefundInquiryTypeId === 1) {
      flag = true;
    }

    return flag;
  };

  return (
    <Styled id="GHWContactUs" css={css}>
      <div className=" GHWContactUs main-cnr">
        <div className="title-section">
          <h4 className="h4">Contact US</h4>
        </div>
        <div className="main-content container-fixed">
          {values ? (
            <form>
              <div className="contact-detail">
                <div className="shipping-info">
                  <div className="form_shipping">
                    <div className="form-field">
                      <input
                        className="form-field__input"
                        type="text"
                        id=""
                        placeholder="&nbsp;"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        disabled={authenticated}
                      />
                      <span className="form-field__label">First Name*</span>
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
                        disabled={authenticated}
                      />
                      <span className="form-field__label">Last Name</span>
                      <span className="focus-bg"></span>
                      {errors.lastName && <span className="error">{errors.lastName}</span>}
                    </div>

                    <div className="form-field">
                      <input
                        className="form-field__input"
                        type="number"
                        id=""
                        placeholder="&nbsp;"
                        name="phonenumber"
                        value={values.phonenumber}
                        onChange={handleChange}
                      />
                      <span className="form-field__label">Phone*</span>
                      <span className="focus-bg"></span>
                      {errors.phonenumber && <span className="error">{errors.phonenumber}</span>}
                    </div>
                    <div className="form-field">
                      <input
                        className="form-field__input"
                        type="text"
                        id=""
                        placeholder="&nbsp;"
                        name="emailId"
                        value={values.emailId}
                        onChange={handleChange}
                        disabled={authenticated}
                      />
                      <span className="form-field__label">Email*</span>
                      <span className="focus-bg"></span>
                      {errors.emailId && <span className="error">{errors.emailId}</span>}
                    </div>
                    <div className="form-field">
                      <input
                        className="form-field__input"
                        type="text"
                        id=""
                        placeholder="&nbsp;"
                        name="orderNumber"
                        value={values.orderNumber}
                        onChange={handleChange}
                      />
                      <span className="form-field__label">Please provide us with your Order # (if applicable)</span>
                      <span className="focus-bg"></span>
                      {values.requestTypeId === 25 ? (
                        <span className="green-label">
                          Please allow up to 14 business days for your order to be delivered.
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="options">
                  <h5 className="h5">Please select from one of the following options.*</h5>
                  {errors.requestTypeId && <span className="error">{errors.requestTypeId}</span>}
                  <div className="input-row">
                    <div
                      className={values.requestTypeId === 24 ? 'input-column active' : 'input-column'}
                      id={'AutoShipUpdateActionId'}
                      onClick={e => handleClick(e)}
                    >
                      <i className="fa-light fa-bags-shopping icon"></i>
                      <h4 className="h4">Manage Auto-ship</h4>
                    </div>
                    <div
                      className={values.requestTypeId === 25 ? 'input-column active' : 'input-column'}
                      id={'ShippingInquiryTypeId'}
                      onClick={e => handleClick(e)}
                    >
                      <i className="fa-light fa-truck-fast icon"></i>
                      <h4 className="h4">Shipping Status Inquiry</h4>
                    </div>
                    <div
                      className={values.requestTypeId === 26 ? 'input-column active' : 'input-column'}
                      id={'RefundInquiryTypeId'}
                      onClick={e => handleClick(e)}
                    >
                      <i className="fa-light fa-comments-dollar icon"></i>
                      <h4 className="h4">Refund Inquiry</h4>
                    </div>
                    <div
                      className={values.requestTypeId === 27 ? 'input-column active' : 'input-column'}
                      id={'GeneralInquiryTypeId'}
                      onClick={e => handleClick(e)}
                    >
                      <i className="fa-light fa-headset icon"></i>
                      <h4 className="h4">General Inquiry</h4>
                    </div>
                    <div
                      className={values.requestTypeId === 28 ? 'input-column active' : 'input-column'}
                      id={'RewardsProgram'}
                      onClick={e => handleClick(e)}
                    >
                      <i className="fa-light fa-medal icon"></i>
                      <h4 className="h4">Rewards Program</h4>
                    </div>
                  </div>
                </div>

                {values.requestTypeId === 24 ? (
                  <div className="select-material">
                    <select
                      id="cars"
                      className="select-text"
                      name="AutoShipUpdateActionId"
                      value={values.AutoShipUpdateActionId}
                      onChange={handleChange}
                    >
                      <option value="">Please select any option</option>
                      <option value="1">Skip Next Shipment</option>
                      <option value="177">Cancel Auto-Ship</option>
                    </select>
                    <span className="select-bar"></span>
                    <label className="select-label">How can we help you with your Auto-Ship?</label>
                  </div>
                ) : null}

                {values.requestTypeId === 24 && values.AutoShipUpdateActionId === 177 ? (
                  <div className="select-material provide">
                    <select
                      id="cars"
                      className="select-text"
                      name="AutoShipCancelReason"
                      value={values.AutoShipCancelReason}
                      onChange={handleChange}
                    >
                      <option value="">Please select any option</option>
                      <option value="1">Arrives too frequently- Too much product</option>
                      <option value="137">Price, can't afford</option>
                      <option value="138">Doctor request</option>
                      <option value="139">Not working as expected</option>
                      <option value="140">Does not want Auto-Ship</option>
                      <option value="141">Unaware of Autoship</option>
                      <option value="142">No Reason provided</option>
                      <option value="143">Deceased, Nursing home, Hospice</option>
                    </select>
                    <span className="select-bar"></span>
                    <label className="select-label">Why would you like to cancel your Auto-Ship?</label>
                  </div>
                ) : null}

                {values.requestTypeId === 25 ? (
                  <div className="select-material">
                    <select
                      id="cars"
                      className="select-text"
                      name="ShippingInquiryTypeId"
                      value={values.ShippingInquiryTypeId}
                      onChange={handleChange}
                    >
                      <option value="">Please select any option</option>
                      <option value="1">Request Tracking Number</option>
                      <option value="173">Order Not Received</option>
                    </select>
                    <span className="select-bar"></span>
                    <label className="select-label">Please chose the reason for your Shipping Status Inquiry.</label>
                  </div>
                ) : null}

                {values.requestTypeId === 26 ? (
                  <div className="select-material provide">
                    <select
                      id="cars"
                      className="select-text"
                      name="RefundInquiryTypeId"
                      value={values.RefundInquiryTypeId}
                      onChange={handleChange}
                    >
                      <option value="">Please select any option</option>
                      <option value="1">Refund Request</option>
                      <option value="176">Refund Status</option>
                    </select>
                    <span className="select-bar"></span>
                    <label className="select-label">
                      Please select from one of the following options for your refund inquiry.
                    </label>
                  </div>
                ) : null}

                {values.requestTypeId === 27 ? (
                  <div className="select-material provide">
                    <select
                      id="cars"
                      className="select-text"
                      name="GeneralInquiryTypeId"
                      value={values.GeneralInquiryTypeId}
                      onChange={handleChange}
                    >
                      <option value="">Please select any option</option>
                      <option value="1">Product Questions</option>
                      <option value="150">Product Feedback</option>
                      <option value="151">Other</option>
                    </select>
                    <span className="select-bar"></span>
                    <label className="select-label">What type of General Inquiry can we assist you with?</label>
                  </div>
                ) : null}

                {showProductsSection() ? (
                  <div className="product-request">
                    <div className="title">Please select the product(s) applicable to this request.</div>
                    <div className="sub-title">(You can select single products if applicable)</div>
                    <div className="checkbox-group">
                      {productList.map(({name, value}, _index) => {
                        return (
                          <label className="label" key={value}>
                            <input
                              type="checkbox"
                              value={value}
                              checked={isSelected(value)}
                              onChange={() => handleOnBoxChange(value)}
                            />
                            <span className="checkmark"></span>
                            {name}
                          </label>
                        );
                      })}
                    </div>
                    <div className="sub-title">
                      Please provide any additional information related to your refund inquiry in the comments box in
                      the next step of this form.
                    </div>
                  </div>
                ) : null}

                {values.requestTypeId === 27 && values.GeneralInquiryTypeId === 150 ? (
                  <div className="select-material provide">
                    <select
                      id="cars"
                      className="select-text"
                      name="MarketplaceId"
                      value={values.MarketplaceId}
                      onChange={handleChange}
                    >
                      <option value="">Please select any option</option>
                      <option value="175">Telephone Order</option>
                      <option value="174">OmegaXL.com</option>
                      <option value="13">eBay.com</option>
                      <option value="1">Amazon.com</option>
                      <option value="14">Walmart.com</option>
                      <option value="15">Other</option>
                    </select>
                    <span className="select-bar"></span>
                    <label className="select-label">Where did you purchase this product?</label>
                  </div>
                ) : null}

                <div className="billing-info">
                  <input type="submit" className="paymentBtn" value="Submit" onClick={handleSubmit} />
                </div>
              </div>
            </form>
          ) : (
            ''
          )}
        </div>
        <div className="livechat-list container-fixed">
          <a href="#" className="livechat">
            <i className="fa-light fa-user-headset icons"></i>
            <h4 className="h4">Live Chat</h4>
          </a>
          <div className="contact-information">
            <div className="contact-list">
              <div className="title">Customer Service for product inquiry </div>
              <div className="num">
                <i className="fa-light fa-phone icon"></i>1-800-601-8749{' '}
              </div>
            </div>
            <div className="contact-list">
              <div className="title">Or</div>
            </div>
            <div className="contact-list">
              <div className="title">Sales to speak about an existing account </div>
              <div className="num">
                <i className="fa-light fa-phone icon"></i>1-800-488-8082{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
      <GHWContactusSubmitSuccess openModal={openModal} onCancel={onCancel} incidentId={incidentId} />
    </Styled>
  );
};

export default connect(getLoggedInData)(GHWContactUs);
