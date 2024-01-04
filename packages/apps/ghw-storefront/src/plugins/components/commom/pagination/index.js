/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useContext} from 'react';
import {PaginationContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from '@oracle-cx-commerce/react-widgets/common/pagination/styles.css';
import StandardPagination from '@oracle-cx-commerce/react-components/pagination/standard';
import BasicPagination from '@oracle-cx-commerce/react-components/pagination/basic';
import TextPagination from '@oracle-cx-commerce/react-components/pagination/text';
import DropdownPagination from '@oracle-cx-commerce/react-components/pagination/dropdown';

/**
 * A widget to show pagination UI. Works with different pagination modes supported
 * out of the box. Needs to be provided the `PaginationContext` to work.
 *
 * @param props
 */
const Pagination = ({
  paginationMode = 'basic',
  pagesToShowBesideCurrentPage = 1,
  labelPageOfPages,
  labelPageOfPagesDropdown,
  labelPaginationDropDown,
  labelPreviousPage,
  labelNextPage,
  labelFirstPage,
  labelLastPage
}) => {
  const {currentOffset, limit, totalRecords, pageId, offsetParam, pageParam, onPageChange} =
    useContext(PaginationContext);

  let pagination = null;

  if (paginationMode === 'standard') {
    pagination = (
      <StandardPagination
        currentOffset={currentOffset}
        limit={limit}
        totalRecords={totalRecords}
        pagesToShowBesideCurrentPage={pagesToShowBesideCurrentPage}
        pageId={pageId}
        offsetParam={offsetParam}
        pageParam={pageParam}
        onPageChange={onPageChange}
      />
    );
  } else if (paginationMode === 'basic') {
    pagination = (
      <BasicPagination
        currentOffset={currentOffset}
        limit={limit}
        totalRecords={totalRecords}
        pagesToShowBesideCurrentPage={pagesToShowBesideCurrentPage}
        pageId={pageId}
        offsetParam={offsetParam}
        pageParam={pageParam}
        onPageChange={onPageChange}
        labelPreviousPage={labelPreviousPage}
        labelNextPage={labelNextPage}
        labelFirstPage={labelFirstPage}
        labelLastPage={labelLastPage}
      />
    );
  } else if (paginationMode === 'text') {
    pagination = (
      <TextPagination
        currentOffset={currentOffset}
        limit={limit}
        totalRecords={totalRecords}
        pageId={pageId}
        offsetParam={offsetParam}
        pageParam={pageParam}
        onPageChange={onPageChange}
        labelPreviousPage={labelPreviousPage}
        labelNextPage={labelNextPage}
        labelPageOfPages={labelPageOfPages}
      />
    );
  } else if (paginationMode === 'dropdown') {
    pagination = (
      <DropdownPagination
        currentOffset={currentOffset}
        limit={limit}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        pageParam={pageParam}
        labelPageOfPagesDropdown={labelPageOfPagesDropdown}
        labelPaginationDropDown={labelPaginationDropDown}
      />
    );
  }

  return (
    <Styled id="Pagination" css={css}>
      {pagination}
    </Styled>
  );
};

Pagination.propTypes = {};

export default Pagination;
