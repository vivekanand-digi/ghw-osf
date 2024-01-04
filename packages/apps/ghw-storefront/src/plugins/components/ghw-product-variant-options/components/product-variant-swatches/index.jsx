/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React from 'react';

import Styled from '@oracle-cx-commerce/react-components/styled';
import {noop} from '@oracle-cx-commerce/utils/generic';
import PropTypes from 'prop-types';
import css from './styles.css';

/**
 * Renders single color swatch for option
 *
 * @param {Object} props the function payload
 */
const VariantSwatch = props => {
  const {
    optionKey,
    name,
    value,
    disabled = false,
    selectedValue,
    getSwatchUrl,
    productId,
    unavailableSwatchOverlayImage,
    handleVariantOptionChange,
    colorSwatchShape = 'circular'
  } = props;

  const swatchUrl = getSwatchUrl(productId, name);
  const disabledSwatch = {
    backgroundImage: `url("${unavailableSwatchOverlayImage}"), url("${swatchUrl}")`,
    opacity: 0.6
  };
  const activeSwatch = {
    backgroundImage: `url("${swatchUrl}")`
  };

  return (
    <label
      htmlFor={`${optionKey}-${value}`}
      aria-label={name}
      key={`${optionKey}-${name}`}
      className="ProductVariantOptions__SwatchWrapper"
    >
      <input
        type="radio"
        name={optionKey}
        id={`${optionKey}-${value}`}
        checked={selectedValue === value}
        value={value}
        onChange={noop}
        onClick={event => handleVariantOptionChange(event.target.value, optionKey)}
        disabled={disabled}
      />
      <span
        className={
          colorSwatchShape === 'circular'
            ? 'ProductVariantOptions__SwatchSpan--circular'
            : 'ProductVariantOptions__SwatchSpan'
        }
        aria-label={name}
        style={disabled ? disabledSwatch : activeSwatch}
      />
    </label>
  );
};

/**
 * Renders variant options in the form of color swatches
 *
 * @param {Array} props.options the variant options
 * @param {String} props.optionKey the selected option id
 */
const VariantSwatches = ({options = [], optionKey, ...rest}) => (
  <Styled id="ProductVariantOptions__Swatches" css={css}>
    <div className="ProductVariantOptions__Swatches">
      {options.map(({name, value, disabled = false}) => (
        <VariantSwatch
          key={`${optionKey}_${name}`}
          optionKey={optionKey}
          name={name}
          value={value}
          disabled={disabled}
          {...rest}
        />
      ))}
    </div>
  </Styled>
);

VariantSwatches.propTypes = {
  /*
   * Variant option key.
   */
  optionKey: PropTypes.string.isRequired,
  /*
   * Variant options array.
   */
  options: PropTypes.arrayOf(PropTypes.any).isRequired
};

export default React.memo(VariantSwatches);
