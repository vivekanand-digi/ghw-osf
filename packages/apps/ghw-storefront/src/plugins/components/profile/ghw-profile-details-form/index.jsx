import React, { useContext, useState } from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import { StoreContext } from '@oracle-cx-commerce/react-ui/contexts';
import { PAGE_PROFILE_LINK } from '@oracle-cx-commerce/commerce-utils/constants';
import css from './styles.css';

import GHWProfileDetailsFormSuccess from './components';

const GHWProfileDetailsForm = (props) => {
  const { currentProfileDetails, setCurrentProfileDetails } = props;
  const store = useContext(StoreContext);
    const [errors, setErrors] = useState({});
  const [openModal, setOpenModal] = useState(false);
  

  const editableProfileValues = (event) => {
    const { id, value } = event.target;

    // Check if the entered value is a valid number
    if (id === 'daytimeTelephoneNumber' && !(/^\d*$/).test(value)) {
      return;
    }

    const prop = {};
    prop[id] = value;
    setCurrentProfileDetails({ ...currentProfileDetails, ...prop });
  };

  const cancelSave = () => {
    console.log("cancel");
    window.location.reload();
  };

  const onCancel  = () => {
    setOpenModal(false);
  };

   const updateProfileDetails = async () => {
    
    const newErrors = {};
    try {
      if (currentProfileDetails) {
        const phoneNumberRegex = /^\d{10}$/;

        if (!phoneNumberRegex.test(currentProfileDetails.daytimeTelephoneNumber)) {
          newErrors.phonenumber = 'Invalid Phone Number';
          setErrors(newErrors);
          return;
        }
        setErrors({});

        const profilePayload = {
          firstName: currentProfileDetails.firstName,
          lastName: currentProfileDetails.lastName,
          daytimeTelephoneNumber: currentProfileDetails.daytimeTelephoneNumber,
        };

        // Use try-catch to handle errors without triggering a page refresh
        const res = await store.endpoint('updateProfile', profilePayload);
        // Handle success or additional logic here
      }
    } catch (error) {
      // Handle the error without triggering a page refresh
      console.error('Error updating profile:', error);
      newErrors.general = 'An error occurred while updating the profile.';
      setErrors(newErrors);
    }
    setOpenModal(true);
  };

  return (
    <Styled id="GHWProfileDetailsForm" css={css}>
      {currentProfileDetails && (
        <div className="GHWProfileDetailsForm h-tab_content">
          <div id="vtab1" className="v-tab_content">
            <div className="contact-detail">
              <div className="profile-info">
                <div className="profile-form">
                  <div className="form-field">
                    <input
                      className="form-field__input"
                      type="text"
                      id="firstName"
                      placeholder="&nbsp;"
                      value={currentProfileDetails.firstName || ''}
                      onChange={e => {
                        editableProfileValues(e);
                      }}
                    />
                    <span className="form-field__label">First Name</span>
                    <span className="focus-bg"></span>
                  </div>

                  <div className="form-field">
                    <input
                      className="form-field__input"
                      type="text"
                      id="lastName"
                      placeholder="&nbsp;"
                      value={currentProfileDetails.lastName || ''}
                      onChange={e => {
                        editableProfileValues(e);
                      }}
                    />
                    <span className="form-field__label">Last Name</span>
                    <span className="focus-bg"></span>
                  </div>

                  <div className="form-field">
                    <input
                      className="form-field__input"
                      type="text"
                      disabled
                      id=""
                      placeholder="&nbsp;"
                      value={currentProfileDetails.email}
                    />
                    <span className="form-field__label">Email</span>
                    <span className="focus-bg"></span>
                  </div>
                  <div className="form-field">
                    <input
                      className="form-field__input"
                      type="text"
                      id="daytimeTelephoneNumber"
                      placeholder="&nbsp;"
                      value={currentProfileDetails.daytimeTelephoneNumber || ''}
                      onChange={(e) => {
                        editableProfileValues(e);
                      }}
                    />
                    <span className="form-field__label">Mobile</span>
                    <span className="focus-bg"></span>
                    {errors.phonenumber && (
                      <span className="error">{errors.phonenumber}</span>
                    )}
                  </div>
                  <div className="form-field">
                    <button  className="loginBtn primary-btn" onClick={updateProfileDetails}>
                      Save
                    </button>
                    <button className="loginBtn" onClick={cancelSave}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <GHWProfileDetailsFormSuccess openModal={openModal} onCancel={onCancel}/>
    </Styled>
  );
};

export default GHWProfileDetailsForm;
