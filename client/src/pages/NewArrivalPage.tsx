import Header from "../features/navigation/components/Header";
import { fetchNewProducts } from "../features/product/api/FetchNewProducts";
import ProductList from "../features/product/components/ProductList";

const NewArrivalPage: React.FC = () => {
  return (
    <>
      <Header />
      <ProductList fetchProducts={fetchNewProducts}/>
    </>
  );
};

export default NewArrivalPage;
