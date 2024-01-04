import * as en from './locales/en';
/**
 * Design Studio configuration properties for the WidgetName component.
 */
const config = {
  properties: [
    {
      id: 'billingFrequencyOptions',
      type: 'multiSelectOptionType',
      labelResourceId: 'billingFrequencyOptionsLabel',
      helpTextResourceId: 'billingFrequencyOptionsHelpText',
      defaultValue: '1,2,3,4,5,6,7,8,9,10,11,12',
      options: [
        {
          id: '1',
          value: '1',
          labelResourceId: 'months1Label'
        },
        {
          id: '2',
          value: '2',
          labelResourceId: 'months2Label'
        },
        {
          id: '3',
          value: '3',
          labelResourceId: 'months3Label'
        },
        {
          id: '4',
          value: '4',
          labelResourceId: 'months4Label'
        },
        {
          id: '5',
          value: '5',
          labelResourceId: 'months5Label'
        },
        {
          id: '6',
          value: '6',
          labelResourceId: 'months6Label'
        },
        {
          id: '7',
          value: '7',
          labelResourceId: 'months7Label'
        },
        {
          id: '8',
          value: '8',
          labelResourceId: 'months8Label'
        },
        {
          id: '9',
          value: '9',
          labelResourceId: 'months9Label'
        },
        {
          id: '10',
          value: '10',
          labelResourceId: 'months10Label'
        },
        {
          id: '11',
          value: '11',
          labelResourceId: 'months11Label'
        },
        {
          id: '12',
          value: '12',
          labelResourceId: 'months12Label'
        }
      ]
    },
    {
      id: 'enableFunding',
      type: 'multiSelectOptionType',
      labelResourceId: 'enableFundingLabel',
      helpTextResourceId: 'enableFundingHelpText',
      defaultValue: 'credit,paylater,venmo',
      options: [
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
    },
    {
      id: 'messagingLayout',
      type: 'optionType',
      labelResourceId: 'messagingLayoutLabel',
      helpTextResourceId: 'messagingLayoutHelpText',
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
  ],
  locales: {
    en: {
      resources: en
    }
  }
};

export default config;
