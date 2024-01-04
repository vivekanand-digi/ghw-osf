/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {useEffect, useRef} from 'react';
import Modal from '@oracle-cx-commerce/react-components/modal';
import Popover from '@oracle-cx-commerce/react-components/popover';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {noop} from '@oracle-cx-commerce/utils/generic';
import css from './styles.css';

/**
 * Displays the GHWProfileDetailsForm component
 */
const GHWProfileUpdateSuccess = props => {
  const {openModal = false, onCancel = noop} = props;

  return (
    <Styled id="GHWProfileUpdateSuccessModal" >
      <div className="GHWProfileUpdateSuccessModal">
        <Modal show={openModal} onClose={onCancel}>
          <div className="popup" id="popup">
            <h4 className="h4">Password saved successfully, please login again.</h4> </div>
        </Modal>
      </div>
    </Styled>
  );
};

export default GHWProfileUpdateSuccess;
