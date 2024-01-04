import {PAGE_CHECKOUT_LINK} from '@oracle-cx-commerce/commerce-utils/constants/page-links';
import {PAGE_CART_LINK, PAGE_QUICK_ORDER_LINK} from './page-links';

export const SECURED_PAGES = [PAGE_CART_LINK, PAGE_CHECKOUT_LINK, PAGE_QUICK_ORDER_LINK];

/**
 * Site Ids constants
 */
export const REFUSE_SITE_ID = 'siteUS';
export const MIXER_SITE_ID = '100001';

/**
 * Order Taken By constants
 */
export const REFUSE_STORE_ORDER_SOURCE = 'WEBREF';
export const MIXER_STORE_ORDER_SOURCE = 'WEBMIX';

export const REFUSE_AGENT_ORDER_SOURCE = 'WEBREFAG';
export const MIXER_AGENT_ORDER_SOURCE = 'WEBMIXAG';

/**
 * Account and Contact Registration Constants
 */

export const openTermsType = 'Open Terms';
export const mixerType = 'Mixer';
export const creditCardApplyType = 'Credit Card Only';
export const refuseType = 'Refuse';
export const MINI_CART_TIMEOUT = 3000;
