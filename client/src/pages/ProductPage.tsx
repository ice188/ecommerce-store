import { useParams } from "react-router-dom";
import Header from "../features/navigation/components/Header";
import ProductDetail from "../features/product/components/ProductDetail";
import ReviewList from "../features/review/components/ReviewList";
import { ReviewProvider } from "../features/review/contexts/ReviewContext";


const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>Product not found</div>;
  }
  return (
    <ReviewProvider id={id}>
      <Header />
      <ProductDetail />
      <ReviewList />
    </ReviewProvider>
  );
};

export default ProductPage;
