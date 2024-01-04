/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, { useEffect, useRef } from "react";

import Portal from '@oracle-cx-commerce/react-components/portal';
import Styled from '@oracle-cx-commerce/react-components/styled';
import TimesIcon from '@oracle-cx-commerce/react-components/icons/times';
import {noop} from '@oracle-cx-commerce/utils/generic';
import PropTypes from 'prop-types';
import css from './ghw-modal.css';

/**
 * Displays the MTMModal component
 */
const MTMModal = ({
  onClose = noop,
  onClick = noop,
  show = false,
  accessKey = "",
  children = "",
  title = "",
  className = "",
  cssWrapper = "",
  cssOverride = "",
  closeArialLabel = "",
  closeIconTitle = "",
  setCloseRef,
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

  return (
    <Portal>
      <Styled id="MTMModal" css={css}>
        {show && (
          <div className={`MTMModal MTMModal__Open ${className}`}>
            <div
              className="MTMModal__Backdrop"
              data-testid="MTMModalBackdrop"
              onClick={onClose}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === "Esc" ||
                  event.key === "Escape"
                ) {
                  onClick();
                }
              }}
              role="button"
              tabIndex="-1"
              aria-label={closeArialLabel}
            ></div>
            <div className={`MTMModal_Wrapper ${cssWrapper}`}>
              <div className="MTMModal__Header">
                <section className="my-cart">
                  <span className="MTMModal__HeaderText h1">My Cart</span>
                  <div className="close-icon">
                    <span
                      accessKey={accessKey}
                      role="button"
                      onClick={onClose}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === "Esc" ||
                          event.key === "Escape"
                        ) {
                          event.preventDefault();
                          onClick();
                        }
                      }}
                      className="MTMModal__Close"
                      data-testid="closeButton"
                      ref={closeRef}
                      aria-label={closeArialLabel}
                    >
                      <img src="/file/general/close-icon.svg" alt="Close" />
                    </span>
                  </div>
                </section>
              </div>
              <div className={`MTMModal__Body ${cssOverride}`}>{children}</div>
            </div>
          </div>
        )}
      </Styled>
    </Portal>
  );
};

MTMModal.propTypes = {
  /**
   * Function to be triggered on close
   */
  onClose: PropTypes.func,

  /**
   * Whether to show MTMModal or not
   */
  show: PropTypes.bool,

  /**
   * Child nodes to by displayed
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),

  /**
   * MTMModal title
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

  /**
   * Class name to be applied to the HTML element.
   */
  className: PropTypes.string,

  /**
   * Class name to be applied to the Popup element.
   */
  cssWrapper: PropTypes.string,

  /**
   * accessKey to be applied to the HTML element.
   */
  accessKey: PropTypes.string,

  /**
   * Overrides(if any) to the MTMModal style
   */
  cssOverride: PropTypes.string,

  /**
   * Title of the cross component
   */
  closeIconTitle: PropTypes.string,
};

MTMModal.defaultProps = {
  onClose: noop,
  show: false,
  accessKey: "",
  children: "",
  title: "",
  className: "",
  cssWrapper: "",
  cssOverride: "",
  closeIconTitle: "",
};

export default React.memo(MTMModal);
