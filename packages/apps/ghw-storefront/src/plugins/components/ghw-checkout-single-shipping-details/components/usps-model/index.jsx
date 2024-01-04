/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {Suspense, useContext} from 'react';

import Modal from '@oracle-cx-commerce/react-components/modal';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {isEmptyObject, noop} from '@oracle-cx-commerce/utils/generic';
import {formToJson} from '@oracle-cx-commerce/react-components/utils';
import PropTypes from 'prop-types';
import css from './usps-model.css';

const USPSModel = props => {
  const {
    openModal = false,
    title = '',
    onCancel = noop,
    closeLinkAltText = '',
    onSubmit = noop,
    localAddress = {},
    suggestedAddress = {}
  } = props;

  const getSuggestedAddress = () => {
    if (isEmptyObject(suggestedAddress)) {
      return;
    }
    const mappedData = Object.entries(suggestedAddress).map(([key, person]) => {
      if (key === 'localAddress') {
        return;
      }

      return (
        <div className="radio form-group" key={key}>
          <input type="radio" id={key} name="selectedAddress" value={key}  className='form-radio' />
          <label htmlFor={key} className='form-label'>
            {person.address1}, {person.city}, {person.state} {person.postalCode}, {person.country}
          </label>
        </div>
      );
    });
    if (isEmptyObject(mappedData)) {
      return <p>No Suggestion for this Address.</p>;
    }

    return mappedData;
  };
  const getLocalAddress = () => {
    if (suggestedAddress.hasOwnProperty('localAddress')) {
      return (
        <div className="radio form-group" key="localAddress">
          <input type="radio" id="localAddress" className='form-radio' name="selectedAddress" value="localAddress" checked={true} />
          <label htmlFor="localAddress" className='form-label'>
            {suggestedAddress.localAddress.address1}, {suggestedAddress.localAddress.city},{' '}
            {suggestedAddress.localAddress.state} {suggestedAddress.localAddress.postalCode},{' '}
            {suggestedAddress.localAddress.country}
          </label>
        </div>
      );
    }
  };

  const onSubmitForm = event => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.target;
    const formData = formToJson(form);
    onSubmit(formData);

    return false;
  };

  return (
    <Styled id="USPSModel" css={css}>
      <div className="USPSModel">
        {typeof window !== 'undefined' && (
          <Modal
            show={openModal}
            onClose={onCancel}
            closeIconTitle={closeLinkAltText}
            closeAriaLabel={closeLinkAltText}
            title={title}
            className='address-valdiate'
          >
            <div aria-live="polite" className='usps-cnr'>
              <div className="container">
                <p className="para note">Please Select The Most Accurate Address from The list Bellow</p>
                <form onSubmit={onSubmitForm} noValidate className='radio-option-cnr'>
                  <div className='row-address'>
                    <h4 className="h4">Suggested Address</h4>
                    {getSuggestedAddress()}
                  </div>
                  <div className='row-address'>
                  <h4 className="h4 current-addr">Use Current Address</h4>
                  {getLocalAddress()}
                  </div>
                  <button type="submit" className="btn">
                    Continue Payment with Selected Address
                  </button>
                </form>
              </div>

              <div className='dis-note'>
                <p className="para">Any sales tax ultimately charged to your credit card will be calculated when your credit card charge is authorized and will reflect applicable state and local taxes.</p>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Styled>
  );
};

USPSModel.propTypes = {
  /** Callback function to be invoked to reset the value of wish lists data */
  setFetchingData: PropTypes.func,
  /** The flag to indicate whether to show the modal or not*/
  openModal: PropTypes.bool,
  /** The title of the modal in the UI */
  title: PropTypes.string,
  /** Callback function to be invoked when create/edit wish list fails */
  onCancel: PropTypes.func.isRequired
};

USPSModel.defaultProps = {
  openModal: false,
  title: '',
  setFetchingData: undefined
};

export default USPSModel;
