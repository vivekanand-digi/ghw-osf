/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import Link from "@oracle-cx-commerce/react-components/link";
import React, {useContext} from 'react';
import { connect } from "@oracle-cx-commerce/react-components/provider";
import { getPage } from "@oracle-cx-commerce/commerce-utils/selector";
import Styled from "@oracle-cx-commerce/react-components/styled";
import css from "./styles.css";

/**
 * A component for listing navigation breadcrumbs.
 * GHWNavigationBreadcrumbs are applied to all pages except product, collections and search results pages.
 */
const GHWNavigationBreadcrumbs = (props) => {
 
  /**
   * viewedPagesNameAndURL has the data from the widget configuration
   */
  const { viewedPagesNameAndURL = "[]", breadcrumbSeparator } = props;
  let currentPageName = props.displayName || "";
  currentPageName = currentPageName.trim();
  const viewedPageLinks = JSON.parse(viewedPagesNameAndURL.replace(/'/g, '"'));

  // const productName = useRef(null);
  // useEffect(() => {
  //   productName.current.innerHTML = longDescription;
  // }, [])


  return (
    <Styled id="GHWNavigationBreadcrumbs" css={css}>
      <div className="GHWNavigationBreadcrumbs">
        {viewedPageLinks.map((item, index, items) => {
          return (
            <span key={item["0"]}>
              <Link
                href={item["1"]}
                className="GHWNavigationBreadcrumbs__BreadcrumbItem"
              >
                {props[item["0"]] ? props[item["0"]] : item["0"]}
              </Link>
              {/*  Don't show breadcrumbSeparator if there is no data in  currentPageName */}
              {!(items.length - 1 === index && currentPageName === "") && (
                <span className="GHWNavigationBreadcrumbs__Seperator">
                  {breadcrumbSeparator}
                </span>
              )}
            </span>
          );
        })}
        <span className={`GHWNavigationBreadcrumbs__BreadcrumbItem--disable`}>
          {currentPageName === 'Product' ? 'Products ' : currentPageName}
        </span>
        {currentPageName === 'Product' ? <span className={`GHWNavigationBreadcrumbs__BreadcrumbItem`}>&nbsp;/ {props.title}</span> :''}
        

       </div>
    </Styled>
  );
};

export default connect(getPage)(GHWNavigationBreadcrumbs);
