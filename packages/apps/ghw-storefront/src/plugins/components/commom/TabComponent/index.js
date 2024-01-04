import React, {useState, useEffect} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {noop} from '@oracle-cx-commerce/utils/generic';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import {TabContext} from './context';
import css from './styles.css';

/**
 * Renders HTML Select element by taking Options as children.
 */

const TabComponent = props => {
  const {
    tabLabelOne = '',
    tabLabelTwo = '',
    tabComponentOne = noop,
    tabComponentTwo = noop,
    onTabChange = noop,
    tabHeadings = [],
    tabContent = [],
    initialActiveTab = 'tab1',
    route
  } = props;
  const [selectedTab, setSelectedTab] = useState(initialActiveTab);
  const goToPage = useNavigator();
  const tabSwitch = (e, selectedTabSwitch) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedTab(selectedTabSwitch);
    onTabChange(selectedTabSwitch);
  };
  useEffect(() => {
    if (route === '/order-history' || route === '/Subscription') {
      setSelectedTab('tab2');
    } else {
      setSelectedTab('tab1');
    }
  }, [route]);
  const contextValue = {tabSwitch};

  const tab1ClassName = selectedTab === 'tab1' ? ' TabBorderBottom' : '';
  const tab2ClassName = selectedTab === 'tab2' ? ' TabBorderBottom' : '';

  const renderingActivetab = () => {
    return selectedTab === 'tab1' ? (
      <div className="RC-MyOrderHistory Tab-Wrapper Tab1 active" id="My-Orders" data-testid="My-Orders-Tab">
        {tabComponentOne()}
      </div>
    ) : (
      <div
        className="RC-AccountOrderHistory Tab-Wrapper Tab2 active"
        id="Account-Orders"
        data-testid="Account-Orders-Tab"
      >
        {tabComponentTwo()}
      </div>
    );
  };

  return (
    <TabContext.Provider value={contextValue}>
      <Styled id="_RCTabComponent" css={css}>
        <div className={`TabComponent`}>
          {tabHeadings.length > 0 ? (
            <>
              <div className="TabHeader">
                {tabHeadings.map((tabLabel, index) => {
                  return (
                    <div
                      aria-hidden="true"
                      key={`TabHeader-${index + 1}`}
                      className={`TabButton Tab${index + 1}${
                        selectedTab === `tab${index + 1}` ? ' TabBorderBottom' : ''
                      }`}
                      onClick={e => {
                        tabSwitch(e, `tab${index + 1}`);
                      }}
                    >
                      <h4>{tabLabel}</h4>
                    </div>
                  );
                })}
              </div>
              <div className="TabContent">
                {tabHeadings.map((tabLabel, index) => {
                  const tabsClassName = selectedTab === `tab${index + 1}` ? ' active' : '';

                  return (
                    <div key={`TabContent-${index + 1}`} className={`Tab-Wrapper Tab${index + 1}${tabsClassName}`}>
                      {tabContent[index]}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="TabHeader">
                {tabLabelOne && (
                  <a
                    role="button"
                    data-testid="My-Orders"
                    href="order-history#My-Orders"
                    className={`TabButton${tab1ClassName}`}
                    onClick={e => {
                      tabSwitch(e, 'tab1');
                    }}
                  >
                    <h4>{tabLabelOne}</h4>
                  </a>
                )}

                {tabLabelTwo && (
                  <a
                    role="button"
                    data-testid="Account-Orders"
                    aria-label="Account-Orders"
                    href="order-history#Account-Orders"
                    className={`TabButton${tab2ClassName}`}
                    onClick={e => {
                      tabSwitch(e, 'tab2');
                    }}
                  >
                    <h4>{tabLabelTwo}</h4>
                  </a>
                )}
              </div>
              <div className="TabContent">{renderingActivetab()}</div>
            </>
          )}
        </div>
      </Styled>
    </TabContext.Provider>
  );
};

export default React.memo(TabComponent);
