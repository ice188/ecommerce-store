/* eslint-disable @typescript-eslint/no-unused-vars */
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { FetchCartItems } from "../../cart/api/FetchCartItems";
import { useParams } from "react-router-dom";
import { CartItem } from "../../cart/types/CartItem";
import { deleteCardItem } from "../../cart/api/DeleteCartItem";
import { updateCartItemQuantity } from "../../cart/api/UpdateCartItemQuantity";
import { fetchOrderById } from "../api/FetchOrderById";
import { Order } from "../types/Order";
import { formatDate } from "../../../utils/formatDate";
import { LoginStatus } from "../../authentication/api/LoginStatus";
import { User } from "../../authentication/types/User";

export default function OrderDetail() {
  const { oid } = useParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showShippingTooltip, setShowShippingTooltip] = useState(false);
  const [subtotal, setSubtotal] = useState<number>(0.99);
  const [amount, setAmount] = useState<number>(0.99);
  const [tax, setTax] = useState<number>(4.0);
  const [shipping, setShipping] = useState<number>(10.0);
  const [order, setOrder] = useState<Order>();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const { user } = await LoginStatus();
      setUser(user);
    };
    loadAuth();
  }, []);

  useEffect(() => {
    const loadOrder = async () => {
      if (!oid) {
        return;
      }
      setOrder(await fetchOrderById(oid));
    };
    loadOrder();
  }, [oid]);

  useEffect(() => {
    const loadCartItems = async () => {
      console.log(order);
      if (!order) {
        return;
      }
      const cartItems = await FetchCartItems(order?.cart_id.toString());
      setCartItems(cartItems);

      setSubtotal(
        parseFloat(
          cartItems
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2)
        )
      );
      setAmount(parseFloat((subtotal + tax + shipping).toFixed(2)));
    };
    loadCartItems();
    console.log(cartItems);
  }, [cartItems, order, shipping, subtotal, tax]);

  const toggleShippingTooltip = () => {
    setShowShippingTooltip(!showShippingTooltip);
  };

  const incrementQuantity = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cart_item_id.toString() === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    const item = cartItems.find(
      (cartItem) => cartItem.cart_item_id.toString() === itemId
    );
    if (item) {
      updateCartItemQuantity(itemId, item.quantity + 1);
    }
  };

  const decrementQuantity = (itemId: string) => {
    const item = cartItems.find(
      (cartItem) => cartItem.cart_item_id.toString() === itemId
    );
    if (item) {
      updateCartItemQuantity(itemId, item.quantity > 2 ? item.quantity - 1 : 1);
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cart_item_id.toString() === itemId
          ? { ...item, quantity: item.quantity > 2 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl max-md:max-w-xl mx-auto bg-white py-8 max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4">
          <h3 className="text-2xl font-semibold text-gray-900">
            Order Details
          </h3>
          {order && (
            <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
              For order created on {formatDate(order?.update_time)}
            </p>
          )}
          <div className="grid md:grid-cols-[1.5fr_1fr_2fr] gap-9 mt-6">
            <div className="md:col-span-2 space-y-4 ">
              <hr className="border-gray-300" />
              {cartItems.map((item) => (
                <div key={item.cart_item_id}>
                  <div className="grid grid-cols-3 items-start gap-4">
                    <div className="col-span-2 flex items-start gap-4">
                      <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0">
                        <a href={item.product_href}>
                          <img
                            src={item.img_url}
                            className="w-full h-full object-contain"
                            alt={item.name}
                          />
                        </a>
                      </div>
                      <div className="flex flex-col justify-between h-28 max-sm:h-24 ">
                        <p className="font-medium text-gray-900 ">
                          {item.name}
                        </p>

                        <div className="text-gray-500 text-sm flex items-end ">
                          Quantity:
                          <div className="pl-2">
                            <span className="px-2 py-0.5 border border-gray-300">
                              {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between h-28 ml-auto max-sm:h-24">
                      <p className="flex ml-auto mr-3 text-xl">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  </div>

                  <hr className="border-gray-300 mt-4" />
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-md p-8 h-max">
              <h3 className="text-lg font-medium max-sm:text-base text-gray-800 border-b border-gray-300 pb-4">
                Order Summary
              </h3>

              <ul className="text-gray-800 mt-6 space-y-4">
                <li className="flex flex-wrap font-light gap-4 text-sm">
                  Subtotal{" "}
                  <span className="ml-auto font-medium">${subtotal}</span>
                </li>
                <li className="flex flex-wrap gap-4 font-light text-sm items-center">
                  Shipping{" "}
                  <QuestionMarkCircleIcon
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={() => toggleShippingTooltip()}
                  />
                  <span className="ml-auto font-medium">${shipping}</span>
                  {showShippingTooltip && (
                    <div className="bg-gray-100 text-gray-600 font-light text-xs p-2 rounded ml-6">
                      This is an estimate based on your current shipping
                      address.
                    </div>
                  )}
                </li>
                <li className="flex flex-wrap gap-4 font-light text-sm items-center">
                  Tax
                  <span className="ml-auto font-medium">${tax}</span>
                </li>
                <hr className="border-gray-300" />
                <li className="flex flex-wrap gap-4 font-medium text-lg">
                  Order Total <span className="ml-auto">${amount}</span>
                </li>
              </ul>
              <div className="mt-6 space-y-3">
                <a href={`/order/${user?.user_id}`}>
                  <button
                    type="button"
                    className="text-sm px-4 py-3 w-full font-semibold tracking-wide bg-emerald-600 hover:bg-emerald-400 text-white rounded-md"
                  >
                    Back To Orders
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
