/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

 import * as resourceBundle from '@oracle-cx-commerce/resources';

 import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';
 import {mergeDefaultConfig} from '@oracle-cx-commerce/react-widgets/config';
 
 const desktopConfigResourceKeys = [
   'configEnableMiniCartOnDesktopLabel',
   'configEnableMiniCartOnDesktopHelpText',
   'configDisplayCheckoutButtonOnMiniCartLabel',
   'configDisplayCheckoutButtonOnMiniCartHelpText',
   'configMiniCartItemsBeforeScrollingLabel',
   'configMiniCartItemsBeforeScrollingHelpText'
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
     {
      id: 'miniCartProducts',
      type: 'stringType',
      defaultValue: '3',
      labelResourceId: 'configMiniCartProductsLabel',
      helpTextResourceId: 'configMiniCartProductsHelpText',
      required: false
    }
   ],
   locales: buildConfigResources(resourceBundle, desktopConfigResourceKeys)
 });

 export default desktopConfig;
 
