/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import { CartContext } from "@oracle-cx-commerce/react-ui/contexts";
import React, { useState } from "react";
import Styled from "@oracle-cx-commerce/react-components/styled";
import css from "./mini-cart-popover-desktop.css";
import Modal from "../../../ghw-modal";
import GHWMiniCartDetails from "../../../ghw-mini-cart-details";
import { MiniCartSubTotal } from "../mini-cart-components";
import CartOrderSummary from "@oracle-cx-commerce/react-widgets/cart/cart-order-summary/component";

// import GHWCartRelatedProducts from '../../../ghw-cart-related-products';

const MiniCartPopover = (props) => {
  const [cartStatus, setCartStatus] = useState({
    isCartInValid: false,
    hasOutOfStockItems: false,
    hasInactiveItems: false,
  });
  const { currentOrder } = props;
  console.log(
    "mini-card MiniCartPopover--> ",
    props.miniCartItemsBeforeScrolling
  );
  const {
    closeLinkAltText,
    headingYourCart,
    miniCartState,
    cssOverride,
    headingCart,
    headingCartEmpty,
    closeMiniCart,
  } = props;

  const { showMiniCart } = miniCartState;

  return (
    <Styled id="MiniCartDesktop__Popover" css={css}>
      <div className="MiniCartDesktop__Popover">
        <Modal
          cssOverride={cssOverride}
          show={showMiniCart}
          onClose={closeMiniCart}
          closeIconTitle={closeLinkAltText}
          closeArialLabel={closeLinkAltText}
          title={headingYourCart}
          onMouseLeave={closeMiniCart}
          cssWrapper="GHWModal_Wrapper_Minicart"
        >
          
          {!currentOrder.numberOfItems ? (
            <div className="empty-cart-cnr">
              <div className="empty-img"></div>
              <div className="empty-msg">{headingCartEmpty}</div>
              <div className="action-btn-cnr">
                <a
                  href="/home"
                  className="continue-shopping btn md-custom secondary-btn"
                >
                  <img src="/file/general/cart-bag.svg" alt="Shopping icon" />
                  Start Shopping
                </a>
              </div>
            </div>
          ) : null}

          <div className="MiniCartDesktop__Popover__Body">
            <CartContext.Provider value={{ cartStatus, setCartStatus }}>
              <GHWMiniCartDetails
                MiniCartSubTotal={MiniCartSubTotal}
                {...props}
              />
            </CartContext.Provider>
          </div>
        </Modal>
      </div>
    </Styled>
  );
};

export default React.memo(MiniCartPopover);
