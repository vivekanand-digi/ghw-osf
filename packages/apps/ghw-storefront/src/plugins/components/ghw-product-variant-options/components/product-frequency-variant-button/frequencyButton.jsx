
import React, {useContext, useState, useEffect} from 'react';
import {StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {useComponentData} from '../../../product/ghw-product-quantity/selectors';

const FrequencyButton = props => {
  const [active, setActive] = useState(props.selected);
  const {action, getState} = useContext(StoreContext);
  const {selections, setSelections} = useComponentData(getState());
  console.log('selections in variant', selections);

  const handleClick = event => {
    setActive(event.target.id);
    console.log('selested freq --> ', active);
    setSelections(prevState => {
      return {
        ...prevState,
        freq: active
      };
    });
  };
  useEffect(() => {
  }, [])
  

  return (
    <>
      <button key={1} className={active === '1 Month' ? 'btn active' : 'btn'} id={'1 Month'} onClick={handleClick}>
      1 Month
      </button>

      <button key={2} className={active === '2 Months' ? 'btn active' : 'btn'} id={'2 Months'} onClick={handleClick}>
      2 Months
      </button>

      <button key={3} className={active === '3 Months' ? 'btn active' : 'btn'} id={'3 Months'} onClick={handleClick}>
        3 Months
      </button>
    </>
  );
};

export default FrequencyButton;
