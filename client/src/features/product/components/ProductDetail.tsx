import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { fetchProductById } from "../api/FetchProductById";
import { Product } from "../types/Product";
import { ReviewContext } from "../../review/contexts/ReviewContext";
import { addCartItem } from "../../cart/api/AddCartItem";
import { LoginStatus } from "../../authentication/api/LoginStatus";
import { User } from "../../authentication/types/User";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState<number>(1);
  const { averageRating, reviewCount } = useContext(ReviewContext);
  const navigate = useNavigate();
  const [showAddedToCartMsg, setShowAddedToCartMsg] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const { user } = await LoginStatus();
      setUser(user);
    };
    loadAuth();
  }, []);

  const handleAddToCart = async () => {
    if (id && user) {
      await addCartItem(user.user_id.toString(), id, quantity);
      setShowAddedToCartMsg(true);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const loadProductById = async () => {
      if (id) {
        const productByIdData = await fetchProductById(id);
        const productByIdWithRating = {
          ...productByIdData,
          rating: averageRating,
          reviews: reviewCount,
        };
        setProduct(productByIdWithRating);
      }
    };
    loadProductById();
  }, [id, averageRating, reviewCount]);

  useEffect(() => {
    const handleScroll = () => {
      setShowAddedToCartMsg(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div>
      {product ? (
        <div className="bg-white">
          <div className="pt-6 pb-6">
            <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:px-8 ">
              {/* Image */}
              <div className="lg:px-16 ">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
              </div>
              <div className="mx-auto max-w-2xl px-4 pb-0 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:pr-16">
                <div className="lg:row-span-4 mt-4">
                  {/* Name */}
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                    {product.name}
                  </h1>

                  {/* Reviews */}
                  <div className="mt-4">
                    <h3 className="sr-only">Reviews</h3>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < product.rating
                                ? "text-yellow-300"
                                : "text-gray-200"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-sm font-light leading-none text-gray-900 dark:text-gray-400">
                        {product.rating}
                      </p>
                      <p className="sr-only">
                        {product.reviews} out of 5 stars
                      </p>
                      <a
                        href={"#"}
                        className="ml-4 text-sm font-medium text-emerald-600 hover:text-emerald-500"
                      >
                        {product.reviews} reviews
                      </a>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="sr-only">Description</h3>

                    <div className="space-y-6">
                      <p className="text-base text-gray-900 mt-6">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6"></div>
                  {/* Price */}
                  <h2 className="sr-only">Product information</h2>
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-3xl tracking-tight text-gray-900">
                      ${product.price}
                    </p>
                    <div className="flex items-center">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-1 border border-gray-300 rounded-l-md"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-t border-b border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-1 border border-gray-300 rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Delivery options: to be implemented */}

                  {/* Add to Bag */}
                  <button
                    onClick={handleAddToCart}
                    className="mt-6 flex w-full items-center justify-center rounded-md bg-emerald-600 px-8 py-3 text-base font-medium text-white hover:bg-emerald-300 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Add to cart
                  </button>

                  <div className="fixed top-[48px] right-0 text-center ">
                    {showAddedToCartMsg && (
                      <div className="mb-8 bg-emerald-100 border-t-4 border-emerald-500 rounded-b text-emerald-900 px-4 py-3 shadow-md">
                        <div className="flex items-center">
                          <div className="py-1 mr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Added To Cart</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Product does not exist</p>
      )}
    </div>
  );
};
export default ProductDetail;
