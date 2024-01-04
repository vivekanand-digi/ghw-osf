/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';

import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {IMG_CONF as config} from '@oracle-cx-commerce/react-components/config';
import {getSite} from '@oracle-cx-commerce/commerce-utils/selector';
import PropTypes from 'prop-types';
import css from './styles.css';
import MissingImageIcon from '../missing-image';

const IMAGE_PATH_PATTERN = /source=([^&]+)/i;
const IMAGES_ENDPOINT = '/ccstore/v1/images/';
const OUTPUT_FORMAT = 'outputFormat';
const QUALITY = 'quality';
const ALPHA_CHANNEL_COLOR = 'alphaChannelColor';
const SITE_DEFAULT_NO_IMAGE_URL = '/img/no-image.jpg';

/**
 * Renders the real image path
 * If the path contains Images endpoint part, it strips it off and returns real path
 *
 * @param {String} src the image src
 * @return {String} the real image path
 */
const getImagePath = src => {
  if (src && src.includes(IMAGES_ENDPOINT)) {
    const matches = src.match(IMAGE_PATH_PATTERN);
    if (matches && matches[1]) {
      const [, imagePart] = matches;

      return `${imagePart}`;
    }
  }

  return src;
};

/**
 * Validates and returns {height, width} object from the size
 *
 * @param {String} size the size
 * @return {height, width}
 */
const getDimensions = size => {
  if (size) {
    let [height, width] = size.split(',');
    if (height && width) {
      height = height.trim();
      width = width.trim();
      if (!isNaN(height) && !isNaN(width)) {
        return {height, width};
      }
    }
  }

  return null;
};

/**
 * Get size override in {height, width} from predefined sizes
 *
 * @param {String} sizeOverride the size override
 * @return {height, width}
 */
const getSizeOverride = sizeOverride => {
  let size = null;
  if (sizeOverride) {
    size = config.DEFAULT_IMG_SIZES[sizeOverride];
    if (size) {
      return size;
    }
    size = getDimensions(sizeOverride);
  }

  return size;
};

/**
 * Returns optimized Image URI by invoking Images endpoint
 *
 * @param {Object} imgSize
 * @param {String} imgPath
 * @param {Array} extraParams
 *
 * @return optimized image URI
 */
const getImageURI = (imgSize = {}, imgPath, extraParams = []) => {
  if (imgPath) {
    let imageURI = `${IMAGES_ENDPOINT}?source=${imgPath}&height=${imgSize.height}&width=${imgSize.width}`;
    if (extraParams.length > 0) {
      imageURI += `&${extraParams.join('&')}`;
    }

    return imageURI;
  }

  return null;
};

/**
 * Returns responsive image 'srcset' values
 *
 * @param {Object} allSizes different view port sizes
 * @param {String} imgPath
 * @param {Array} extraParams
 *
 * @return 'srcset' string
 */
const getSrcSet = (allSizes = {}, imgPath, extraParams) => {
  if (imgPath) {
    const srcSet = new Set([]);

    for (const [, size = {}] of Object.entries(allSizes)) {
      srcSet.add(`${getImageURI(size, imgPath, extraParams)} ${size.width}w`);
    }

    return Array.from(srcSet).join(',');
  }

  return null;
};

/**
 * Returns responsive image 'sizes' values
 *
 * @param {Object} object viewport sizes
 *
 * @return 'sizes' string
 */
const getSizes = ({xs = {}, sm = {}, md = {}, lg = {}}) => {
  const sizes = [];
  sizes.push(`(max-width:${config.VIEWPORT_XS_WIDTH}px) ${xs.width}px`);
  sizes.push(
    `(min-width:${config.VIEWPORT_XS_WIDTH + 1}px) and (max-width:${config.VIEWPORT_SM_WIDTH}px) ${sm.width}px`
  );
  sizes.push(
    `(min-width:${config.VIEWPORT_SM_WIDTH + 1}px) and (max-width:${config.VIEWPORT_MD_WIDTH}px) ${md.width}px`
  );
  sizes.push(`(min-width:${config.VIEWPORT_MD_WIDTH + 1}px) ${lg.width}px`);

  return sizes.join(',');
};

