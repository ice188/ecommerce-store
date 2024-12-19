/* eslint-disable @typescript-eslint/no-unused-vars */
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormEvent, useEffect, useState } from "react";
import { FetchCartItems } from "../../cart/api/FetchCartItems";
import { useNavigate, useParams } from "react-router-dom";
import { CartItem } from "../../cart/types/CartItem";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FetchCartId } from "../../cart/api/FetchCartId";
import { deleteOrder } from "../../order/api/DeleteOrder";
import { changeOrderStatus } from "../../order/api/ChangeOrderStatus";
import { updateCartActive } from "../../cart/api/UpdateCartActive";
import { addActiveCart } from "../../cart/api/AddActiveCart";
import { createOrder } from "../../order/api/CreateOrder";

export default function CheckoutForm() {
  const { id } = useParams<{ id: string }>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0.99);
  const [amount, setAmount] = useState<number>(0.99);
  const [tax, setTax] = useState<number>(4.0);
  const [shipping, setShipping] = useState<number>(10.0);

  const currency = sessionStorage.getItem("currency");
  const total = sessionStorage.getItem("amount");
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleDeleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (id) {
    //   const cid = await FetchCartId(id);
    //   const res = await deleteOrder(cid);
    // }
    navigate(`/cart/${id}`);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !id || !currency || !total) {
      return;
    }
    const cid = await FetchCartId(id);
    // await changeOrderStatus(cid, "pending");
    await updateCartActive(cid, false);
    await addActiveCart(id);

    createOrder(id, cid, parseInt(total,10), currency);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });
    
  };

  useEffect(() => {
    const loadCartItems = async () => {
      if (id) {
        const cid = await FetchCartId(id);
        const cartItems = await FetchCartItems(cid);
        setCartItems(cartItems);
        setSubtotal(
          parseFloat(
            cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)
          )
        );
        setAmount(parseFloat((subtotal + tax + shipping).toFixed(2)));
      }
    };
    loadCartItems();
  }, [id, shipping, subtotal, tax]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl max-md:max-w-xl mx-auto bg-white py-8 max-w-7xl sm:px-6 lg:px-8">
        <form onSubmit={handlePayment}>
          <div className="px-4">
            <h3 className="text-2xl font-semibold text-gray-900">Checkout</h3>
            <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
              Delivery & Payment
            </p>
            <div className="grid md:grid-cols-[1.5fr_1fr_2fr] gap-9 mt-6">
              <div className="md:col-span-2 space-y-4 ">
                <hr className="border-gray-300" />
                <PaymentElement options={{ layout: "accordion" }} />
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
                    <span className="ml-auto font-medium">${shipping}</span>
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
                  <button
                    type="submit"
                    className="text-sm px-4 py-3 w-full font-semibold tracking-wide bg-emerald-600 hover:bg-emerald-400 text-white rounded-md"
                  >
                    Confirm Payment
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteOrder}
                    className="text-sm px-4 py-3 mt-3 w-full font-semibold tracking-wide bg-gray-300 hover:bg-gray-200 text-white rounded-md"
                  >
                    Back To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
