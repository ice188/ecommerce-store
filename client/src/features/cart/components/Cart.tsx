/* eslint-disable @typescript-eslint/no-unused-vars */
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useMemo } from "react";
import { FetchCartItems } from "../api/FetchCartItems";
import { Link, useParams } from "react-router-dom";
import { CartItem } from "../types/CartItem";
import { deleteCardItem } from "../api/DeleteCartItem";
import { updateCartItemQuantity } from "../api/UpdateCartItemQuantity";
import { FetchCartId } from "../api/FetchCartId";
import { createOrder } from "../../order/api/CreateOrder";

export default function Cart() {
  const { id } = useParams<{ id: string }>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showShippingTooltip, setShowShippingTooltip] = useState(false);
  const [tax, setTax] = useState<number>(4.0);
  const [shipping, setShipping] = useState<number>(10.0);
  const [currency, setCurrency] = useState<string>("cad");
  const [cartId, setCartId] = useState<number>();

  useEffect(() => {
    const loadCartItems = async () => {
      if (id) {
        const cid = await FetchCartId(id);
        setCartId(cid);
        const cartItems = await FetchCartItems(cid);
        setCartItems(cartItems);
      }
    };
    loadCartItems();
  }, [id]);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const amount = useMemo(
    () => parseFloat((subtotal + tax + shipping).toFixed(2)),
    [subtotal, tax, shipping]
  );

  const handleNewOrder = async () => {
    //create order
    if (id) {
      sessionStorage.setItem("amount", amount.toString());
      sessionStorage.setItem("currency", currency);
    }
  };

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

  const handleDeleteItem = async (itemId: string) => {
    await deleteCardItem(itemId);
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cart_item_id.toString() !== itemId)
    );
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl max-md:max-w-xl mx-auto bg-white py-8 max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4">
          <h3 className="text-2xl font-semibold text-gray-900">Shopping Cart</h3>
          <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
            Manage Cart & Order Summary
          </p>
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
                        <p className="font-medium text-gray-900 ">{item.name}</p>

                        <div className="flex items-center">
                          <button
                            onClick={() => decrementQuantity(item.cart_item_id.toString())}
                            className="px-3 py-1 border border-gray-300 rounded-l-md"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-t border-b border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(item.cart_item_id.toString())}
                            className="px-3 py-1 border border-gray-300 rounded-r-md"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between h-28 ml-auto max-sm:h-24">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-400"
                        onClick={() => handleDeleteItem(item.cart_item_id.toString())}
                      >
                        <XMarkIcon
                          aria-hidden="true"
                          className="h-6 w-6 ml-auto mr-3"
                        />
                      </button>
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
                  Subtotal <span className="ml-auto font-medium">${subtotal}</span>
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
                      This is an estimate based on your current shipping address.
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
                <Link to={`/checkout/${id}/${cartId}`}>
                  <button
                    type="button"
                    className="text-sm px-4 py-3 w-full font-semibold tracking-wide bg-emerald-600 hover:bg-emerald-400 text-white rounded-md"
                    onClick={handleNewOrder}
                    disabled={cartItems.length === 0}
                  >
                    Proceed To Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
