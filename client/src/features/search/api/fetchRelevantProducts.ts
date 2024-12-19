/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductFromDB } from "../../product/types/ProductFromDB";

export const fetchRelevantProducts = async (term:string): Promise<ProductFromDB[]> => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const res = await fetch(`${serverUrl}/api/product/relevant/${term}`, {
    method: "GET",
  });
  const data = await res.json();
  const relevantProducts: ProductFromDB[] = data.product.map((prod: any) => ({
    id: prod.product_id,
    name: prod.name,
    description: data.product.description,
    href: `/product/${prod.product_id}`,
    price: prod.price,
    imageSrc: prod.img_url,
    imageAlt: `${prod.name} image`,
  }));
  return relevantProducts;
};
