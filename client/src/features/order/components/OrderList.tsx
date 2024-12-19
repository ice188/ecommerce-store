import { useCallback, useEffect, useState } from "react";
import { Order } from "../types/Order";
import { FetchOrders } from "../api/FetchOrders";
import { useParams } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import { deleteOrder } from "../api/DeleteOrder";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { id } = useParams();
  const [orderType, setOrderType] = useState("all-order");
  const [duration, setDuration] = useState("anytime");
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [showSuccessDeleteMsg, setShowSuccessDeleteMsg] =
    useState<boolean>(false);

  const loadOrders = useCallback(async () => {
    if (!id) return;
    const orders = await FetchOrders(id);
    setOrders(orders);
  }, [id]);

  const filterOrders = useCallback(() => {
    let filtered = [...orders];

    if (orderType !== "all-order") {
      filtered = filtered.filter((order) => order.status === orderType);
    }
    if (duration !== "anytime") {
      const currentDate = new Date();
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.update_time);
        switch (duration) {
          case "month":
            return (
              currentDate.getTime() - orderDate.getTime() <=
              30 * 24 * 60 * 60 * 1000
            );
          case "three-month":
            return (
              currentDate.getTime() - orderDate.getTime() <=
              90 * 24 * 60 * 60 * 1000
            );
          case "year":
            return orderDate.getFullYear() === currentDate.getFullYear();
          default:
            return true;
        }
      });
    }
    setFilteredOrders(filtered);
  }, [orders, orderType, duration]);

  const handleDeleteOrder = async (oid: string) => {
    if (id) {
      await deleteOrder(oid);
      setShowSuccessDeleteMsg(true);
      await loadOrders();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowSuccessDeleteMsg(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, orderType, duration, filterOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-8 py-8 lg:max-w-4xl xl:max-w-5xl z-0">
        <div className="mb-6 px-4 sm:px-0">
          <div className="fixed top-[48px] right-0 text-center px-4 mb-6 sm:px-0">
            {showSuccessDeleteMsg && (
              <div className="mb-8 bg-emerald-100 border-t-4 border-emerald-500 rounded-b text-emerald-900 px-4 py-3 shadow-md">
                <div className="flex items-center">
                  <div className="py-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Order Cancelled</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">Orders</h3>
          <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
            Track Order History & Status
          </p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <div className="gap-4 sm:flex sm:items-center sm:justify-between">
            <div className="pt-6 mt-2 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
              <div>
                <label
                  htmlFor="order-type"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select order type
                </label>
                <select
                  id="order-type"
                  className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="all-order">All orders</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">In transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <span className="inline-block text-gray-500 dark:text-gray-400 text-sm">
                {" "}
                from{" "}
              </span>
              <div>
                <label
                  htmlFor="duration"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select duration
                </label>
                <select
                  id="duration"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="anytime">anytime</option>
                  <option value="month">last month</option>
                  <option value="three-month">last three months</option>
                  <option value="year">this year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flow-root sm:mt-4">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => {
                return (
                  <div key={order.order_id}>
                    <div className="flex flex-wrap items-center gap-y-4 py-6">
                      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                        <dt className="text-base font-light text-gray-500 dark:text-gray-400">
                          Order ID
                        </dt>
                        <dd className="mt-1.5 text-sm text-gray-900 dark:text-white">
                          <a href="#" className="hover:underline">
                            {order.order_id}
                          </a>
                        </dd>
                      </dl>
                      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                        <dt className="text-base font-light text-gray-500 dark:text-gray-400">
                          Date
                        </dt>
                        <dd className="mt-1.5 text-sm text-gray-900 dark:text-white">
                          {formatDate(order.update_time)}
                        </dd>
                      </dl>
                      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                        <dt className="text-base font-light text-gray-500 dark:text-gray-400">
                          Price
                        </dt>
                        <dd className="mt-1.5 text-sm text-gray-900 dark:text-white">
                          ${order.amount}
                        </dd>
                      </dl>
                      <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                        <dt className="text-base font-light text-gray-500 dark:text-gray-400">
                          Status
                        </dt>
                        {order.status === "pending" && (
                          <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                            <svg
                              className="me-1 h-3 w-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                              />
                            </svg>
                            Pending
                          </dd>
                        )}
                        {order.status === "paid" && (
                          <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                            <svg
                              className="me-1 h-3 w-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                              />
                            </svg>
                            Paid
                          </dd>
                        )}
                        {order.status === "shipped" && (
                          <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            <svg
                              className="me-1 h-3 w-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                              />
                            </svg>
                            In transit
                          </dd>
                        )}
                        {order.status === "cancelled" && (
                          <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                            <svg
                              className="me-1 h-3 w-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18 17.94 6M18 18 6.06 6"
                              />
                            </svg>
                            Cancelled
                          </dd>
                        )}
                        {order.status === "delivered" && (
                          <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            <svg
                              className="me-1 h-3 w-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 11.917 9.724 16.5 19 7.5"
                              />
                            </svg>
                            Delivered
                          </dd>
                        )}
                      </dl>
                      <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4 mt-2">
                        <a
                          href={`/order/detail/${order.order_id}`}
                          className="w-full inline-flex justify-center rounded-lg  border border-gray-200 px-3 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-400 text-white hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                        >
                          View details
                        </a>
                        {["pending", "paid"].includes(order.status) ? (
                          <button
                            onClick={() =>
                              handleDeleteOrder(order.order_id.toString())
                            }
                            className="w-full rounded-lg border bg-white px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none lg:w-auto"
                          >
                            Cancel order
                          </button>
                        ) : (
                          <div className="hidden md:block w-full rounded-lg border border-white px-3 py-2 text-center text-sm font-medium text-white focus:outline-none lg:w-auto">
                            Cancel order
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
