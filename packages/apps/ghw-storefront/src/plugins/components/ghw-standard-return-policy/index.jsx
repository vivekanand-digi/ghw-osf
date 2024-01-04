import React, {useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import Link from '@oracle-cx-commerce/react-components/link';
/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';

const GHWStandardReturnPolicy = props => {
  const { SRPContent, SRPLink} = props;

  return (
    <Styled id="GHWStandardReturnPolicy" css={css}>
      <div className="GHWStandardReturnPolicy">
      <div className="policy-sec">
        <div className="main-cnr">
            <div className="policy-cnt">
            <div className="policy-left-sec">
                <img src="file/general/auto-ship-money-back-badge.svg" alt=""/>
            </div>
            <div className="policy-right-sec">
                <h2 className="title">Standard Return Policy </h2>               
                <p className="desc">{SRPContent}</p>
                <Link href={SRPLink}>Read More</Link>
            </div>
        </div>
        </div>
    </div>
      </div>

    </Styled>
  );
};

export default GHWStandardReturnPolicy;
