import React, {useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';

const GHWPaypalButton = props => {
  return (
    <Styled id="GHWPaypalButton" css={css}>
      <div className="GHWPaypalButton"> Base Component GHWPaypalButton: {t('Hello')}</div>
    </Styled>
  );
};

export default GHWPaypalButton;
