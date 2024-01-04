import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';
import * as resourceBundle from '@oracle-cx-commerce/resources';

const configResourceKeys = [
  'configVariantOptionTypeLabel',
  'configVariantOptionTypeHelpText',
  'configVariantOptionTypeDropDownLabel',
  'configVariantOptionTypeButtonLabel',
  'configColorSwatchImageHeightLabel',
  'configColorSwatchImageHeightHelpText',
  'configColorSwatchImageWidthLabel',
  'configColorSwatchImageWidthHelpText',
  'configColorSwatchUrlPlaceholderHelpText',
  'configColorSwatchUrlPlaceholderLabel',
  'configUnavailableColorSwatchOverlayImageHelpText',
  'configUnavailableColorSwatchOverlayImageLabel',
  'configColorSwatchMappingPropertyHelpText',
  'configColorSwatchMappingPropertyLabel',
  'configColorSwatchVariantOptionHelpText',
  'configColorSwatchVariantOptionLabel',
  'configColorSwatchShapeLabel',
  'configColorSwatchShapeHelpText',
  'configColorSwatchShapeCircularLabel',
  'configColorSwatchShapeRectangularLabel'
];

const config = {
  properties: [
    {
      id: 'variantOptionType',
      type: 'optionType',
      name: 'variantOptionType',
      helpTextResourceId: 'configVariantOptionTypeHelpText',
      labelResourceId: 'configVariantOptionTypeLabel',
      defaultValue: 'buttons',
      required: true,
      options: [
        {
          id: 'variantOptionTypeDropDown',
          value: 'buttons',
          labelResourceId: 'configVariantOptionTypeButtonLabel'
        },
        {
          id: 'variantOptionTypeDropDown',
          value: 'dropdown',
          labelResourceId: 'configVariantOptionTypeDropDownLabel'
        }
      ]
    },
    {
      id: 'colorSwatchShape',
      type: 'optionType',
      name: 'colorSwatchShape',
      helpTextResourceId: 'configColorSwatchShapeHelpText',
      labelResourceId: 'configColorSwatchShapeLabel',
      defaultValue: 'circular',
      required: true,
      options: [
        {
          id: 'colorSwatchShapeDropDown',
          value: 'circular',
          labelResourceId: 'configColorSwatchShapeCircularLabel'
        },
        {
          id: 'colorSwatchShapeDropDown',
          value: 'rectangular',
          labelResourceId: 'configColorSwatchShapeRectangularLabel'
        }
      ]
    },
    {
      id: 'colorSwatchImageWidth',
      type: 'stringType',
      name: 'colorSwatchImageWidth',
      helpTextResourceId: 'configColorSwatchImageWidthHelpText',
      labelResourceId: 'configColorSwatchImageWidthLabel',
      defaultValue: '40',
      required: true,
      maxLength: 3
    },
    {
      id: 'colorSwatchImageHeight',
      type: 'stringType',
      name: 'colorSwatchImageHeight',
      helpTextResourceId: 'configColorSwatchImageHeightHelpText',
      labelResourceId: 'configColorSwatchImageHeightLabel',
      defaultValue: '40',
      required: true,
      maxLength: 3
    },
    {
      id: 'colorSwatchVariantOption',
      type: 'stringType',
      name: 'colorSwatchVariantOption',
      helpTextResourceId: 'configColorSwatchVariantOptionHelpText',
      labelResourceId: 'configColorSwatchVariantOptionLabel',
      defaultValue: 'color'
    },
    {
      id: 'colorSwatchMappingProperty',
      type: 'stringType',
      name: 'colorSwatchMappingProperty',
      helpTextResourceId: 'configColorSwatchMappingPropertyHelpText',
      labelResourceId: 'configColorSwatchMappingPropertyLabel',
      defaultValue: 'x_swatchMapping'
    },
    {
      id: 'colorSwatchUrlPlaceholder',
      type: 'stringType',
      name: 'colorSwatchUrlPlaceholder',
      helpTextResourceId: 'configColorSwatchUrlPlaceholderHelpText',
      labelResourceId: 'configColorSwatchUrlPlaceholderLabel',
      defaultValue:
        '/ccstore/v1/images/?source=/file/products/__productId__.__swatchKey__.png&outputFormat=JPEG&quality=0.8&height=__height__&width=__width__'
    },
    {
      id: 'unavailableColorSwatchOverlayImage',
      type: 'stringType',
      name: 'unavailableColorSwatchOverlayImage',
      helpTextResourceId: 'configUnavailableColorSwatchOverlayImageHelpText',
      labelResourceId: 'configUnavailableColorSwatchOverlayImageLabel',
      defaultValue: '/file/general/outofstock_overlay.png'
    }
  ],
  locales: buildConfigResources(resourceBundle, configResourceKeys)
};

export default config;
