import {ContainerContext, ProductContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import React, {useContext, useState, useCallback, useEffect} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import {getCurrentPageId} from '@oracle-cx-commerce/commerce-utils/selector';
import {isEmptyObject} from '@oracle-cx-commerce/utils/generic';
import VariantButtons from './components/product-variant-button';
import FrequencyVariantButtons from './components/product-frequency-variant-button';
import VariantSelect from './components/product-variant-select';
import VariantSwatches from './components/product-variant-swatches';
import css from './ghw-product-variant-options.css';
import {useComponentData} from './selectors';
/**
 * Utility method to get the currently selected variant
 * @param {Object} pVariantOptions the variant options
 * @return {String} the selected option
 */
const getCurrentSelectedItem = (pVariantOptions = []) => {
  return Object.keys(pVariantOptions).reduce((previous, current) => {
    const {selectedValue} = pVariantOptions[current];

    return `${previous}${current}=${selectedValue !== null ? selectedValue : '.+'};`;
  }, '');
};

/**
 * A widget for displaying product variant options in the form of drop down, buttons or swatches based on configuration.
 * The temporary selections of the variant options and sku are maintained at the ContainerContext level.
 * This information is used by other widgets to get selected Sku, selected Sku images, selected Sku stock status.
 * Only valid Sku options can be selected, invalid options or unavailable options are disabled.
 */
const GHWProductVariantOptions = props => {
  const {variantOptionType = 'buttons', colorSwatchImageWidth = 40, colorSwatchImageHeight = 40} = props;
  // resources
  const {
    textPleaseSelect,
    colorSwatchUrlPlaceholder = '',
    unavailableSwatchOverlayImage = '',
    colorSwatchMappingProperty = 'x_swatchMapping',
    swatchVariantOption = 'color',
    colorSwatchShape
  } = props;

  // context
  const {getState} = useContext(StoreContext);
  const store = useContext(StoreContext);
  const {action} = store;

  const pageId = getCurrentPageId(getState()) || '';

  const {
    id: productId,
    [colorSwatchMappingProperty]: swatchMapping = null,
    variantOptionPermutations,
    variantOptionsSeed,
    variantToSkuLookup = [],
    childSKUs,
    productVariantOptions,
    x_applicableFrequency: applicableFrequency,
    x_accentColor
  } = useContext(ProductContext);

  console.log('ProductContext ---> ', useContext(ProductContext));

  const [SKUs, setSKUs] = useState([]);
  useEffect(() => {
    if (childSKUs !== undefined && childSKUs.length > 0) {
      action('listSkus', {
        skuIds: childSKUs.join(',')
      }).then(response => {
        console.log('SKU Info -->', response);
        if (response.ok === false) {
          console.error('SKUs not found');
        } else {
          const catalogRepositorySkus = response.delta.catalogRepository ? response.delta.catalogRepository.skus : null;
          setSKUs(catalogRepositorySkus);
        }
      });
    }
  }, [childSKUs, action]);

  const {selections = {}, setSelections} = useContext(ContainerContext);

  // selectors
  const {x_skuSubscriptionBenefits} = useComponentData();
  console.log('onetime---->1', useComponentData());

  // custome logic foe varinat section START
  const [selectedCount, setSelectedCount] = useState();
  const [selectedCountValue, setSelectedCountValue] = useState();
  const [selectedFrequency, setSelectedFrequency] = useState();
  const [selectedFrequencyValue, setSelectedFrequencyValue] = useState();
  const [showButtons, setShowButtons] = useState(false);
  const [active, setActive] = useState('');
  const [varSeedOptions, setVarSeedOptions] = useState({});

  const generateSeletedObjecte = (flag = true) => {
    if (variantOptionsSeed) {
      const varinetUpdateObjecte = {};
      const varSeedKeys = Object.keys(variantOptionsSeed);
      const varSeed = {};
      let frequency;
      varSeedKeys.forEach(varKey => {
        console.log('key ->', varKey);
        const varkeyObj = variantOptionsSeed[varKey];
        console.log('value ->', varkeyObj);
        varSeed[varKey] = {
          optionName: varkeyObj.optionName,
          optionId: varkeyObj.optionId,
          selectedValue: varkeyObj.optionName === 'Mode' ? selectedFrequencyValue : selectedCountValue
        };
        if (selectedFrequency && varkeyObj.optionName === 'Mode') {
          const getModeValue = selectedFrequency.split('=')[1];
          varkeyObj.options.forEach(ele => {
            if (ele.value === Number.parseInt(getModeValue.split(';')[0], 10)) {
              if (ele.name === 'Onetime') {
                frequency = ele.name;
              } else if (flag && active !== '') {
                frequency = active;
              } else {
                frequency = '1 Month';
                setActive('1 Month');
              }
            }
          });
        }
      });
      setVarSeedOptions(varSeed);
      varinetUpdateObjecte['skuId'] = productId;
      varinetUpdateObjecte['variantOptions'] = varSeed;
      varinetUpdateObjecte['freq'] = frequency;
      varinetUpdateObjecte['qty'] = 1;
      varinetUpdateObjecte['selectedStore'] = {};
      varinetUpdateObjecte['isPickupInStoreOptionSelected'] = false;
      console.log('generated function --> ', varinetUpdateObjecte);

      return varinetUpdateObjecte;
    }
  };

  useEffect(() => {
    let skuKey = `${selectedCount}${selectedFrequency}`;
    if (productVariantOptions !== undefined && productVariantOptions.length === 1) {
      skuKey = selectedFrequency;
    }
    const selectedSKU = variantToSkuLookup[skuKey];
    const varinetUpdateObjecte = generateSeletedObjecte(true);
    if (typeof selectedSKU !== 'undefined') {
      varinetUpdateObjecte.skuId = selectedSKU;
      console.log('on frequncy chnage setSelections --> ', varinetUpdateObjecte);
      setSelections(varinetUpdateObjecte);
    }
    // setSelectedSKU(selectedSKU);
  }, [selectedCount, selectedFrequency]);

  // Function to handle count selection change
  const handleCountChange = (mapKeyPropertyAttribute, value) => {
    setSelectedCount(`${mapKeyPropertyAttribute}=${value};`);
    setSelectedCountValue(value);
  };

  // Function to handle frequency selection change
  const handleFrequencyChange = (mapKeyPropertyAttribute, value, showBTN) => {
    setSelectedFrequency(`${mapKeyPropertyAttribute}=${value};`);
    setSelectedFrequencyValue(value);
    setShowButtons(showBTN);
  };

  const selectedTagOption = (mapKeyPropertyAttribute, value) => {
    if (isEmptyObject(varSeedOptions)) {
      return false;
    }

    return varSeedOptions[mapKeyPropertyAttribute].selectedValue === value;
  };

  const renderCountsOption = () => {
    if (productVariantOptions !== undefined) {
      return productVariantOptions.map(productVariant => {
        if (productVariant.optionName === 'Count') {
          const variantOSeed = variantOptionsSeed[productVariant.mapKeyPropertyAttribute];
          console.log('testing---->', varSeedOptions);
          if (variantOSeed.optionName === 'Count') {
            return variantOSeed.options.map(varOptions => {
              const cssClass = selectedTagOption(productVariant.mapKeyPropertyAttribute, varOptions.value)
                ? 'quantity active'
                : 'quantity';

              return (
                <>
                  <button
                    type="button"
                    id={varOptions.value}
                    className={cssClass}
                    disabled={varOptions.disabled}
                    onClick={() => handleCountChange(productVariant.mapKeyPropertyAttribute, varOptions.value)}
                  >
                    {varOptions.name}
                  </button>
                </>
              );
            });
          }
        }

        return '';
      });
    }
  };

  const renderModeOption = () => {
    if (productVariantOptions !== undefined) {
      return productVariantOptions.map(productVariant => {
        if (productVariant.optionName === 'Mode') {
          const variantOSeed = variantOptionsSeed[productVariant.mapKeyPropertyAttribute];
          if (variantOSeed.optionName === 'Mode') {
            return variantOSeed.options.map(varOptions => {
              const selectRadio = selectedTagOption(productVariant.mapKeyPropertyAttribute, varOptions.value)
                ? true
                : false;
              if (varOptions.name === 'Onetime') {
                return (
                  <div key={varOptions.value} className="selection">
                    <input
                      type="radio"
                      id="Onetime"
                      name="mode"
                      className="input-radio"
                      value={varOptions.value}
                      checked={selectRadio}
                      onChange={() =>
                        handleFrequencyChange(productVariant.mapKeyPropertyAttribute, varOptions.value, false)
                      }
                      disabled={varOptions.disabled}
                    />
                    <label htmlFor="standalon">one-time purchase </label>
                    {/* <div className="amount">$219.95</div> */}
                  </div>
                );
              }

              return (
                <>
                  <div className="selection">
                    <input
                      type="radio"
                      id="Subscribe"
                      name="mode"
                      className="input-radio"
                      value={varOptions.value}
                      checked={selectRadio}
                      onChange={() =>
                        handleFrequencyChange(productVariant.mapKeyPropertyAttribute, varOptions.value, true)
                      }
                      disabled={varOptions.disabled}
                    />
                    <label htmlFor="subscrition"><span>Monthly Auto-Ship Purchase - <span> Save Up To 30%</span></span><div>Modify or cancel at anytime</div></label>
                    {/* <div className="amount">$174.95</div> */}
                  </div>
                </>
              );
            });
          }
        }

        return '';
      });
    }
  };

  const benefits = () => {
    
  console.log("x_skuSubscriptionBenefits  : ", x_skuSubscriptionBenefits);
  if (x_skuSubscriptionBenefits != null) {

      return (
        <div className="subscription-benefit-cnr">
          <h3 className="heading">
            Awesome! Subscription Benefits
          </h3>
          
          {/* {x_skuSubscriptionBenefits} */}
          <div dangerouslySetInnerHTML={{__html: x_skuSubscriptionBenefits}}></div>
        </div>
      );
    }

    return '';
  };

  const handleClick = event => {
    setActive(event.target.id);
    console.log('selested freq -->evenet , active ', event.target.id, active);
  };
  useEffect(() => {
    if (selectedCount === undefined && selectedFrequency === undefined) {
      setSelections({...selections, freq: active});
    } else {
      let skuKey = `${selectedCount}${selectedFrequency}`;
      if (productVariantOptions.length === 1) {
        skuKey = selectedFrequency;
      }
      const selectedSKU = variantToSkuLookup[skuKey];
      let varinetUpdateObjecte;
      if (typeof selectedSKU !== 'undefined') {
        varinetUpdateObjecte = generateSeletedObjecte();
        varinetUpdateObjecte.skuId = selectedSKU;
        varinetUpdateObjecte.freq = active === '' ? '1 Month' : active;
        console.log('active change before--->', varinetUpdateObjecte);
        setSelections(varinetUpdateObjecte);
        console.log('active changeafter--->', selections);
      }
    }
    // setSelectedSKU(selectedSKU);
  }, [active]);
  const frequencyButtons = () => {
    const buttons = applicableFrequency === undefined ? ['1', '2', '3'] : applicableFrequency.split(',');

    return (
      <>
        {buttons.includes('1') ? (
          <button
            type="button"
            key={1}
            className={active === '1 Month' ? 'btn-item active' : 'btn-item'}
            id={'1 Month'}
            onClick={handleClick}
          >
            1 Month
          </button>
        ) : null}
        {buttons.includes('2') ? (
          <button
            type="button"
            key={2}
            className={active === '2 Months' ? 'btn-item active' : 'btn-item'}
            id={'2 Months'}
            onClick={handleClick}
          >
            2 Months
          </button>
        ) : null}
        {buttons.includes('3') ? (
          <button
            type="button"
            key={3}
            className={active === '3 Months' ? 'btn-item active' : 'btn-item'}
            id={'3 Months'}
            onClick={handleClick}
          >
            3 Months
          </button>
        ) : null}
      </>
    );
  };

  const autoSectionSKU = () => {
    const varinetUpdateObjecte = {};
    const varSeed = {};
    let maxCount = 0;
    let finalCountValue, subscribeValue, countmapKey, subMapKey;
    if (productVariantOptions && variantToSkuLookup) {
      productVariantOptions.forEach(productVar => {
        varSeed[productVar.mapKeyPropertyAttribute] = {
          optionName: productVar.optionName,
          optionId: productVar.optionId,
          selectedValue: null
        };
        if (productVar.optionName === 'Count') {
          countmapKey = productVar.mapKeyPropertyAttribute;
          const countArray = Object.keys(productVar.optionValueMap);
          //check max remove ct number then convert
          countArray.forEach(ele => {
            const num = Number.parseInt(ele.slice(0, -2), 10);
            if (maxCount < num) {
              maxCount = num;
            }
          });
          finalCountValue = productVar.optionValueMap[`${maxCount}ct`];
          varSeed[productVar.mapKeyPropertyAttribute].selectedValue = finalCountValue;
          //set count
          handleCountChange(productVar.mapKeyPropertyAttribute, finalCountValue);
        }
        if (productVar.optionName === 'Mode') {
          subMapKey = productVar.mapKeyPropertyAttribute;
          subscribeValue = productVar.optionValueMap['Subscribe'];
          varSeed[productVar.mapKeyPropertyAttribute].selectedValue = subscribeValue;
          // set freq
          handleFrequencyChange(productVar.mapKeyPropertyAttribute, subscribeValue, true);
        }
      });
      setVarSeedOptions(varSeed);
      varinetUpdateObjecte['variantOptions'] = varSeed;
      varinetUpdateObjecte['qty'] = 1;
      varinetUpdateObjecte['selectedStore'] = {};
      varinetUpdateObjecte['isPickupInStoreOptionSelected'] = false;
      if (productVariantOptions.length === 1) {
        varinetUpdateObjecte['skuId'] = variantToSkuLookup[`${subMapKey}=${subscribeValue};`];
      } else {
        const key = `${countmapKey}=${finalCountValue};${subMapKey}=${subscribeValue};`;
        varinetUpdateObjecte['skuId'] = variantToSkuLookup[key];
      }
      varinetUpdateObjecte.freq = '1 Month';
      console.log('auto selected before--->', varinetUpdateObjecte);
      // setSelections(varinetUpdateObjecte);
      // setActive('1 Month');
      // setShowButtons(true);
    }
  };

  useEffect(autoSectionSKU, [variantToSkuLookup, productVariantOptions, setSelections]);
  // custome logic foe varinat section END

  return (
    <Styled id="GHWProductVariantOptions" css={css}>
      {/* <h4>Frequency</h4> */}
      <div className="GHWProductTypeSelection">
        <div className="payment-selection">
          {renderModeOption()}
          {showButtons ? (
            <>
              {/* <div className="capsule-month desktop" id="box">
                {frequencyButtons()}
              </div> */}
              <div className="capsule-month ipad" id="box">
                {/* {frequencyBUttons()} */}
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="button-group">
        {productVariantOptions !== undefined && productVariantOptions.length > 1 ? (
          <h4>Other Sizes Available:</h4>
        ) : null}
        <div className="buttons">{renderCountsOption()}</div>
      </div>
      {benefits()}
    </Styled>
  );
};

export default GHWProductVariantOptions;
