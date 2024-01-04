import React from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import { t } from "@oracle-cx-commerce/utils/generic";

import css from "./styles.css";

const Softclouds = (props) => {
  return (
    <Styled id="Softclouds" css={css}>
    <div style={{ backgroundColor: '#f4f4f4'}}>
      <p>URL dump (for internal purposes only)</p>
      <h1>Pages</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ margin: '10px' }}>
          <a href="helen-rodriguez" >Helen Rodríguez</a>
        </li>
        <li style={{ margin: '10px' }}>
          <a href="john-walsh" >John Walsh</a>
        </li>
        <li style={{ margin: '10px' }}>
          <a href="javier-romero" >Javier Romero</a>
        </li>
        <li style={{ margin: '10px' }}>
          <a href="ana-maria-polo" >Ana María Polo</a>
        </li>
        <li style={{ margin: '10px' }}>
          <a href="bob-circosta" >Bob Circosta</a>
        </li>
        <li style={{ margin: '10px' }}>
          <a href="celebrity-health-secrets" >Celebrity Health Secrets</a>
        </li>
        <li style={{ margin: '10px' }}>
          <a href="piolin" >Piolin</a>
        </li>
      </ul>
    </div>
    </Styled>
  );
};

export default Softclouds;
