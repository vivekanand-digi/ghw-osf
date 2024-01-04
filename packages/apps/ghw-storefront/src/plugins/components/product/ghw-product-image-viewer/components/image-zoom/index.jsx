/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useEffect, useRef, useCallback} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {noop} from '@oracle-cx-commerce/utils/generic';
import css from './styles.css';
import {
  MIN_MAGNIFIER_VALUE,
  MAX_MAGNIFIER_VALUE,
  MAGNIFIER_VELOCITY,
  DEFAULT_MAGNIFIER_VALUE,
  ZOOMELEMENT_SIZE_RATIO_X,
  ZOOMELEMENT_SIZE_RATIO_Y,
  ZOOM_RATIO
} from './constants';

/**
 * A single ImageZoom of the image slider
 * @param  {Ref} imageContainer
 * @param  {boolean} showLens
 */
const ImageZoom = props => {
  const {imageContainer, showLens, currentIndex = 0, clickCallback = noop} = props;
  const imageOffsetLeft = useRef(0);
  const zoomImageElement = useRef(null),
    lensElement = useRef(null),
    imageElement = useRef(null),
    xRatio = useRef(1),
    yRatio = useRef(1);
  const magnifierValue = useRef({x: DEFAULT_MAGNIFIER_VALUE, y: DEFAULT_MAGNIFIER_VALUE}); // current magnifier Percent- default value .45
  const maxLensSize = useRef({x: MAX_MAGNIFIER_VALUE, y: MAX_MAGNIFIER_VALUE});
  const minLensSize = useRef({x: MIN_MAGNIFIER_VALUE, y: MIN_MAGNIFIER_VALUE});

  const isZoomIn = useRef(false);
  const zoomedImagewidth = useRef(null);
  const zoomedContainerHeight = useRef(null);

  /*calculate and sets xRatio and yRatio based on the ZoomImageElement and lens Element */
  const setMagnifierRatio = () => {
    xRatio.current = zoomImageElement.current.offsetWidth / lensElement.current.offsetWidth;
    yRatio.current = zoomImageElement.current.offsetHeight / lensElement.current.offsetHeight;
    zoomImageElement.current.style.backgroundSize = `${imageElement.current.width * xRatio.current}px ${
      imageElement.current.height * yRatio.current
    }px`;
  };

  /* Returns the {x, y} position of cursor with respective element */
  const getCursorPositionOnElement = (event, element) => {
    let x = 0,
      y = 0;
    event = event || window.event;
    /*get the x and y positions of the image:*/
    const pos = element.getBoundingClientRect();
    /*calculate the cursor's x and y coordinates, relative to the element provided*/
    x = event.pageX - pos.left;
    y = event.pageY - pos.top;
    /*consider any page scrolling*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;

    return {x, y};
  };

  /* Move the lens on mouse move and update the zoomed image */
  const moveLens = useCallback(event => {
    let x, y;
    /*prevent any other actions that may occur when moving over the image*/
    event.preventDefault();
    /*get the cursor's x and y positions*/
    const pos = getCursorPositionOnElement(event, imageElement.current);
    /*calculate the position of the lensElement*/
    x = pos.x - lensElement.current.offsetWidth / 2;
    y = pos.y - lensElement.current.offsetHeight / 2;
    /*prevent the lensElement from being positioned outside the image*/
    if (x > imageElement.current.width - lensElement.current.offsetWidth) {
      x = imageElement.current.width - lensElement.current.offsetWidth;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > imageElement.current.height - lensElement.current.offsetHeight) {
      y = imageElement.current.height - lensElement.current.offsetHeight;
    }
    if (y < 0) {
      y = 0;
    }
    /*display what the lensElement "sees" */
    zoomImageElement.current.style.backgroundPosition = `-${x * xRatio.current}px -${y * yRatio.current}px`;
    x = x + imageOffsetLeft.current;
    /*set the position of the lensElement */
    lensElement.current.style.left = `${x}px`;
    lensElement.current.style.top = `${y}px`;
  }, []);

  /** Re-size the lens based on the amount mouse wheel rotated / pinched*/
  const resizeLens = useCallback(
    event => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      const ratio = ZOOMELEMENT_SIZE_RATIO_X / ZOOMELEMENT_SIZE_RATIO_Y;
      /*get the delta value: amount pinched or rotated */
      const delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail || event.deltaY));
      /*calculate and assign the new magnifier value */
      let x = Math.max(
        minLensSize.current.x,
        Math.min(maxLensSize.current.x, magnifierValue.current.x + MAGNIFIER_VELOCITY * delta)
      );
      let y = x / ratio;
      if (y < minLensSize.current.y) {
        y = minLensSize.current.y;
      } else if (y > maxLensSize.current.y) {
        y = maxLensSize.current.y;
      }
      x = ratio * y;
      magnifierValue.current = {x, y};
      /*set the height and width of the lens based on magnifier new value */
      lensElement.current.style.width = `${imageElement.current.width * magnifierValue.current.x}px`;
      lensElement.current.style.height = `${imageElement.current.height * magnifierValue.current.y}px`;
      /*calculate the ratio between ZoomedImageElement DIV and lensElement*/
      setMagnifierRatio();
      /*get the Zoomed image accordingly */
      moveLens(event);
    },
    [moveLens]
  );
  /** Set max and min values of lens size and initial value */
  const setMaxMinValues = useCallback(() => {
    const ratio = ZOOMELEMENT_SIZE_RATIO_X / ZOOMELEMENT_SIZE_RATIO_Y;
    maxLensSize.current.x = MAX_MAGNIFIER_VALUE;
    maxLensSize.current.y = MAX_MAGNIFIER_VALUE / ratio;
    minLensSize.current.y = MIN_MAGNIFIER_VALUE;
    minLensSize.current.x = ratio * MIN_MAGNIFIER_VALUE;
    magnifierValue.current.x = DEFAULT_MAGNIFIER_VALUE;
    magnifierValue.current.y = DEFAULT_MAGNIFIER_VALUE / ratio;
  }, []);
  /** Set the size of lens and Image zoom element */
  const setLensAndImageZoom = useCallback(() => {
    setMaxMinValues();
    /*set initial default height and width of lens*/
    lensElement.current.style.width = `${imageElement.current.width * magnifierValue.current.x}px`;
    lensElement.current.style.height = `${imageElement.current.height * magnifierValue.current.y}px`;
    /*set height and width of ZoomedImageElement DIV */
    zoomImageElement.current.style.width = `${imageElement.current.width * ZOOMELEMENT_SIZE_RATIO_X}px`;
    zoomImageElement.current.style.height = `${imageElement.current.height * ZOOMELEMENT_SIZE_RATIO_Y}px`;

    imageOffsetLeft.current = (imageContainer.current.offsetWidth - imageElement.current.offsetWidth) / 2;

    /*calculate the ratio between ZoomedImageElement DIV and lensElement*/
    setMagnifierRatio();
  }, [imageContainer, setMaxMinValues]);

  /**Initiate Lens and Zoomed  image element
   * Binds event listeners to Lens and imageElement
   */
  const initiateImageZoomWithLens = useCallback(() => {
    /*set background properties for the ZoomedImageElement DIV*/
    zoomImageElement.current.style.backgroundImage = `url('${imageElement.current.src}')`;
    /*execute a function when someone moves the cursor over the image, or the lensElement*/
    lensElement.current.addEventListener('mousemove', moveLens);
    imageElement.current.addEventListener('mousemove', moveLens);
    /*and also for touch screens*/
    lensElement.current.addEventListener('touchmove', moveLens);
    imageElement.current.addEventListener('touchmove', moveLens);
    /*mouse scroll or pinch events*/
    lensElement.current.addEventListener('wheel', resizeLens);
    imageElement.current.addEventListener('wheel', resizeLens);
    /*mouse hover on the image */
    imageElement.current.addEventListener('mouseover', setLensAndImageZoom);
    /*mouse click */
    lensElement.current.addEventListener('click', clickCallback);
  }, [moveLens, resizeLens, setLensAndImageZoom, clickCallback]);

  /* Move the image on mouse move on image */
  const moveZoomImage = useCallback(
    event => {
      /*get the cursor's x and y positions:*/
      const pos = event ? getCursorPositionOnElement(event, imageContainer.current) : {x: 0, y: 0};
      let x = xRatio.current * (pos.x - imageContainer.current.offsetWidth / 4);
      let y = yRatio.current * (pos.y - imageContainer.current.offsetHeight / 4);
      /*prevent the lensElement from being positioned outside the image*/
      if (x > imageElement.current.offsetWidth - imageContainer.current.offsetWidth) {
        x = imageElement.current.offsetWidth - imageContainer.current.offsetWidth;
      }
      if (x < 0) {
        x = 0;
      }
      if (y > imageElement.current.offsetHeight - imageContainer.current.offsetHeight) {
        y = imageElement.current.offsetHeight - imageContainer.current.offsetHeight;
      }
      if (y < 0) {
        y = 0;
      }
      /* set top and left of the image element */
      imageElement.current.style.left = `${-x}px`;
      imageElement.current.style.top = `${-y}px`;
    },
    [imageContainer]
  );

  /* execute zoom in action */
  const handleZoomIn = useCallback(() => {
    imageContainer.current.classList.add('ProductImageViewer__ZoomIn');
    imageContainer.current.style.height = `${zoomedContainerHeight.current}px`;
    imageElement.current.style.setProperty('width', `${zoomedImagewidth.current}px`, 'important');
    imageElement.current.style.setProperty('height', 'auto', 'important');
    imageElement.current.style.position = 'relative';
    imageElement.current.style.cursor = 'zoom-out';
    imageElement.current.style.setProperty('max-width', 'unset', 'important');
    imageElement.current.style.setProperty('max-height', 'unset', 'important');
    xRatio.current = imageElement.current.offsetWidth / imageContainer.current.offsetWidth;
    yRatio.current = imageElement.current.offsetHeight / imageContainer.current.offsetHeight;
    imageElement.current.addEventListener('mousemove', moveZoomImage);
    moveZoomImage();
  }, [imageContainer, moveZoomImage]);

  /* execute zoom out action */
  const handleZoomOut = useCallback(() => {
    imageContainer.current.classList.remove('ProductImageViewer__ZoomIn');
    imageElement.current.style = {};
    imageElement.current.style.cursor = 'zoom-in';
  }, [imageContainer]);

  const handleZoomInOrOut = useCallback(() => {
    /* toggle the zoomIn ref value */
    isZoomIn.current = !isZoomIn.current;
    if (isZoomIn.current) {
      /* execute zoom in action */
      handleZoomIn();
    } else {
      /* execute zoom out action */
      handleZoomOut();
    }
  }, [handleZoomIn, handleZoomOut]);

  /**Initiate Zoom In and Zoom Out related elements
   * Binds event listeners to imageElement
   */
  const initiateImageZoomInOut = useCallback(() => {
    /* calculate the zoom width based on the zoom ratio */
    zoomedImagewidth.current = imageContainer.current.offsetWidth * ZOOM_RATIO;
    /* store the actual height of the image container */
    zoomedContainerHeight.current = imageContainer.current.offsetHeight;
    /* set cursor as 'zoom-in' by default */
    imageElement.current.style.cursor = 'zoom-in';
    /* add event listener on image container */
    imageContainer.current.addEventListener('click', handleZoomInOrOut);
  }, [imageContainer, handleZoomInOrOut]);

  const clearPreviousStyles = useCallback(() => {
    const elements = imageContainer.current.querySelectorAll('img');
    for (let i = 0; i < elements.length; i++) {
      elements[i].style = {};
    }
  }, [imageContainer]);

  useEffect(() => {
    /*initiate imageElement ref with image DOM element */
    imageElement.current = imageContainer.current.querySelectorAll('img')[currentIndex];
    if (typeof window !== 'undefined' && imageElement.current) {
      if (showLens) {
        /**Initiate Lens and Zoomed  image element */
        initiateImageZoomWithLens();
      } else {
        clearPreviousStyles();
        /**Initiate Zoom In and Zoom Out */
        initiateImageZoomInOut();
      }
    }
  }, [
    imageContainer,
    initiateImageZoomWithLens,
    initiateImageZoomInOut,
    showLens,
    handleZoomInOrOut,
    currentIndex,
    clearPreviousStyles
  ]);

  return (
    <Styled id="ProductImageViewer__ImageZoom" css={css}>
      {showLens && (
        <div className="ProductImageViewer__ImageZoom">
          <div className="ProductImageViewer__ZoomLens" ref={lensElement}></div>
          <div className="ProductImageViewer__ZoomImage" ref={zoomImageElement}></div>
        </div>
      )}
    </Styled>
  );
};

export default React.memo(ImageZoom);
