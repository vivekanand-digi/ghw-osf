import React, {useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';

const GHWProductTest = props => {
  return (
    <Styled id="GHWProductTest" css={css}>
      <div className="GHWProductTest"> Base Component GHWProductTest: {t('Hello')}</div>
    </Styled>
  );
};

export default GHWProductTest;
