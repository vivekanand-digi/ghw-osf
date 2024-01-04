/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import * as resourceBundle from '@oracle-cx-commerce/resources';
import {TOTAL_NUMBER_OF_IMAGES} from '@oracle-cx-commerce/react-widgets/common/image-carousel/settings';
import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';
import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';

const configResourceKeys = [
  'titleLabel',
  'autoSlideImagesLabel',
  'autoSlideIntervalLabel',
  'slideMediaLabel',
  'mediaAltTextLabel',
  'mediaAltHelpText',
  'mediaTitleTextLabel',
  'mediaTitleHelpText',
  'mediaLinkURLLabel',
  'mediaLinkURLHelpText',
  'slideMediaLinkBehaviorLabel',
  'mediaTargetSelfLabel',
  'mediaTargetBlankLabel',
  'slideTitleLabel1',
  'slideTitleLabel2',
  'slideTitleLabel3',
  'slideTitleLabel4',
  'slideTitleLabel5'
];

const config = mergeDefaultConfig({
  properties: [
    {
      id: 'title',
      type: 'stringType',
      labelResourceId: 'titleLabel',
      defaultValue: 'SHOP ALL'
    },
    {
      id: 'isAutoSlide',
      type: 'booleanType',
      labelResourceId: 'autoSlideImagesLabel',
      defaultValue: true
    },
    {
      id: 'autoSlideInterval',
      type: 'stringType',
      labelResourceId: 'autoSlideIntervalLabel',
      defaultValue: '8',
      pattern: '^[1-9]\\d*$'
    }
  ],
  locales: buildConfigResources(resourceBundle, configResourceKeys)
});

// Iterating over each slide config based on configuration.
for (let index = 1; index < TOTAL_NUMBER_OF_IMAGES + 1; index++) {
  const slideConfig = [
    {
      id: `slideTitle-${index}`,
      type: 'sectionTitleType',
      labelResourceId: `slideTitleLabel${index}`
    },
    {
      id: `slideMedia-${index}`,
      type: 'mediaType',
      labelResourceId: `slideMediaLabel`,
      required: false
    },
    {
      id: `slideMediaAlt-${index}`,
      type: 'stringType',
      labelResourceId: `mediaAltTextLabel`,
      defaultValue: '',
      helpTextResourceId: `mediaAltHelpText`,
      required: false
    },
    {
      id: `slideMediaTitle-${index}`,
      type: 'stringType',
      labelResourceId: `mediaTitleTextLabel`,
      defaultValue: '',
      helpTextResourceId: `mediaTitleHelpText`,
      required: false
    },
    {
      id: `Banner_Title-${index}`,
      type: 'webContentType',
      labelResourceId: `BannerTitleLabel`,
      defaultValue: '',
      helpTextResourceId: `BannerTitleHelpText`,
      required: false
    },
    {
      id: `Banner_Desc-${index}`,
      type: 'webContentType',
      labelResourceId: `BannerDescriptionLabel`,
      defaultValue: '',
      helpTextResourceId: `BannerDescriptionHelpText`,
      required: false
    },
    {
      id: `slideMediaLink-${index}`,
      type: 'stringType',
      maxLength: 2000,
      labelResourceId: `mediaLinkURLLabel`,
      defaultValue: '',
      helpTextResourceId: `mediaLinkURLHelpText`,
      required: false
    },
    {
      id: `slideMediaLinkBehavior-${index}`,
      type: 'optionType',
      labelResourceId: `slideMediaLinkBehaviorLabel`,
      defaultValue: '_self',
      options: [
        {
          id: 'mediaTargetSelf',
          value: '_self',
          labelResourceId: 'mediaTargetSelfLabel'
        },
        {
          id: 'mediaTargetBlank',
          value: '_blank',
          labelResourceId: 'mediaTargetBlankLabel'
        }
      ],
      required: false
    }
  ];

  // Append each slide config.
  config.properties.push(...slideConfig);
}
export default config;
