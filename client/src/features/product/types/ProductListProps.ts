import { ProductFromDB } from "./ProductFromDB";

export interface ProductListProps {
    fetchProducts: () => Promise<ProductFromDB[]>;
}