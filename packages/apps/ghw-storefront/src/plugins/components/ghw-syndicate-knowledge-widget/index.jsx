import React, {useContext, useEffect} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';

/*
 * Uncomment the following line to get the parameter substitution
 * function, e.g. t(someParameterizedResourceString, "someValue").
 */
import {t} from '@oracle-cx-commerce/utils/generic';

import css from './styles.css';

const GHWSyndicateKnowledgeWidget = props => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://ghw--tst2.widget.custhelp.com/euf/rightnow/RightNow.Client.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('This will run after 1 second!');
      window.RightNow.Client.Controller.addComponent(
        {
          display_answers_in_overlay: true,
          number_answers: 100,
          div_id: 'myDiv',
          instance_id: 'skw_0',
          module: 'KnowledgeSyndication',
          type: 3
        },
        'https://ghw--tst2.widget.custhelp.com/ci/ws/get'
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Styled id="GHWSyndicateKnowledgeWidget" css={css}>
      <div className="main-cnr">
        <div className="faq-title">
        Frequently Asked Questions
        </div>
        <div id="myDiv"></div>
        </div>
    </Styled>
  );
};

export default GHWSyndicateKnowledgeWidget;
