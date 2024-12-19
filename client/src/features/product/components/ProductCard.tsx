import { ProductCardProps } from "../types/ProductCardProps";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const rating = product.rating ?? 0;
  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <a href={product.href} className="group">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
          <img
            alt={product.imageAlt}
            src={product.imageSrc}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <h3 className="mt-6 text-sm text-gray-900 font-medium group-hover:text-emerald-600">
          {product.name}
        </h3>
        {/* Stars and Reviews */}
        <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < rating ? "text-yellow-300" : "text-gray-200"}
              >
                ★
              </span>
            ))}
          </div>
          {/* Number of Reviews */}
          <p className="text-xs sm:text-sm truncate overflow-hidden text-gray-500 font-light">
            {product.reviews} {product.reviews <= 1 ? "review" : "reviews"}
          </p>
        </div>
        <p className="mt-2 text-sm font-base text-gray-900 group-hover:text-emerald-600">
          ${product.price}
        </p>
      </a>
    </div>
  );
};

export default ProductCard;
