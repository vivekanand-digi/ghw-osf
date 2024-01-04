import * as en from './locales/en';

/**
 * Design Studio configuration properties for the WidgetName component.
 * Supported config types:
 *  - stringType
 *  - booleanType
 *  - optionType
 *  - multiSelectOptionType
 *  - sectionTitleType
 *  - collectionType
 *  - mediaType
 */

const paypalButtonConfig = [
  {
    id: 'enableFunding',
    type: 'multiSelectOptionType',
    labelResourceId: 'enableFundingLabel',
    helpTextResourceId: 'enableFundingHelpText',
    defaultValue: 'paypal',
    options: [
      {
        id: 'paypal',
        value: 'paypal',
        labelResourceId: 'paypalLabel'
      },
      {
        id: 'card',
        value: 'card',
        labelResourceId: 'cardLabel'
      },
      {
        id: 'credit',
        value: 'credit',
        labelResourceId: 'creditLabel'
      },
      {
        id: 'paylater',
        value: 'paylater',
        labelResourceId: 'paylaterLabel'
      },
      {
        id: 'venmo',
        value: 'venmo',
        labelResourceId: 'venmoLabel'
      },
      {
        id: 'bancontact',
        value: 'bancontact',
        labelResourceId: 'bancontactLabel'
      },
      {
        id: 'blik',
        value: 'blik',
        labelResourceId: 'blikLabel'
      },
      {
        id: 'eps',
        value: 'eps',
        labelResourceId: 'epsLabel'
      },
      {
        id: 'giropay',
        value: 'giropay',
        labelResourceId: 'giropayLabel'
      },
      {
        id: 'ideal',
        value: 'ideal',
        labelResourceId: 'idealLabel'
      },
      {
        id: 'mercadopago',
        value: 'mercadopago',
        labelResourceId: 'mercadopagoLabel'
      },
      {
        id: 'mybank',
        value: 'mybank',
        labelResourceId: 'mybankLabel'
      },
      {
        id: 'p24',
        value: 'p24',
        labelResourceId: 'p24Label'
      },
      {
        id: 'sepa',
        value: 'sepa',
        labelResourceId: 'sepaLabel'
      },
      {
        id: 'sofort',
        value: 'sofort',
        labelResourceId: 'sofortLabel'
      }
    ]
  }
];

