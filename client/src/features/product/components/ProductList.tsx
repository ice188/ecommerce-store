import React, { useEffect, useState } from "react";

import ProductCard from "./ProductCard";
import { getProductRating } from "../../review/utils/getProductRating";
import { fetchReviewById } from "../../review/api/FetchReviewById";
import { Product } from "../types/Product";
import { ProductListProps } from "../types/ProductListProps";

const ProductList: React.FC<ProductListProps> = ({ fetchProducts }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const productData = await fetchProducts();
      const productsWithRatings = await Promise.all(
        productData.map(async (product) => {
          const reviews = await fetchReviewById(product.id.toString()); 
          const { averageRating, reviewCount } = getProductRating(reviews);
          return { ...product, rating: averageRating, reviews: reviewCount };
        })
      );
      setProducts(productsWithRatings);
    };
    loadProducts();
  }, [fetchProducts]);


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

export default ProductList;


