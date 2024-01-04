import React, {useContext} from 'react';
import Checkbox from '@oracle-cx-commerce/react-components/checkbox';
import {ACHDirectDebitContext} from '../../context';

const SaveBankCheckbox = ({labelSavePaymentCheckbox, id}) => {
  const {setFormFieldValue} = useContext(ACHDirectDebitContext);

  return (
    <div className="ACHDirectDebit__Checkbox">
      <Checkbox
        id={`ACHDirectDebit-save-bank-option-${id}`}
        name="savePayment"
        labelText={labelSavePaymentCheckbox}
        onChange={e => {
          setFormFieldValue('savePayment', e.currentTarget.checked);
        }}
      />
    </div>
  );
};

export default SaveBankCheckbox;
