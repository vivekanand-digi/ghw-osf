/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React from 'react';

// Card Types component
const CardTypes = props => {
  const {cardTypes = {}, selectedCardType} = props;

  return (
    <div className="CardTypes">
      {Object.entries(cardTypes).map(([key, {img = {}, name}]) => {
        return (
          <img
            key={key}
            src={img.url}
            alt={name}
            className={`CardTypes__Icon${key !== selectedCardType ? ' CardTypes__Icon--inactive' : ''}`}
          />
        );
      })}
    </div>
  );
};

export default CardTypes;
