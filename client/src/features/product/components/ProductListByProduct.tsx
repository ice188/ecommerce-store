import React from "react";

import ProductCard from "./ProductCard";
import { Product } from "../types/Product";


const ProductListByProduct: React.FC<{products:Product[]}> = ({ products:products }) => {

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8 z-0">
        <h2 className="sr-only">Products</h2>

        <div className="grid gap-x-4 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListByProduct;


