import React, {useCallback, useEffect, useState, useContext} from 'react';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Modal from '@oracle-cx-commerce/react-components/modal';
import {isMobile} from '@oracle-cx-commerce/commerce-utils/selector';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {noop} from '@oracle-cx-commerce/utils/generic';
import ProductImagePanel from './components/product-image-panel';
import css from './ghw-product-image-viewer.css';
import {useComponentData} from './selectors';

/**
 * Product Image component. Gathers image data and renders a ProductImageSlider component.
 */
const GHWProductImageViewer = props => {
  // selector
  const {primaryImageTitle, activeImages, thumbImages} = useComponentData();
  const mobile = isMobile(useContext(StoreContext).getState());

  // state
  const [portalRendered, setPortalRendered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [portalOpenedOnce, setPortalOpenedOnce] = useState(false);

  const {closeLinkAltText, cssOverride} = props;
  portalRendered && !portalOpenedOnce && setPortalOpenedOnce(true);

  /**
   * Handler for clicking close
   */
  const closePortal = useCallback(() => {
    setPortalRendered(false);
  }, []);

  /**
   * When a different Sku is selected, reset the slider Images index to zero
   */
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeImages]);

  return (
    <Styled id="GHWProductImageViewer" css={css}>
      <div className="GHWProductImageViewer">
        <ProductImagePanel
          primaryImageTitle={primaryImageTitle}
          images={activeImages}
          thumbs={thumbImages}
          portalRendered={portalRendered}
          setPortalRenderedCallback={setPortalRendered}
          showExpand={true}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          mobile={mobile}
          {...props}
        />

        <Modal
          cssOverride={cssOverride}
          className="GHWProductImageViewer__Modal"
          // show={portalRendered}
          show={false}
          onClose={closePortal}
          closeIconTitle={closeLinkAltText}
          closeAriaLabel={closeLinkAltText}
        >
          {portalOpenedOnce && (
            <ProductImagePanel
              primaryImageTitle={primaryImageTitle}
              images={activeImages}
              thumbs={thumbImages}
              portalRendered={portalRendered}
              setPortalRenderedCallback={noop}
              showExpand={false}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              mobile={mobile}
              {...props}
            />
          )}
        </Modal>
      </div>
    </Styled>
  );
};

export default GHWProductImageViewer;
