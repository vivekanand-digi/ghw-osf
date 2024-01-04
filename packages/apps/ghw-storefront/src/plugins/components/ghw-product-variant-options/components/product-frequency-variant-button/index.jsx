/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

// import React from 'react';
import React, {useContext, useState} from 'react';
import {ProductContext} from '@oracle-cx-commerce/react-ui/contexts';

import Styled from '@oracle-cx-commerce/react-components/styled';
import PropTypes from 'prop-types';
import css from './styles.css';
import FrequencyButton from './frequencyButton';
/**
 * Renders variant options in the form of buttons
 *
 * @param {Object} props the function payload
 * @param {number} props.selectedValue the selected value
 * @param {Array} props.options the variant options
 * @param {String} props.optionKey the selected option id
 * @param {String} props.handleVariantOptionChange handler method for button click
 */
const FrequencyVariantButtons = props => {
  const {selectedValue = null, options = [], optionKey, handleVariantOptionChange, SKUs, childSKUs} = props;
  console.log('selectedvalue  -->', selectedValue);
  console.log('ProductContext---> ', useContext(ProductContext));
  console.log('SKUs--->', childSKUs, SKUs);
  const skuPrice = flag => {
    if (flag === 'One Time' || flag === 'Onetime') {
      const sku = childSKUs[0];

      return SKUs[sku]?.salePrice ? `$${SKUs[sku].salePrice}` : '';
    }

    const sku = childSKUs[1];

    return SKUs[sku]?.salePrice ? `$${SKUs[sku].salePrice}` : '';
  };

  const radioButton = (name, value, disabled, optionKey) => {
    console.log('name, value, disabled ', name, value, disabled);
    if (name === 'One time' || name === 'Onetime') {
      return (
        <>
          <div className="selection">
            <input
              type="radio"
              id="hide"
              name="example"
              value="standalon"
              // checked={selectedValue == null || selectedValue === 0}
              onChange={() => handleVariantOptionChange(value, optionKey)}
              disabled={disabled}
            />
            <label htmlFor="standalon">one-time purchase </label>
            {/* <div className="amount">{skuPrice('One Time')}</div> */}
          </div>
          <hr />
        </>
      );
    }

    return (
      <>
        <div className="selection">
          <input
            type="radio"
            id="show"
            name="example"
            value="subscrition"
            // checked={selectedValue === 1}
            onChange={() => handleVariantOptionChange(value, optionKey)}
            disabled={disabled}
          />
          <label htmlFor="subscrition">Monthly Auto-Ship Purchase -Save Up To 30% Modify or cancel at anytime</label>
          {/* <div className="amount">{skuPrice('Subscribe')}</div> */}
        </div>
        <div className="group-btn desktop" id="box">
          <FrequencyButton selected={'1 Month'} />
        </div>
        <div className="group-btn ipad" id="box">
          <FrequencyButton selected={'1 Month'} />
        </div>
        <br />
      </>
    );
  };

  return (
    <Styled id="payment-selection" css={css}>
      <div id="FrequencyVariantButtons" className="payment-selection">
        {options.map(({name, value, disabled = false}) => {
          return radioButton(name, value, disabled, optionKey);
        })}
      </div>
    </Styled>
  );
};

FrequencyVariantButtons.propTypes = {
  /*
   * Function to handle variant option change.
   */
  handleVariantOptionChange: PropTypes.func.isRequired,
  /*
   * Variant option key.
   */
  optionKey: PropTypes.string.isRequired,
  /*
   * Variant options array.
   */
  options: PropTypes.arrayOf(PropTypes.any),
  /*
   * Selected variant value.
   */
  selectedValue: PropTypes.number.isRequired
};

FrequencyVariantButtons.defaultProps = {
  options: []
};

export default React.memo(FrequencyVariantButtons);
