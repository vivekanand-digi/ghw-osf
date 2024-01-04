import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';
import * as resources from '@oracle-cx-commerce/resources';

/**
 * The list below declares which of the locale resources should be made available to the widget
 */

const resourceKeys = ['faqTitle','faqLink', 'rewardsTitle', 'rewardsLink', 'customerServiceTitle', 'customerServiceLink', 'cancellationTitle', 'cancellationLink', 'guaranteeTitle', 'guaranteeLink', 'returnPolicyTitle', 'returnPolicyLink', 'privacyPolicyLink', 'tcLink', 'retunPolicyLink', 'copyrightNoticeLink'];

/**
 * Design Studio configuration properties for the WidgetName component.
 */
const config = {
  properties: [
    {
      id: 'faqTitle',
      type: 'stringType',
      labelResourceId: 'faqTitleLabel',
    },
    {
      id: 'faqLink',
      type: 'stringType',
      labelResourceId: 'faqLinkLabel',
    },
    {
      id: 'rewardsTitle',
      type: 'stringType',
      labelResourceId: 'rewardsTitleLabel',
    },
    {
      id: 'rewardsLink',
      type: 'stringType',
      labelResourceId: 'rewardsLinkLabel',
    },
    {
      id: 'customerServiceTitle',
      type: 'stringType',
      labelResourceId: 'customerServiceTitleLabel',
    },
    {
      id: 'customerServiceLink',
      type: 'stringType',
      labelResourceId: 'customerServiceLinkLabel',
    },
    {
      id: 'cancellationTitle',
      type: 'stringType',
      labelResourceId: 'cancellationTitleLabel',
    },
    {
      id: 'cancellationLink',
      type: 'stringType',
      labelResourceId: 'cancellationLinkLabel',
    },
    {
      id: 'guaranteeTitle',
      type: 'stringType',
      labelResourceId: 'guaranteeTitleLabel',
    },
    {
      id: 'guaranteeLink',
      type: 'stringType',
      labelResourceId: 'guaranteeLinkLabel',
    },
    {
      id: 'returnPolicyTitle',
      type: 'stringType',
      labelResourceId: 'returnPolicyTitleLabel',
    },
    {
      id: 'returnPolicyLink',
      type: 'stringType',
      labelResourceId: 'returnPolicyLinkLabel',
    },
    {
      id: 'privacyPolicyLink',
      type: 'stringType',
      labelResourceId: 'privacyPolicyLinkLabel',
    },
    {
      id: 'tcLink',
      type: 'stringType',
      labelResourceId: 'tcLinkLabel',
    },
    {
      id: 'retunPolicyLink',
      type: 'stringType',
      labelResourceId: 'retunPolicyLinkLabel',
    },
    {
      id: 'copyrightNoticeLink',
      type: 'stringType',
      labelResourceId: 'copyrightNoticeLinkLabel',
    },
    
  ],
  locales: buildConfigResources(resources, resourceKeys)
};

export default config;