/**
 * Renders the html <img> tag with following features
 * optimizes image by invoking CC images rest endpoint and passing required optimization parameters
 * renders html5 responsive images with srcset and sizes
 * uses browser's native lazy loading support
 * reserves layout for images to prevent image jank
 *
 * @return img dom element or <MissingImageIcon/>
 */

const Img = props => {
  // state
  const [fallbackToMissingImgIcon, setFallbackToMissingImgIcon] = useState(false);

  const imageRef = useRef(null);
  const {
    errorSrc,
    src,
    alt,
    onErrorCallback,
    xsmall,
    small,
    medium,
    large,
    quality = config.DEFAULT_QUALITY,
    outputFormat = config.DEFAULT_OUTPUT_FORMAT,
    alphaChannelColor = config.DEFAULT_ALPHA_CHANNEL_COLOR,
    size,
    aspectRatio,
    useSrcset = config.USE_SRCSET,
    loading = config.DEFAULT_LOADING,
    errorAlt = config.ERROR_ALT_TEXT,
    ...imgProps
  } = props;

  const {getState} = useContext(StoreContext);
  const {noimage} = getSite(getState());
  const errorSrcFinal = errorSrc || noimage || null;

  // get overrides
  const sizeOverride = getSizeOverride(size);
  const xsOverride = getDimensions(xsmall);
  const smOverride = getDimensions(small);
  const mdOverride = getDimensions(medium);
  const lgOverride = getDimensions(large);
  const aspectRatioOverride = getDimensions(aspectRatio);

  // reserve layout based on height and width from the info available
  const reserveLayout =
    aspectRatioOverride ||
    sizeOverride ||
    xsOverride ||
    smOverride ||
    mdOverride ||
    lgOverride ||
    config.DEFAULT_IMG_SIZES.medium;

  const onError = useCallback(() => {
    // on error cleanup
    const currentImg = imageRef.current;
    if (currentImg) {
      const prevSrc = currentImg.src;
      currentImg.removeAttribute('srcset');
      currentImg.removeAttribute('sizes');
      // when errorSrc also also fails to load
      if (errorSrcFinal && prevSrc && !prevSrc.includes(errorSrcFinal)) {
        currentImg.src = errorSrcFinal;
        currentImg.alt = errorAlt;
      } else {
        currentImg.style.display = 'none';
        setFallbackToMissingImgIcon(true);
      }
    }

    onErrorCallback && typeof onErrorCallback === 'function' && onErrorCallback(imageRef);
  }, [errorAlt, errorSrcFinal, onErrorCallback]);

  // This hook handles error scenario with SSR.
  useEffect(() => {
    if (imageRef && imageRef.current) {
      const {complete, naturalHeight} = imageRef.current;

      const errorLoadingImgBeforeHydration = complete && naturalHeight === 0;

      if (errorLoadingImgBeforeHydration) {
        onError();
      }
    }
  }, [onError]);

  const renderImg = () => {
    if (fallbackToMissingImgIcon) {
      return <MissingImageIcon className="Img__MissingImgIcon" />;
    }

    const imgPath = getImagePath(src);
    let srcSetAttributes = {};

    if (imgPath && !imgPath.includes(SITE_DEFAULT_NO_IMAGE_URL)) {
      const extraParams = [];
      quality && extraParams.push(`${QUALITY}=${quality}`);
      outputFormat && extraParams.push(`${OUTPUT_FORMAT}=${outputFormat}`);
      alphaChannelColor && extraParams.push(`${ALPHA_CHANNEL_COLOR}=${alphaChannelColor}`);

      const srcFinal = sizeOverride ? getImageURI(sizeOverride, imgPath, extraParams) : src;

      if (useSrcset) {
        const xs = xsOverride || sizeOverride || config.DEFAULT_IMG_SIZES.xsmall;
        const sm = smOverride || sizeOverride || config.DEFAULT_IMG_SIZES.small;
        const md = mdOverride || sizeOverride || config.DEFAULT_IMG_SIZES.medium;
        const lg = lgOverride || sizeOverride || config.DEFAULT_IMG_SIZES.large;
        const allSizes = {xs, sm, md, lg};
        const srcSetFinal = getSrcSet(allSizes, imgPath, extraParams);
        const sizesFinal = imgPath ? getSizes(allSizes) : null;
        srcSetAttributes = {
          srcSet: srcSetFinal,
          sizes: sizesFinal
        };
      }

      return (
        <img
          {...srcSetAttributes}
          alt={alt}
          src={srcFinal}
          loading={loading}
          {...imgProps}
          onError={onError}
          ref={imageRef}
          width={reserveLayout.width}
          height={reserveLayout.height}
        />
      );
    }
    // no src - error case

    return errorSrcFinal ? (
      <img
        {...imgProps}
        src={errorSrcFinal}
        alt={errorAlt}
        width={reserveLayout.width}
        height={reserveLayout.height}
        onError={onError}
      />
    ) : (
      <MissingImageIcon className="Img__MissingImgIcon" {...imgProps} />
    );
  };

  return (
    <Styled id="GHWPLP__Img" css={css}>
      <div className="GHWPLP__ImgWrapper GHWPLP__Wrap Img__Wrapper">{renderImg()}</div>
    </Styled>
  );
};

