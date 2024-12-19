import { Address } from "./Address";

export interface AddressContextProps {
  address: Address | null;
  setAddress: (address: Address | null) => void;
}

export const defaultAddressContext: AddressContextProps = {
  address: null,
  setAddress: () => {},
};