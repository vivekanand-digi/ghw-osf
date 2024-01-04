/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useState} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import CaretRightIcon from '@oracle-cx-commerce/react-components/icons/caret-right';
import CaretDownIcon from '@oracle-cx-commerce/react-components/icons/caret-down';
import css from './styles.css';

export const Accordion = props => {
  const {seletedTabIndex = 0, id = 'accordion', label = '', items, onChange} = props;

  const [selectedIndex, setSelectedIndex] = useState(seletedTabIndex);

  const handleClick = index => {
    setSelectedIndex(index);
    onChange(items[index], index);
  };

  return (
    <Styled css={css} id="Accordion">
      <div id={id} className="Accordion">
        {items.map((option, index) => {
          const isSelected = index === selectedIndex;
          return (
            <div className="Accordion__Container" key={option.label}>
              <div className={`Accordion__Summary`} onClick={() => handleClick(index)}>
                <span>{option.label}</span>
                <span>{!isSelected ? <CaretRightIcon /> : <CaretDownIcon />}</span>
              </div>
              <div className={`Accordion__Content ${isSelected ? 'Accordion__Content--selected' : ''}`}>
                <div className="Accordion__Inner">{option.content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Styled>
  );
};
