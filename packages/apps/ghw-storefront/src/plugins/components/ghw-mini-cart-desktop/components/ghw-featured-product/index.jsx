/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, { useContext, useEffect, useMemo } from 'react';
import GHWGenericCarousel from '@oracle-cx-commerce/react-components/generic-carousel';
import PropTypes from 'prop-types';
import Styled from '@oracle-cx-commerce/react-components/styled';
import { StoreContext } from '@oracle-cx-commerce/react-ui/contexts';
import { useSelector } from '@oracle-cx-commerce/react-components/provider';
import {
  isMobile,
  getProducts,
  getRecommendations,
  getRecommendationsSet
} from '@oracle-cx-commerce/commerce-utils/selector';
import { t } from '@oracle-cx-commerce/utils/generic';
import ProductItem from './components/product-item';
import css from './styles.css';

/**
 * This component is used to render the product recommendations as a Carousel.
 * @param props
 */
const GHWRelatedProducts = props => {
  const { widgetId, headingProductRecommendations, bodyText } = props;

  const mobile = useSelector(isMobile);
  //const recommendations = useSelector(getRecommendations, {widgetId});
  const recommendations = ['1170360', '1170368', '1170360', '1170368', '1170360', '1170368', '1170360', '1170368'];
  const { recSetId } = useSelector(getRecommendationsSet, { widgetId });
  const products = useSelector(getProducts);
  const { action } = useContext(StoreContext);


  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      // Exclude relatedProducts to reduce the size of the response and
      // to workaround an issue with variants if any of the recommended products
      // has a related product that is currently being viewed on a PDP page.
      const payload = { productIds: recommendations, exclude: 'items.relatedProducts' };

      action('listProducts', payload);
    }
  }, [action, recommendations]);
  const slides = [];
  const lowStockSlides = [];

  useMemo(() => {
    recommendations
      .map(productId => products[productId])
      .filter(product => product != null)
      .forEach(product => {
        slides.push(<ProductItem {...props} product={product} recSetId={recSetId} />);
      });
    lowStockSlides.push(slides[0]);
  }, [recommendations, products, slides, recSetId, props]);

  // if (slides.length === 0) {
  //   return null;
  // }

  return (
    <Styled id="GHWRelatedProducts" css={css}>
      {recommendations && recommendations.length > 0 && (
        <div className="GHWRelatedProducts" id='GHWRelatedProducts'>
          {props.bodyText ? (
            <div className="GHWRelatedProducts__Heading">{props.bodyText}</div>
          ) : (
            <div className="main-heading GHWRelatedProducts__Heading">{props.headingProductRecommendations}</div>
          )}
          <div className="GHWRelatedProducts_Content">
            <div className="NIBProductRecommendations_Content">
              {props.noOfProducts > 1 ? (
                <GHWGenericCarousel
                  slides={slides}
                  mobile={mobile}
                  showIndicator={false}
                  isAutoSlide={false}
                  itemsPerSlideDesktop={props.noOfProducts}
                  itemsPerSlideMobile={1}
                />) : (<div className="runningLow">
                  <div className="GHWRelatedProductsHeading" id="GHWRelatedProductsHeading">{props.bodyTextHead}</div>
                  <GHWGenericCarousel
                    slides={lowStockSlides}
                    mobile={mobile}
                    showIndicator={false}
                    isAutoSlide={false}
                    itemsPerSlideDesktop={props.noOfProducts}
                    itemsPerSlideMobile={1} /></div>)}
            </div>
          </div>
        </div>
      )}
    </Styled>
  );
};

GHWRelatedProducts.propTypes = {
  /** The id of the widget */
  widgetId: PropTypes.string.isRequired,

  /** A text snippet displayed above the product recommendations */
  headingProductRecommendations: PropTypes.string.isRequired
};

export default GHWRelatedProducts;
