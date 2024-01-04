import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
import * as en from './locales/en';
/**
 * Design Studio configuration properties for the WidgetName component.
 */
const config = {
  properties: [
    {
      id: 'enableFunding',
      type: 'multiSelectOptionType',
      labelResourceId: 'enableFundingLabel',
      helpTextResourceId: 'enableFundingHelpText',
      defaultValue: 'card,credit,paylater',
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
  ],
  locales: {
    en: {
      resources: en
    }
  }
};

const desktopConfigResourceKeys = [
  'configEnableMiniCartOnDesktopLabel',
  'configEnableMiniCartOnDesktopHelpText',
  'configDisplayCheckoutButtonOnMiniCartLabel',
  'configDisplayCheckoutButtonOnMiniCartHelpText',
  'configMiniCartItemsBeforeScrollingLabel',
  'configMiniCartItemsBeforeScrollingHelpText'
];

const mobileConfigResourceKeys = [
  'configDisplayCheckoutButtonOnMiniCartLabel',
  'configDisplayCheckoutButtonOnMiniCartHelpText'
];

const desktopConfig = mergeDefaultConfig({
  properties: [
    {
      id: 'enableMiniCartOnDesktop',
      type: 'booleanType',
      defaultValue: true,
      labelResourceId: 'configEnableMiniCartOnDesktopLabel',
      helpTextResourceId: 'configEnableMiniCartOnDesktopHelpText',
      required: false
    },
    {
      id: 'displayCheckoutButtonOnMiniCart',
      type: 'booleanType',
      defaultValue: true,
      labelResourceId: 'configDisplayCheckoutButtonOnMiniCartLabel',
      helpTextResourceId: 'configDisplayCheckoutButtonOnMiniCartHelpText',
      required: false
    },
    {
      id: 'miniCartItemsBeforeScrolling',
      type: 'stringType',
      defaultValue: '3',
      labelResourceId: 'configMiniCartItemsBeforeScrollingLabel',
      helpTextResourceId: 'configMiniCartItemsBeforeScrollingHelpText',
      required: false
    },
    ...config.properties
  ],
  locales: buildConfigResources(resourceBundle, desktopConfigResourceKeys)
});

const mobileConfig = mergeDefaultConfig({
  properties: [
    {
      id: 'displayCheckoutButtonOnMiniCart',
      type: 'booleanType',
      defaultValue: true,
      labelResourceId: 'configDisplayCheckoutButtonOnMiniCartLabel',
      helpTextResourceId: 'configDisplayCheckoutButtonOnMiniCartHelpText',
      required: false
    },
    ...config.properties
  ],
  locales: buildConfigResources(resourceBundle, mobileConfigResourceKeys, config.locales)
});

export {desktopConfig, mobileConfig};
