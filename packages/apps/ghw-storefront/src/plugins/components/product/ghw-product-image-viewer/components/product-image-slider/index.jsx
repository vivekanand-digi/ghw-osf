/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import PropTypes from 'prop-types';
import Slide from '../slide';
import ProductImageSliderControls from '../product-image-slider-controls';
import css from './styles.css';
import ImageZoom from '../image-zoom/index';

let debounceTimerId;

/**
 * Create a product image slider component
 */
const ProductImageSlider = props => {
  // variables
  let xDown = null;
  let yDown = null;
  const imageContainer = useRef();

  const {
    images,
    showExpand,
    portalRendered,
    setPortalRenderedCallback,
    primaryImageTitle,
    currentIndex,
    setCurrentImageIndex,
    displayImageZoom,
    mobile,
    lableOpenExpandedView,
    labelRollOverImage
  } = props;

  // state
  const [previousIndex, setPreviousIndex] = useState(0);
  const [translateValue, setTranslateValue] = useState(0);
  const [imageHover, setImageHover] = useState(false);

  const slideWrapperEl = useRef(null);
  const sliderWrapperWidth = () => (slideWrapperEl.current ? slideWrapperEl.current.clientWidth : 0);

  /**
   * Handle touch start
   * @param  {Event} event
   */
  const handleTouchStart = event => {
    const {clientX, clientY} = event.touches[0];

    xDown = clientX;
    yDown = clientY;
  };

  /**
   * Handle touch move
   * @param  {Event} event
   */
  const handleTouchMove = event => {
    if (!xDown || !yDown) {
      return;
    }

    const {clientX, clientY} = event.touches[0];

    const xDiff = xDown - clientX;
    const yDiff = yDown - clientY;

    // x swipe
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 15) {
        setCurrentImageIndex(currentIndex + 1);
      } else if (xDiff < -15) {
        setCurrentImageIndex(currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1);
      }
    }

    // reset values
    xDown = null;
    yDown = null;
  };

  /**
   * Handle key down on product main image
   * @param  {Event} event
   */
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      setPortalRenderedCallback(!portalRendered);
    }
  };

  /**
   * Animates/slides the images when the selected index changes
   */
  const animateImageSlide = useCallback(() => {
    if (currentIndex !== previousIndex) {
      if (currentIndex === 0) {
        setTranslateValue(0);
      } else {
        const indexDifference = previousIndex - currentIndex;
        setTranslateValue(translateValue + sliderWrapperWidth() * indexDifference);
      }
      setPreviousIndex(currentIndex);
    }
    // scenario when Image Portal is not rendered initially
    else if (currentIndex > 0) {
      if (sliderWrapperWidth && Math.abs(translateValue % sliderWrapperWidth()) > 0) {
        setTranslateValue(-sliderWrapperWidth() * currentIndex);
      }
    }
  }, [currentIndex, previousIndex, translateValue]);

  const toggleHover = () => {
    setImageHover(prevState => !prevState);
  };

  /**
   * de-bounce state updates on re-size
   */
  const debounceImageAnimation = useCallback(() => {
    clearTimeout(debounceTimerId);
    debounceTimerId = setTimeout(animateImageSlide, 250);
  }, [animateImageSlide]);

  /**
   * Adjust image transition based on available width when window is re-sized
   */
  useEffect(() => {
    animateImageSlide();
    window.addEventListener('resize', debounceImageAnimation);

    return () => window.removeEventListener('resize', debounceImageAnimation);
  }, [animateImageSlide, debounceImageAnimation]);

  return (
    <Styled id="ProductImageViewer__Slider" css={css}>
      <div className="ProductImageViewer__Slider" onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
        {!showExpand && (
          <p className="ProductImageViewer__SliderNumbers">
            {currentIndex + 1} of {images.length}
          </p>
        )}
        <div className="ProductImageViewer__SliderImage" ref={imageContainer}>
          <div
            className="ProductImageViewer__SliderWrapper"
            style={{transform: `translateX(${translateValue}px)`}}
            ref={slideWrapperEl}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onClick={() => setPortalRenderedCallback(!portalRendered)}
            onKeyDown={handleKeyDown}
            role={showExpand ? 'button' : ''}
            tabIndex={showExpand ? 0 : -1}
          >
            {useMemo(() => {
              return images.map((image, index) => {
                const imgKey = `${image}_${index}`;

                return <Slide key={imgKey} image={image} primaryImageTitle={primaryImageTitle} />;
              });
            }, [images, primaryImageTitle])}
          </div>
        </div>
        {displayImageZoom && !mobile && (
          <ImageZoom
            imageContainer={imageContainer}
            currentIndex={currentIndex}
            showLens={showExpand}
            {...props}
            clickCallback={() => setPortalRenderedCallback(!portalRendered)}
          />
        )}
        {displayImageZoom && !mobile && showExpand && (
          <div className="ProductImageViewer__HelpText">{imageHover ? lableOpenExpandedView : labelRollOverImage}</div>
        )}
        <ProductImageSliderControls {...props} />
      </div>
    </Styled>
  );
};

ProductImageSlider.propTypes = {
  /*
   * Current image index.
   */
  currentIndex: PropTypes.number.isRequired,
  /*
   * Images Array.
   */
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  /*
   * Boolean to denote if portal is rendered.
   */
  portalRendered: PropTypes.bool.isRequired,
  /*
   * Title of the primary image.
   */
  primaryImageTitle: PropTypes.string,
  /*
   * Callback function to set currentImageIndex.
   */
  setCurrentImageIndex: PropTypes.func.isRequired,
  /*
   * Callback function to set portalRendered.
   */
  setPortalRenderedCallback: PropTypes.func.isRequired,
  /*
   * Boolean to denote if expand is to be shown.
   */
  showExpand: PropTypes.bool.isRequired
};

ProductImageSlider.defaultProps = {
  primaryImageTitle: undefined
};

export default React.memo(ProductImageSlider);
