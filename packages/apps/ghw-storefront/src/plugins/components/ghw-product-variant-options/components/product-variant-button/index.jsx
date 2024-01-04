/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';

import Styled from '@oracle-cx-commerce/react-components/styled';
import PropTypes from 'prop-types';
import css from './styles.css';

/**
 * Renders variant options in the form of buttons
 *
 * @param {Object} props the function payload
 * @param {number} props.selectedValue the selected value
 * @param {Array} props.options the variant options
 * @param {String} props.optionKey the selected option id
 * @param {String} props.handleVariantOptionChange handler method for button click
 */
const VariantButtons = props => {
  const {selectedValue, options = [], optionKey, handleVariantOptionChange} = props;

  return (
    <Styled id="ProductVariantOptions__Buttons" css={css}>
      <div className="ProductVariantOptions__Buttons">
        {options.map(({name, value, disabled = false}) => {
          return (
            <span key={`${optionKey}-${name}`} className="ProductVariantOptions__ButtonWrapper">
              <button
                type="button"
                className="ProductVariantOptions__Button"
                data-testid={name}
                aria-pressed={selectedValue === value}
                onClick={() => handleVariantOptionChange(value, optionKey)}
                disabled={disabled}
              >
                {name}
              </button>
            </span>
          );
        })}
      </div>
    </Styled>
  );
};

VariantButtons.propTypes = {
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

VariantButtons.defaultProps = {
  options: []
};

export default React.memo(VariantButtons);
