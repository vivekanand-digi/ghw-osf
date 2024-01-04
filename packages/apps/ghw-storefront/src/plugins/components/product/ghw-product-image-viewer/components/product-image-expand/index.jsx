/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import ExpandArrowsAltIcon from '@oracle-cx-commerce/react-components/icons/expand-arrows-alt';
import PropTypes from 'prop-types';
import css from './styles.css';

const ProductImageExpand = props => {
  const {labelExpand, setPortalRenderedCallback, portalRendered} = props;

  return (
    <Styled id="ProductImageViewer__ImageExpand" css={css}>
      <div className="ProductImageViewer__ImageExpand">
        <button
          id="Expand"
          aria-label={labelExpand}
          onClick={() => setPortalRenderedCallback && setPortalRenderedCallback(!portalRendered)}
          type="button"
        >
          <ExpandArrowsAltIcon />
        </button>
      </div>
    </Styled>
  );
};

ProductImageExpand.propTypes = {
  /*
   * Boolean to denote if portal is rendered
   */
  portalRendered: PropTypes.bool.isRequired,
  /*
   * Callback function to set portalRendered
   */
  setPortalRenderedCallback: PropTypes.func.isRequired
};

export default React.memo(ProductImageExpand);
