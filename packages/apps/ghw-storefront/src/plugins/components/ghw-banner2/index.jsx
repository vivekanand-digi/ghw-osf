import React, { useContext } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
import PropTypes from 'prop-types';
import Image from '@oracle-cx-commerce/react-widgets/common/image/component';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./styles.css";

const GHWBanner2 = (props) => {
  const {title = {}, subtitle = {}, subtitle2 = {}, backgroundImg = {}, subtitle3 = {} } = props;
  console.log("arpit : ",title);
  console.log("arpit : ",backgroundImg);
  return (
    <Styled id="GHWBanner2" css={css}>
      {/* <div className="quotes-sec">
        <a href="/product/OXL0005" class="shop-now-btn">SHOP NOW<span class="arrow">&gt;</span></a>
      </div> */}
    
      {/* <section className="quotes" style={{ background: `url(${backgroundImg})` }}> */}
      <section className="quotes" >
      <div class="container-fixed celeb-short-banner">
					<div class="bnr-content">
          <div class="title">{title}</div>          
          <div class="sub-title">{subtitle}</div>	
          {/* <div class="sub-title">{subtitle2}</div>						 */}
						<a href="/product/OXL0005" class="shop-now-btn">SHOP NOW<span class="arrow">&gt;</span></a>
            {/* <div class="sub-title">{subtitle3}</div> */}
					</div>
				</div>

			</section>
    </Styled>
  );
};

GHWBanner2.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  subtitle2: PropTypes.string,
  subtitle3: PropTypes.string,
  backgroundImg: PropTypes.string
}

GHWBanner2.defaultProps = {
  'title': '',
  'subtitle': '', 
  'subtitle2': '', 
  'subtitle3': '',  
  'backgroundImg': ''
};

export default GHWBanner2;