const styleConfig = [
  {
    id: 'styleLayout',
    type: 'optionType',
    labelResourceId: 'layoutStyleLabel',
    helpTextResourceId: 'layoutStyleLabelHelperText',
    defaultValue: 'vertical',
    options: [
      {
        id: 'vertical',
        value: 'vertical',
        labelResourceId: 'verticalLabel'
      },
      {
        id: 'horizontal',
        value: 'flex',
        labelResourceId: 'horizontalLabel'
      }
    ]
  },
  {
    id: 'styleColor',
    type: 'optionType',
    labelResourceId: 'styleColorLabel',
    helpTextResourceId: 'styleColorHelperText',
    defaultValue: 'gold',
    options: [
      {
        id: 'gold',
        value: 'gold',
        labelResourceId: 'goldLabel'
      },
      {
        id: 'blue',
        value: 'blue',
        labelResourceId: 'blueLabel'
      },
      {
        id: 'silver',
        value: 'silver',
        labelResourceId: 'silverLabel'
      },
      {
        id: 'white',
        value: 'white',
        labelResourceId: 'whiteLabel'
      },
      {
        id: 'black',
        value: 'black',
        labelResourceId: 'blackLabel'
      }
    ]
  },
  {
    id: 'styleShape',
    type: 'optionType',
    labelResourceId: 'styleShapeLabel',
    helpTextResourceId: 'styleShapeHelperText',
    defaultValue: 'rect',
    options: [
      {
        id: 'rect',
        value: 'rect',
        labelResourceId: 'rectLabel'
      },
      {
        id: 'pill',
        value: 'pill',
        labelResourceId: 'pillLabel'
      }
    ]
  },
  {
    id: 'styleSizeHeight',
    type: 'stringType',
    labelResourceId: 'styleSizeHeightLabel',
    helpTextResourceId: 'styleSizeHeightHelperText',
    defaultValue: '40'
  },
  {
    id: 'styleLabel',
    type: 'optionType',
    labelResourceId: 'styleLabelLabel',
    helpTextResourceId: 'styleLabelHelperText',
    defaultValue: 'paypal',
    options: [
      {
        id: 'paypal',
        value: 'paypal',
        labelResourceId: 'paypalLabel'
      },
      {
        id: 'checkout',
        value: 'checkout',
        labelResourceId: 'checkoutLabel'
      },
      {
        id: 'buynow',
        value: 'buynow',
        labelResourceId: 'buynowLabel'
      },
      {
        id: 'pay',
        value: 'pay',
        labelResourceId: 'payLabel'
      },
      {
        id: 'installment',
        value: 'installment',
        labelResourceId: 'installmentLabel'
      }
    ]
  },
  {
    id: 'installmentType',
    type: 'optionType',
    labelResourceId: 'installmentTypeLabel',
    helpTextResourceId: 'installmentTypeHelperText',
    defaultValue: 'BR',
    options: [
      {
        id: 'BR',
        value: 'BR',
        labelResourceId: 'BRLabel'
      },
      {
        id: 'MX',
        value: 'MX',
        labelResourceId: 'MXLabel'
      }
    ]
  },
  {
    id: 'stylePeriodMX',
    type: 'optionType',
    labelResourceId: 'stylePeriodMXLabel',
    helpTextResourceId: 'stylePeriodMXHelperText',
    defaultValue: '3',
    options: [
      {
        id: 'mx3Label',
        value: '3',
        labelResourceId: 'mx3OptionLabel'
      },
      {
        id: 'mx6Label',
        value: '6',
        labelResourceId: 'mx6OptionLabel'
      },
      {
        id: 'mx9Label',
        value: '9',
        labelResourceId: 'mx9OptionLabel'
      },
      {
        id: 'mx12Label',
        value: '12',
        labelResourceId: 'mx12OptionLabel'
      }
    ]
  },
  {
    id: 'stylePeriodBR',
    type: 'optionType',
    labelResourceId: 'stylePeriodBRLabel',
    helpTextResourceId: 'stylePeriodBRHelperText',
    defaultValue: '2',
    options: [
      {
        id: 'br2Label',
        value: '2',
        labelResourceId: 'br2OptionLabel'
      },
      {
        id: 'br3Label',
        value: '3',
        labelResourceId: 'br3OptionLabel'
      },
      {
        id: 'br4Label',
        value: '4',
        labelResourceId: 'br4OptionLabel'
      },
      {
        id: 'br5Label',
        value: '5',
        labelResourceId: 'br5OptionLabel'
      },
      {
        id: 'br6Label',
        value: '6',
        labelResourceId: 'br6OptionLabel'
      },
      {
        id: 'br7Label',
        value: '7',
        labelResourceId: 'br7OptionLabel'
      },
      {
        id: 'br8Label',
        value: '8',
        labelResourceId: 'br8OptionLabel'
      },
      {
        id: 'br9Label',
        value: '9',
        labelResourceId: 'br9OptionLabel'
      },
      {
        id: 'br10Label',
        value: '10',
        labelResourceId: 'br10OptionLabel'
      },
      {
        id: 'br11Label',
        value: '11',
        labelResourceId: 'br11OptionLabel'
      },
      {
        id: 'br12Label',
        value: '12',
        labelResourceId: 'br12OptionLabel'
      }
    ]
  },
  {
    id: 'styleTagline',
    type: 'booleanType',
    labelResourceId: 'styleTaglineLabel',
    helpTextResourceId: 'styleTaglineHelperText',
    defaultValue: true
  }
];

