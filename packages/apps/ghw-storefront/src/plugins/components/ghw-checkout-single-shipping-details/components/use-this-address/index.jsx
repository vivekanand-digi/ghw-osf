/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import PropTypes from 'prop-types';

/**
 * Component to display a button on address card to use it as shipping address.
 * @param {Object} props The properties object
 * @memberof Components
 * @class UseThisAddress
 * @category Component-list
 * @param {String} textUseThisAddress - Text specifying to use this address
 * @param {String} selectThisAddress - Text specifying to select this address
 * @param {String} addressId - Address id
 * @author Oracle
 */
const UseThisAddress = props => {
  // resources
  const {textUseThisAddress} = props;
  const {selectThisAddress, addressId} = props;

  return (
    <Styled id="UseThisAddress" css={css}>
      <div className="UseThisAddress__ButtonContainer">
        <button
          type="button"
          onClick={() => selectThisAddress(addressId)}
          className="UseThisAddress__Button"
          aria-label={`${textUseThisAddress}`}
        >
          {textUseThisAddress}
        </button>
      </div>
    </Styled>
  );
};

UseThisAddress.propTypes = {
  /** Address id */
  addressId: PropTypes.string.isRequired,

  /** Callback function to handle selection of address */
  selectThisAddress: PropTypes.func.isRequired
};

UseThisAddress.defaultProps = {};

export default React.memo(UseThisAddress);
