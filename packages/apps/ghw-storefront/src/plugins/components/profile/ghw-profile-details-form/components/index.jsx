/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {useEffect, useRef} from 'react';
import Modal from '@oracle-cx-commerce/react-components/modal';
import Popover from '@oracle-cx-commerce/react-components/popover';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {noop} from '@oracle-cx-commerce/utils/generic';
import css from './modal-message-box.css';

/**
 * Displays the GHWProfileDetailsForm component
 */
const GHWProfileDetailsFormSuccess = props => {
  const {openModal = false, onCancel = noop, incidentId} = props;

  return (
    <Styled id="GHWProfileDetailsFormS" css={css}>
      <div className="GHWProfileDetailsFormS">
        <Modal show={openModal} onClose={onCancel}>
          <div className="popup modal-msg-box" id="popup">
            <h4 className="h4">Changes saved successfully.</h4> </div>
        </Modal>
      </div>
    </Styled>
  );
};

export default GHWProfileDetailsFormSuccess;
