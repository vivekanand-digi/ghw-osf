/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useState, useCallback,useContext} from 'react';
import {ProductContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import Dropdown from '@oracle-cx-commerce/react-components/dropdown';
import {QTY_CONF as config} from '@oracle-cx-commerce/react-components/config';
import PropTypes from 'prop-types';
import css from './quantity.css';

// anonymous func invocation, as it need not be re rendered.
const SELECT_OPTIONS = (() => {
  const options = [];
  for (let count = 1; count < config.DROP_DOWN_QTY_MAX; count++) {
    options.push(
      <option key={count} value={count}>
        {count}
      </option>
    );
  }
  options.push(
    <option key={config.DROP_DOWN_QTY_MAX} value={config.DROP_DOWN_QTY_MAX}>
      {config.DROP_DOWN_QTY_MAX}+
    </option>
  );

  return options;
})();

/**
 * maxLength Check for number input
 * @param  {Event} event
 */
const maxLengthCheck = event => {
  const inputValue = event.target.value;
  if (inputValue && inputValue.length > 3) {
    event.target.value = inputValue.slice(0, 3);
  }
};

/**
 * Renders a generic Quantity Component which can be used in Product Details, Cart and other pages,
 * wherever the Product or Sku Quantity need to be displayed.
 */
const Quantity = ({
  label,
  id = '',
  name = '',
  disabled = false,
  'data-testid': dataTestId = '',
  className = '',
  handleQuantityChanged,
  value
}) => {
  // state
  const [showQtyTextField, setShowQtyTextField] = useState(true);

  /**
   * Handler for quantity changed
   * @param  {Event} event
   */
  const onQuantityChange = useCallback(
    event => {
      const qty = event.target.value ? event.target.value : 1;
      const parsedQty = parseInt(qty, 10);
      if (parsedQty >= config.DROP_DOWN_QTY_MAX && !showQtyTextField) {
        setShowQtyTextField(true);
      }
      if (!isNaN(parsedQty)) {
        handleQuantityChanged(parsedQty);
      }
    },
    [handleQuantityChanged, showQtyTextField]
  );
  const onQuantityIncrease = () => {
    const qty = value + 1;
    const parsedQty = parseInt(qty, 10);
    if (parsedQty >= config.DROP_DOWN_QTY_MAX && !showQtyTextField) {
      setShowQtyTextField(true);
    }
    if (!isNaN(parsedQty)) {
      handleQuantityChanged(parsedQty);
    }
  };
  const onQuantityDecrease = () => {
    let qty = 1;
    if (value > 1) {
      qty = value - 1;
    }
    const parsedQty = parseInt(qty, 10);
    if (parsedQty >= config.DROP_DOWN_QTY_MAX && !showQtyTextField) {
      setShowQtyTextField(true);
    }
    if (!isNaN(parsedQty)) {
      handleQuantityChanged(parsedQty);
    }
  };

  return (
    <Styled id="Quantity" css={css}>
      <div className={`Quantity ${className}`}>
        {!showQtyTextField && (
          <Dropdown
            label={label}
            aria-label={label}
            id={id}
            name={name}
            data-testid={dataTestId}
            disabled={disabled}
            onChange={onQuantityChange}
            className={className}
            value={value}
          >
            {SELECT_OPTIONS}
          </Dropdown>
        )}

        {showQtyTextField && (
          <div className="Quantity__InputWrapper">
            <label htmlFor={id}>{label}</label>
            <input
              type="number"
              id={id}
              name={name}
              data-testid={dataTestId}
              className="Quantity__Textbox"
              value={value}
              onChange={onQuantityChange}
              onInput={maxLengthCheck}
              aria-label={label}
              disabled={disabled}
              min={1}
              max={config.QTY_MAX_TEXT_INPUT}
            />
            <div className="stepper-btn-cnr">
              <button type="button" className="stepper-btn" id="increment-count" onClick={onQuantityIncrease}>
                  <i className="plus-btn"></i>
              </button>

              <button type="button" className="stepper-btn" id="decrement-count" onClick={onQuantityDecrease}>
              <i className="minus-btn"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </Styled>
  );
};

Quantity.propTypes = {
  /**
   * Component label to be displayed
   */
  label: PropTypes.string.isRequired,

  /**
   * ID of element
   */
  id: PropTypes.string,

  /**
   * Class name to be applied to the HTML element.
   */
  className: PropTypes.string,

  /**
   * Function triggered when quantity is changed
   */
  handleQuantityChanged: PropTypes.func.isRequired,

  /**
   * Value of the component
   */
  value: PropTypes.number.isRequired
};

Quantity.defaultProps = {
  className: '',
  id: ''
};

export default React.memo(Quantity);
