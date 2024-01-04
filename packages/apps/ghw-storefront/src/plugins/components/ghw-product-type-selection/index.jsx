import React, {useContext} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';

const GHWProductTypeSelection = props => {
  return (
    <Styled id="GHWProductTypeSelection" css={css}>
      <div className="button-group">
        <h4>Size</h4>
        <div className="buttons">
          <div className="quantity active">300ct</div>
          <div className="quantity">60ct</div>
        </div>
      </div>
      <div className="GHWProductTypeSelection">
        <div className="payment-selection">
          <div className="selection">
            <input type="radio" id="hide" name="example" value="standalon" checked />
            <label htmlFor="standalon">one-time purchase </label>
            <div className="amount">$219.95</div>
          </div>
          <div className="selection">
            <input type="radio" id="show" name="example" value="subscrition" />
            <label htmlFor="subscrition">Monthly Auto-Ship Purchase -Modify or cancel at anytime</label>
            <div className="amount">$174.95</div>
          </div>
          <div className="group-btn desktop" id="box">
            <div className="btn active">1 month</div>
            <div className="btn">2 months</div>
            <div className="btn">3 months</div>
          </div>
          <div className="group-btn ipad" id="box">
            <div className="btn active">30 Days</div>
            <div className="btn">60 Days</div>
            <div className="btn">90 Days</div>
          </div>
          <br />
        </div>
      </div>
      <div className="subscription" id="box2">
        <div className="heading">
          <h5>Awesome !</h5>
          <div className="sub">1 Month Subscription Benifits</div>
          <div className="more">(More Benefits)</div>
        </div>
        <div className="list">
          <li>orem ipsum dolor sit amet</li>
          <li>Praesent placerat risus quis eros.</li>
          <li>Praesent placerat risus quis eros</li>
          <li>Fusce pellentesque suscipit nibhs</li>
        </div>
      </div>
    </Styled>
  );
};

export default GHWProductTypeSelection;
