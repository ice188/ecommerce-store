/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartItem } from "../types/CartItem";

export const FetchCartItems = async (cartId: string) => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${serverUrl}/api/cart/${cartId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${token}`, 
    },
  });
  const data = await res.json();

  const cartItems: CartItem[] = data.item.map((item: any) => ({
    cart_item_id: item.cart_item_id,
    name: item.name,
    img_url: item.img_url,
    price: item.price,
    quantity: item.quantity,
    product_href: `/product/${item.product_id}`,
  }));
  return cartItems;
};
