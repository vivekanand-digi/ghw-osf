/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';
import Icon from '@oracle-cx-commerce/react-components/icons';

/**
 * A Drop Down arrow pointing down
 */
const DropdownArrowIcon = props => (
  <Icon viewBox="0 0 512 512" {...props}>
    <path
      d="m508 109c-4-4-11-3-15 1l-237 269-237-269c-4-4-11-5-15-1-5 4-5 11-1 15l245 278c2 2 5 3 8 3 3 0 6-1 8-3l245-278c4-4 4-11-1-15z"
      fill="currentColor"
      stroke = "black"
      stroke-width = "20"
    />
  </Icon>
);

export default DropdownArrowIcon;