const payLaterConfig = [
  {
    id: 'messagingLayout',
    type: 'optionType',
    labelResourceId: 'paypalMessagingLayoutLabel',
    helpTextResourceId: 'paypalMessagingLayoutHelpText',
    defaultValue: 'text',
    options: [
      {
        id: 'text',
        value: 'text',
        labelResourceId: 'textLabel'
      },
      {
        id: 'flex',
        value: 'flex',
        labelResourceId: 'flexLabel'
      }
    ]
  },
  {
    id: 'messagingLogoType',
    type: 'optionType',
    labelResourceId: 'messagingLogoTypeLabel',
    helpTextResourceId: 'messagingLogoTypeHelpText',
    defaultValue: 'primary',
    options: [
      {
        id: 'primary',
        value: 'primary',
        labelResourceId: 'primaryLabel'
      },
      {
        id: 'alternative',
        value: 'alternative',
        labelResourceId: 'alternativeLabel'
      },
      {
        id: 'inline',
        value: 'inline',
        labelResourceId: 'inlineLabel'
      },
      {
        id: 'none',
        value: 'none',
        labelResourceId: 'noneLabel'
      }
    ]
  },
  {
    id: 'messagingLogoPosition',
    type: 'optionType',
    labelResourceId: 'messagingLogoPositionLabel',
    helpTextResourceId: 'messagingLogoPositionHelpText',
    defaultValue: 'left',
    options: [
      {
        id: 'left',
        value: 'left',
        labelResourceId: 'leftLabel'
      },
      {
        id: 'right',
        value: 'right',
        labelResourceId: 'rightLabel'
      },
      {
        id: 'top',
        value: 'top',
        labelResourceId: 'topLabel'
      }
    ]
  },
  {
    id: 'messagingTextColor',
    type: 'optionType',
    labelResourceId: 'messagingTextColorLabel',
    helpTextResourceId: 'messagingTextColorHelpText',
    defaultValue: 'black',
    options: [
      {
        id: 'black',
        value: 'black',
        labelResourceId: 'blackLabel'
      },
      {
        id: 'white',
        value: 'white',
        labelResourceId: 'whiteLabel'
      },
      {
        id: 'monochrome',
        value: 'monochrome',
        labelResourceId: 'monochromeLabel'
      },
      {
        id: 'grayscale',
        value: 'grayscale',
        labelResourceId: 'grayscaleLabel'
      }
    ]
  },
  {
    id: 'messagingTextSize',
    type: 'optionType',
    labelResourceId: 'messagingTextSizeLabel',
    helpTextResourceId: 'messagingTextSizeHelpText',
    defaultValue: '12',
    options: [
      {
        id: 't10',
        value: '10',
        labelResourceId: 't10Label'
      },
      {
        id: 't11',
        value: '11',
        labelResourceId: 't11Label'
      },
      {
        id: 't12',
        value: '12',
        labelResourceId: 't12Label'
      },
      {
        id: 't13',
        value: '13',
        labelResourceId: 't13Label'
      },
      {
        id: 't14',
        value: '14',
        labelResourceId: 't14Label'
      },
      {
        id: 't15',
        value: '15',
        labelResourceId: 't15Label'
      },
      {
        id: 't16',
        value: '16',
        labelResourceId: 't16Label'
      }
    ]
  },
  {
    id: 'messagingTextAlign',
    type: 'optionType',
    labelResourceId: 'messagingTextAlignLabel',
    helpTextResourceId: 'messagingTextAlignHelpText',
    defaultValue: 'left',
    options: [
      {
        id: 'left',
        value: 'left',
        labelResourceId: 'leftLabel'
      },
      {
        id: 'center',
        value: 'center',
        labelResourceId: 'centerLabel'
      },
      {
        id: 'right',
        value: 'right',
        labelResourceId: 'rightLabel'
      }
    ]
  },
  {
    id: 'messagingColor',
    type: 'optionType',
    defaultValue: 'blue',
    labelResourceId: 'messagingColorLabel',
    helpTextResourceId: 'messagingColorHelpText',
    options: [
      {
        id: 'blue',
        value: 'blue',
        labelResourceId: 'blueLabel'
      },
      {
        id: 'black',
        value: 'black',
        labelResourceId: 'blackLabel'
      },
      {
        id: 'white',
        value: 'white',
        labelResourceId: 'whiteLabel'
      },
      {
        id: 'whiteNoBorder',
        value: 'white-no-border',
        labelResourceId: 'whiteNoBorderLabel'
      },
      {
        id: 'gray',
        value: 'gray',
        labelResourceId: 'grayLabel'
      },
      {
        id: 'monochrome',
        value: 'monochrome',
        labelResourceId: 'monochromeLabel'
      },
      {
        id: 'grayscale',
        value: 'grayscale',
        labelResourceId: 'grayscaleLabel'
      }
    ]
  },
  {
    id: 'messagingRatio',
    type: 'optionType',
    defaultValue: '1x1',
    labelResourceId: 'messagingRatioLabel',
    helpTextResourceId: 'messagingRatioHelpText',
    options: [
      {
        id: 'o1x1',
        value: '1x1',
        labelResourceId: 'o1x1Label'
      },
      {
        id: 'o1x4',
        value: '1x4',
        labelResourceId: 'o1x4Label'
      },
      {
        id: 'o8x1',
        value: '8x1',
        labelResourceId: 'o8x1Label'
      },
      {
        id: 'o20x1',
        value: '20x1',
        labelResourceId: 'o20x1Label'
      }
    ]
  },
  {
    id: 'messagingPlacement',
    type: 'optionType',
    defaultValue: 'payment',
    labelResourceId: 'messagingPlacementLabel',
    helpTextResourceId: 'messagingPlacementHelpText',
    options: [
      {
        id: 'payment',
        value: 'payment',
        labelResourceId: 'paymentLabel'
      },
      {
        id: 'product',
        value: 'product',
        labelResourceId: 'productLabel'
      },
      {
        id: 'cart',
        value: 'cart',
        labelResourceId: 'cartLabel'
      }
    ]
  }
];

const config = {
  properties: [...paypalButtonConfig, ...styleConfig, ...payLaterConfig],
  locales: {
    en: {
      resources: en
    }
  }
};

export default config;
