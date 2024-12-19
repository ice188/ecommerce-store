import { createContext, useEffect, useState } from "react";
import { Address } from "../types/Address";
import { FetchAddress } from "../api/FetchAddress";
import { AddressContextProps, defaultAddressContext } from "../types/AddressContextProps";

export const AddressContext = createContext<AddressContextProps>(defaultAddressContext);

export const AddressProvider: React.FC<{
  children: React.ReactNode;
  id: string;
}> = ({ children, id }) => {
  const [address, setAddress] = useState<Address|null>(null);

  useEffect(() => {
    const loadAddress = async () => {
      if (id) {
        const res = await FetchAddress(id);
        setAddress(res);
      }
    };
    loadAddress();
  }, [id]);


  return (
    <AddressContext.Provider value={{address, setAddress}}>
      {children}
    </AddressContext.Provider>
  );
};
