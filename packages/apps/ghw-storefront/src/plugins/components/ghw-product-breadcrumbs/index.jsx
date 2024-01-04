/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import Link from '@oracle-cx-commerce/react-components/link';
import PropTypes from 'prop-types';
import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import {t} from '@oracle-cx-commerce/utils/generic';
import css from './styles.css';
import {getPageData} from './selectors';

/**
 * A component for listing navigation breadcrumbs.
 * GHWProductBreadcrumbs are applied to product, collections and search results pages.
 *
 * @param props
 */
const GHWProductBreadcrumbs = props => {
  const {pages, productId, products, categories, breadcrumbSeparator, correctedToAltText, textHome} = props;

  // The symbol used to visually separate breadcrumbs
  const divider = <span> {t(breadcrumbSeparator)} </span>;

  // Find the id of the previous page if it is in the search repository and if so use
  // this information to display breadcrumbs.
  // Strip out slashes to avoid issues with inconsistent slash use.
  const previousPath = pages && typeof history !== 'undefined' && history.state && history.state.previousPath;
  const searchPageId =
    previousPath && Object.keys(pages).find(i => i.replace(/\//g, '').endsWith(previousPath.replace(/\//g, '')));

  if (searchPageId) {
    // Find the breadcrumbs and route for the previous page
    const previousBreadcrumbs = pages[searchPageId] && pages[searchPageId].breadcrumbs;
    let previousPageRoute = previousPath;
    if (previousPageRoute && previousPageRoute.charAt(0) === '/') {
      previousPageRoute = previousPageRoute.substring(1);
    }

    // If searched by text, render search breadcrumbs
    if (previousBreadcrumbs && previousBreadcrumbs.searchCrumbs && previousBreadcrumbs.searchCrumbs.length > 0) {
      return (
        <Styled id="GHWProductBreadcrumbs" css={css}>
          <div className="GHWProductBreadcrumbs">
            <Link className="GHWProductBreadcrumbs__BreadcrumbLink" href=".">
              {t(textHome)}
            </Link>
            {divider}
            {previousBreadcrumbs.searchCrumbs.map(crumbData => (
              <Link
                className="GHWProductBreadcrumbs__BreadcrumbLink"
                href={previousPageRoute}
                key={crumbData.correctedTerms || crumbData.terms}
              >
                <span
                  aria-label={
                    crumbData.correctedTerms &&
                    `${crumbData.terms} ${t(correctedToAltText)} ${crumbData.correctedTerms}`
                  }
                >
                  <span className={crumbData.correctedTerms && 'GHWProductBreadcrumbs__CorrectedLabel'}>
                    &quot;{crumbData.terms}&quot;
                  </span>
                  {crumbData.correctedTerms && <span>&quot;{crumbData.correctedTerms}&quot;</span>}
                </span>
              </Link>
            ))}
          </div>
        </Styled>
      );
    }

    // If previous page was a category page, render category breadcrumbs
    const categoryCrumb =
      previousBreadcrumbs &&
      previousBreadcrumbs.refinementCrumbs &&
      previousBreadcrumbs.refinementCrumbs.find(crumb => crumb.dimensionName === 'product.category');

    if (categoryCrumb && categories) {
      return (
        <Styled id="GHWProductBreadcrumbs" css={css}>
          <div className="GHWProductBreadcrumbs">
            <Link className="GHWProductBreadcrumbs__BreadcrumbLink" href=".">
              {t(textHome)}
            </Link>
            {categoryCrumb.ancestors.map(ancestor => (
              <span key={ancestor.label}>
                {divider}
                <Link
                  className="GHWProductBreadcrumbs__BreadcrumbLink"
                  href={categories[ancestor.properties['dimval.prop.category.repositoryId']].route}
                >
                  {ancestor.label}
                </Link>
              </span>
            ))}
            {divider}
            <Link
              className="GHWProductBreadcrumbs__BreadcrumbLink"
              href={categories[categoryCrumb.properties['dimval.prop.category.repositoryId']].route}
            >
              {categoryCrumb.label}
            </Link>
          </div>
        </Styled>
      );
    }
  }

  // Otherwise, display default parent categories from current product
  const parentCategoryIdPath = products && productId && products[productId] && products[productId].parentCategoryIdPath;
  if (parentCategoryIdPath && categories) {
    const parentCategories = parentCategoryIdPath
      .split('>')
      .filter(i => categories[i])
      .map(i => categories[i]);

    return (
      <Styled id="GHWProductBreadcrumbs" css={css}>
         <div>ac</div>
        <div className="GHWProductBreadcrumbs">
          <Link className="GHWProductBreadcrumbs__BreadcrumbLink" href=".">
            {t(textHome)}
          </Link>
          {parentCategories.map(category => (
            <span key={category.id}>
              {divider}
              <Link className="GHWProductBreadcrumbs__BreadcrumbLink" href={category.route}>
                {category.displayName}
              </Link>
            </span>
          ))}
        </div>
      </Styled>
    );
  }

  return <Styled id="GHWProductBreadcrumbs" css={css} />;
};

GHWProductBreadcrumbs.propTypes = {
  /**
   * The search and refinement breadcrumbs
   */
  breadcrumbs: PropTypes.shape({
    searchCrumbs: PropTypes.arrayOf(PropTypes.shape({})),
    refinementCrumbs: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  /**
   * The application pages, used for determining the breadcrumbs navigated through to reach a product page
   */
  pages: PropTypes.shape({}),
  /**
   * The id of the currently viewed product
   */
  productId: PropTypes.string,
  /**
   * The list of products in the catalog
   */
  products: PropTypes.shape({}),
  /**
   * The list of product categories in the catalog
   */
  categories: PropTypes.shape({}).isRequired,
  /**
   * The string used to separate breadcrumbs labels
   */
  breadcrumbSeparator: PropTypes.string.isRequired,
  /**
   * The resource string used for voice-over to read aloud a misspelled search term
   */
  correctedToAltText: PropTypes.string.isRequired,
  /**
   * The resource string for the Home link
   */
  textHome: PropTypes.string.isRequired
};

GHWProductBreadcrumbs.defaultProps = {
  breadcrumbs: {},
  pages: {},
  productId: '',
  products: {}
};

export default connect(getPageData)(GHWProductBreadcrumbs);
