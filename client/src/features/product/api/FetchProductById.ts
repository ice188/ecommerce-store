import { ProductFromDB } from "../types/ProductFromDB";

export const fetchProductById = async (id: string): Promise<ProductFromDB> => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const res = await fetch(`${serverUrl}/api/product/${id}`, {
    method: "GET",
  });
  const data = await res.json();
  const productById: ProductFromDB = {
    id: data.product.product_id,
    name: data.product.name,
    description: data.product.description,
    href: `/product/${data.product.product_id}`,
    price: data.product.price,
    imageSrc: data.product.img_url,
    imageAlt: `${data.product.name} image`,
  };
  return productById;
};
