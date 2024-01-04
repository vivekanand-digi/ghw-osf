/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import DropdownArrowIcon from '../mini-dropdown-icon';
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import {noop} from '@oracle-cx-commerce/utils/generic';
import PropTypes from 'prop-types';

/**
 * Renders HTML Select element by taking Options as children.
 */

const Dropdown = ({
  children = '',
  className = '',
  defaultValue,
  id = '',
  'data-testid': dataTestId = '',
  name = '',
  autoComplete = 'off',
  label = '',
  'aria-label': arialLabel = '',
  multiple,
  required,
  disabled,
  iconUrl = '',
  value,
  size,
  onChange = noop,
  onBlur = noop,
  onFocus = noop,
  icon = <DropdownArrowIcon></DropdownArrowIcon>
}) => {
  const isSingleSelect = (!size || size === 1) && !multiple;
  const isSingleSelectWithBackground = isSingleSelect && iconUrl;

  return (
    <Styled id="GHWDropdown" css={css}>
      <div className={`GHWDropdown ${className}`}>
        <label htmlFor={id}>{label}</label>
        <div className="GHWDropdown__Select">
          {/* <div className="GHWDropdown__Icon">{isSingleSelect && icon}</div> */}
          <select
            id={id}
            aria-label={arialLabel}
            disabled={disabled}
            required={required}
            name={name}
            size={size}
            defaultValue={defaultValue}
            data-testid={dataTestId}
            className={`${isSingleSelectWithBackground ? 'GHWDropdown__Select--WithBackgroundIcon' : ''}`}
            style={
              isSingleSelectWithBackground
                ? {
                    backgroundImage: `url('${iconUrl}')`,
                    paddingLeft: `2.5rem`
                  }
                : {}
            }
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            multiple={multiple}
            autoComplete={autoComplete}
          >
            {children}
          </select>
          <span className="validationMessage"></span>
        </div>
      </div>
    </Styled>
  );
};

Dropdown.propTypes = {
  /**
   * Child nodes to by displayed
   */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),

  /**
   * Class name to be applied to the HTML Select element.
   */
  className: PropTypes.string,

  /**
   * ID of select element.
   */
  id: PropTypes.string,

  /**
   * Name of select element.
   */
  name: PropTypes.string,

  /**
   * Allows the browser to provide automated assistance while selecting an option based on the specified type of value.
   */
  autoComplete: PropTypes.string,

  /**
   * Label of the select element.
   */
  label: PropTypes.string,

  /**
   * Specifies that multiple options can be selected at once.
   */
  multiple: PropTypes.bool,

  /**
   * Specifies that the user is required to select a value before submitting the form.
   */
  required: PropTypes.bool,

  /**
   * Specifies that a drop-down list should be disabled.
   */
  disabled: PropTypes.bool,

  /**
   * URL of the background image of the Select element.
   */
  iconUrl: PropTypes.string,

  /**
   * Value of the Select element.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Value of the Select element.
   */
  'data-testid': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Defines the number of visible options in a drop-down list.
   */
  size: PropTypes.number,

  /**
   * onChange event of the Select element and includes the method to be executed when value changed.
   */
  onChange: PropTypes.func,

  /**
   *  onBlur event of the Select element and includes the method to be executed when element loses focus
   */
  onBlur: PropTypes.func,

  /**
   * onFocus event of the Select element and includes the method to be executed when element gets focus.
   */
  onFocus: PropTypes.func
};

Dropdown.defaultProps = {
  children: '',
  className: '',
  id: '',
  size: undefined,
  name: '',
  value: undefined,
  'data-testid': '',
  multiple: undefined,
  required: undefined,
  disabled: undefined,
  autoComplete: 'off',
  label: '',
  iconUrl: '',
  onChange: noop,
  onBlur: noop,
  onFocus: noop
};

export default React.memo(Dropdown);
