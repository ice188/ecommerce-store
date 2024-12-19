import { useCallback, useEffect, useState } from "react";
import { Product } from "../../product/types/Product";
import { fetchAllProducts } from "../../product/api/FetchAllProducts";
import { fetchReviewById } from "../../review/api/FetchReviewById";
import { getProductRating } from "../../review/utils/getProductRating";
import levenshtein from "js-levenshtein";
import ProductListByProduct from "../../product/components/ProductListByProduct";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [rankedProducts, setRankedProducts] = useState<Product[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      rankProducts(searchTerm);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      const productData = await fetchAllProducts();
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
  }, []);

  const rankProducts = useCallback(
    (searchTerm: string) => {
      const rankedProducts = products.map((product) => {
        const distance = levenshtein(
          searchTerm.toLowerCase(),
          product.name.toLowerCase()
        );
        return { product, distance };
      });
      rankedProducts.sort((a, b) => a.distance - b.distance);
      const top3Products = rankedProducts
        .slice(0, 3)
        .map((item) => item.product);
      setRankedProducts(top3Products);
    },
    [products]
  );

  return (
    <div className="bg-white ">
      <div className="flex justify-center items-start min-h-screen pt-12 w-full">
        <div className="flex-col w-full px-12 md:px-14 lg:px-16">
          <div className="relative w-full">
            <input
              type="text"
              name="q"
              className="w-full border border-gray-200 border-0 h-12 shadow p-6 rounded-full ring-1 ring-inset focus:ring-2 ring-gray-300 focus:ring-inset focus:ring-emerald-600"
              placeholder="Search an item, eg. apple"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <button type="submit" onClick={() => rankProducts(searchTerm)}>
              <svg
                className="text-emerald-600 h-5 w-5 absolute top-3.5 right-9 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                xmlSpace="preserve"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"></path>
              </svg>
            </button>
          </div>

          <ProductListByProduct products={rankedProducts} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
