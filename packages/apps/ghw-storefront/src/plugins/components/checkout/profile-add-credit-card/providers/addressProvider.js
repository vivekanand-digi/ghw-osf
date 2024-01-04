import React, {createContext, useContext, useState} from 'react';

export const AddressProviderContext = createContext();

const AddressProvider = ({children}) => {
  const [billingAddress, setBillingAddress] = useState({});

  return (
    <AddressProviderContext.Provider value={{billingAddress, setBillingAddress}}>
      {children}
    </AddressProviderContext.Provider>
  );
};

export default AddressProvider;
