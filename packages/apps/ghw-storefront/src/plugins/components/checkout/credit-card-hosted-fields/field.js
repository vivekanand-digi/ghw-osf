import React from 'react';
import PropTypes from 'prop-types';

const Field = ({label, id, invalid}) => {
  return (
    <div
      className={`CreditCardHostedFields__FieldGroup${invalid ? ' CreditCardHostedFields__FieldGroup--invalid' : ''}`}
    >
      <label className={`CreditCardHostedFields__Label`} htmlFor={id}>
        {label}
      </label>
      <div id={id} className="CreditCardHostedFields__Field"></div>
      {/* {invalid && <small>{invalid}</small>} */}
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  invalid: PropTypes.bool
};

export default Field;
