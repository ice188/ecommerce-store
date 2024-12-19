/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductFromDB } from "../types/ProductFromDB";

export const fetchNewProducts = async (): Promise<ProductFromDB[]> => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const res = await fetch(`${serverUrl}/api/product/new`, {
    method: "GET",
  });
  const data = await res.json();
  const newProducts: ProductFromDB[] = data.product.map((prod: any) => ({
    id: prod.product_id,
    name: prod.name,
    description: data.product.description,
    href: `/product/${prod.product_id}`,
    price: prod.price,
    imageSrc: prod.img_url,
    imageAlt: `${prod.name} image`,
  }));
  return newProducts;
};
