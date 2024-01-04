/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {useEffect, useRef} from 'react';
import Modal from '@oracle-cx-commerce/react-components/modal';
import Popover from '@oracle-cx-commerce/react-components/popover';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {noop} from '@oracle-cx-commerce/utils/generic';
// import css from './styles.css';

/**
 * Displays the ghwContactusSubmit component
 */
const GHWContactusSubmitSuccess = props => {
  const {openModal = false, onCancel = noop, incidentId} = props;

  return (
    <Styled id="ghwContactusSubmit">
      <div className="ghwContactusSubmit">
        <Modal show={openModal} onClose={onCancel}>
          <div className="popup" id="popup">
            <div className="image"></div>
            <h4 className="h4">Thank you for your Enquiry</h4>
            <hr />
            <h5 className="h5">We will Get back to u soon !</h5>
            {/* <h5 className="h5">Please note your current incident ID: {incidentId}</h5> */}
          </div>
        </Modal>
      </div>
    </Styled>
  );
};

export default GHWContactusSubmitSuccess;
