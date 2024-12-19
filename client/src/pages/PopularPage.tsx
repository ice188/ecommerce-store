import Header from "../features/navigation/components/Header";
import { fetchPopularProducts } from "../features/product/api/FetchPopularProducts";
import ProductList from "../features/product/components/ProductList";

const PopularPage: React.FC = () => {
  return (
    <>
      <Header />
      <ProductList fetchProducts={fetchPopularProducts}/>
    </>
  );
};

export default PopularPage;
