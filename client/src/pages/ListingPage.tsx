import Header from "../features/navigation/components/Header";
import { fetchAllProducts } from "../features/product/api/FetchAllProducts";
import ProductList from "../features/product/components/ProductList";

const ListingPage: React.FC = () => {
  return (
    <>
      <Header />
      <ProductList fetchProducts={fetchAllProducts} />
    </>
  );
};

export default ListingPage;