Img.propTypes = {
  /**
   * The error image URL. When an image fails to load, this value is used used as src if provided one,
   * otherwise, the site's default no-image URL is used.
   * If no value is resolved, falls back to MissingImageIcon component
   */
  errorSrc: PropTypes.string,

  /**
   * The image source URL. This can be a regular url like /file/general/abc.jpg or
   * the product URL like /ccstore/v1/images/?source=/file/v132410496917685863/products/APP_ClassicRugbyShirt_full.jpg
   */
  src: PropTypes.string,

  /**
   * The error call back function, if passed, is invoked when an error occurred to load the image.
   */
  onErrorCallback: PropTypes.func,

  /**
   * The override dimensions for x-small viewport (height, width)
   */
  xsmall: PropTypes.string,

  /**
   * The override dimensions for small viewport (height, width)
   */
  small: PropTypes.string,

  /**
   * The override dimensions for medium viewport (height, width)
   */
  medium: PropTypes.string,

  /**
   * The override dimensions for large viewport (height, width)
   */
  large: PropTypes.string,

  /**
   * The image quality of the converted image (default null)
   */
  quality: PropTypes.string,

  /**
   * The format of the converted image; only 'JPEG' is supported
   */
  outputFormat: PropTypes.string,

  /**
   * The hex color code for the replacement color of the PNG alpha channel (default is FFFFFF - white)
   */
  alphaChannelColor: PropTypes.string,

  /**
   * When a value is provided (height, width), it is used to reserve layout to avoid Image blur.
   */
  aspectRatio: PropTypes.string,

  /**
   * Determines whether to generate responsive images or not. Default value is true.
   * When it is set to false, Images generated do not contain src set and sizes attributes and are non responsive.
   */
  useSrcset: PropTypes.bool,

  /**
   * Determines whether to use browser's native lazy loading feature. Allowed values are lazy, eager and auto. Default value is lazy.
   */
  loading: PropTypes.string,

  /**
   * The error image 'alt' text. The default value is 'No Image Found'
   */
  errorAlt: PropTypes.string,

  /**
   * The override value for size
   */
  size: PropTypes.string
};

Img.defaultProps = {
  src: undefined,
  xsmall: undefined,
  small: undefined,
  medium: undefined,
  large: undefined,
  size: undefined,
  aspectRatio: undefined,
  onErrorCallback: undefined,
  errorSrc: undefined,
  quality: config.DEFAULT_QUALITY,
  outputFormat: config.DEFAULT_OUTPUT_FORMAT,
  alphaChannelColor: config.DEFAULT_ALPHA_CHANNEL_COLOR,
  useSrcset: config.USE_SRCSET,
  loading: config.DEFAULT_LOADING,
  errorAlt: config.ERROR_ALT_TEXT
};

export default React.memo(Img);
