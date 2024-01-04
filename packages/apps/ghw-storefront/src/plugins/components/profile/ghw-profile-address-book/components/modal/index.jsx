/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {useEffect, useRef} from 'react';

import Portal from '@oracle-cx-commerce/react-components/portal';
import Styled from '@oracle-cx-commerce/react-components/styled';
import TimesIcon from '@oracle-cx-commerce/react-components/icons/times';
import {noop} from '@oracle-cx-commerce/utils/generic';
import PropTypes from 'prop-types';
import {PAGE_ADDRESS_BOOK_LINK} from '@oracle-cx-commerce/commerce-utils/constants';
import {useNavigator} from '@oracle-cx-commerce/react-components/link';
import css from './modal.css';

/**
 * Displays the modal component
 */
const Modal = ({
  onClose = noop,
  show = false,
  children = '',
  title = '',
  className = '',
  cssOverride = '',
  closeAriaLabel = '',
  closeIconTitle = '',
  setCloseRef
}) => {
  const closeRef = useRef(null);
  useEffect(() => {
    if (closeRef.current) {
      if (show) {
        closeRef.current.focus();
      }
      // invoke call back method to set closeRef reference in caller
      if (setCloseRef) {
        setCloseRef(closeRef);
      }
    }
  }, [closeRef, setCloseRef, show, children]);
  const goToPage = useNavigator();

  return (
    <Portal>
      <div className={cssOverride}>
        <Styled id="GHWModal" css={css}>
          {show && (
            <div className={`Modal custom-modal Modal__Open ${className}`}>
              <div
                className="Modal__Backdrop"
                data-testid="modalBackdrop"
                onClick={onClose}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === 'Esc' || event.key === 'Escape') {
                    goToPage(PAGE_ADDRESS_BOOK_LINK);
                  }
                }}
                role="button"
                aria-label={closeAriaLabel}
              ></div>
              <div className="modal-cnr Modal_Wrapper">
                <div className="Modal__Header">
                  <span className="Modal__HeaderText">{title}</span>
                  <span
                    role="button"
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === 'Esc' || event.key === 'Escape') {
                        event.preventDefault();
                        goToPage(PAGE_ADDRESS_BOOK_LINK);
                        if (typeof window !== 'undefined') {
                          window.location.reload();
                        }
                      }
                    }}
                    onClick={e => {
                      goToPage(PAGE_ADDRESS_BOOK_LINK);
                      if (typeof window !== 'undefined') {
                        window.location.reload();
                      }
                    }}
                    className="Modal__Close"
                    data-testid="closeButton"
                    ref={closeRef}
                    aria-label={closeAriaLabel}
                  >
                    <img src="/file/general/close-icon.svg" alt="Close" />
                  </span>
                </div>
                <div className="Modal__Body">{children}</div>
              </div>
            </div>
          )}
        </Styled>
      </div>
    </Portal>
  );
};

Modal.propTypes = {
  /**
   * Function to be triggered on close
   */
  onClose: PropTypes.func,

  /**
   * Whether to show modal or not
   */
  show: PropTypes.bool,

  /**
   * Child nodes to by displayed
   */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),

  /**
   * Modal title
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

  /**
   * Class name to be applied to the HTML element.
   */
  className: PropTypes.string,

  /**
   * Overrides(if any) to the modal style
   */
  cssOverride: PropTypes.string,

  /**
   * Title of the cross component
   */
  closeIconTitle: PropTypes.string
};

Modal.defaultProps = {
  onClose: noop,
  show: false,
  children: '',
  title: '',
  className: '',
  cssOverride: '',
  closeIconTitle: ''
};

export default React.memo(Modal);
