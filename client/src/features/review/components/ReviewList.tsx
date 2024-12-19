import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { formatDate } from "../../../utils/formatDate";

import { addReview } from "../api/AddReview";
import { ReviewContext } from "../contexts/ReviewContext";
import { LoginStatus } from "../../authentication/api/LoginStatus";
import { User } from "../../authentication/types/User";

const ReviewList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { reviews, ratingSummary, averageRating, reviewCount, loadReview } =
    useContext(ReviewContext);
  const [user, setUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [star, setStar] = useState(5);
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const loadUser = async () => {
      const { user } = await LoginStatus();
      setUser(user);
    };
    loadUser();
  }, []);

  const handleStarClick = (i: number) => {
    setStar(i);
  };
  const toggleModal = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (id && user) {
      await addReview(id, user.user_id.toString(), star, title, comment);
      toggleModal();
      loadReview();
      setStar(5);
      setTitle("");
      setComment("");
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-6 lg:grid lg:max-w-7xl lg:px-8">
        <div className="lg:px-16">
          {/* Divider */}
          <div className="border-t border-gray-200 mt-4 mb-4"></div>
          <h1 className="lg:mt-2 text-2xl font-semibold tracking-tight text-gray-900 text-left">
            Customer Reviews
          </h1>

          {/* Stars */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < averageRating ? "text-yellow-300" : "text-gray-200"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm font-light leading-none text-gray-900">
              {averageRating}
            </p>
            <a
              href="#"
              className="ml-4 text-sm font-medium text-emerald-600 hover:text-emerald-500"
            >
              {reviewCount} reviews
            </a>
          </div>

          {/* Rating bars*/}
          <div className="mt-6 lg:flex lg:items-start lg:gap-8">
            <div className="lg:flex-1 space-y-3">
              {ratingSummary.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <p className="w-2 shrink-0 text-start text-sm font-medium leading-none text-gray-900 dark:text-white">
                    {item.rating}
                  </p>
                  <p className="text-yellow-300"> ★ </p>
                  <div className="w-full h-3 rounded-full bg-gray-100">
                    <div
                      className="h-3 rounded-full bg-yellow-300"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                  <a
                    href="#"
                    className="w-8 shrink-0 text-right text-sm font-medium leading-none text-primary-700 hover:underline dark:text-primary-500 sm:w-auto sm:text-left"
                  >
                    {item.percent} <span className="hidden sm:inline">%</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Write a review */}
            <div className="mt-8 lg:ml-6 lg:mt-0 lg:w-1/3">
              <h2 className="text-xl font-bold text-gray-900">
                Review this product
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Share your thoughts with other customers
              </p>
              <button
                onClick={() => {
                  setShowForm(true);
                }}
                className="mt-4 w-full rounded-md bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Write a review
              </button>
            </div>
          </div>

          {/* Modal */}
          <div>
            {showForm && (
              <div
                className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
                onClick={toggleModal}
              >
                <div
                  className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal header */}
                  <div className="flex items-center justify-between p-4 md:p-5 rounded-t ">
                    <h3 className="text-xl font-semibold text-gray-900 ">
                      Share your opinion
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                      onClick={toggleModal}
                    >
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>

                  {/* Modal body */}
                  <div className="p-4 md:p-5 !pt-0 space-y-4">
                    {/* Star Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-6 h-6 cursor-pointer ${
                            index < star ? "text-yellow-300" : "text-gray-200"
                          }`}
                          fill="currentColor"
                          onClick={() => handleStarClick(index + 1)}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.13 3.481a1 1 0 00.95.69h3.635c.969 0 1.371 1.24.588 1.81l-2.942 2.138a1 1 0 00-.364 1.118l1.13 3.481c.3.921-.755 1.688-1.54 1.118l-2.942-2.138a1 1 0 00-1.176 0l-2.942 2.138c-.784.57-1.838-.197-1.54-1.118l1.13-3.481a1 1 0 00-.364-1.118L2.098 8.908c-.783-.57-.38-1.81.588-1.81h3.635a1 1 0 00.95-.69l1.13-3.481z" />
                        </svg>
                      ))}
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="review-title"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Title
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-600 sm:max-w-md">
                          <input
                            id="review-title"
                            name="review-title"
                            type="text"
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </div>
                      </div>
                      <label
                        htmlFor="review-des"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white mt-4"
                      >
                        Comment
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="review-des"
                          name="review-des"
                          rows={6}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm/6"
                          defaultValue={""}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      {/* <p className="ms-auto text-xs text-gray-500">
                        Problems with the product or delivery?{" "}
                        <a
                          href="#"
                          className="text-primary-600 text-emerald-600 hover:underline dark:text-primary-500"
                        >
                          Send a report
                        </a>
                        .
                      </p> */}
                    </div>
                  </div>

                  {/* Modal footer */}
                  <div className="flex items-center p-4 md:p-5 !pt-0 rounded-b dark:border-gray-600">
                    <button
                      onClick={handleSubmit}
                      className="text-white bg-emerald-600 hover:bg-emerald-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                    >
                      Submit
                    </button>
                    <button
                      onClick={toggleModal}
                      className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-emerald-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Divider */}
          <div className="border-t border-gray-200 mt-8"></div>

          {/* Reviews */}
          <div className="mt-8 mb-8">
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.review_id}>
                  <div className="flex gap-4 items-start">
                    {/* Avatar */}
                    <img
                      src="/default_user.png"
                      alt="Reviewer avatar"
                      className="h-11 w-11 rounded-full bg-gray-200"
                    />
                    <div>
                      {/* Name and rating */}
                      <div className="flex items-center">
                        <p className="font-medium text-gray-900">Anonymous</p>
                        <p className="ml-8 font-light text-xs text-gray-500">
                          Reviewed on {formatDate(review.time)}
                        </p>
                      </div>

                      <div className="flex items-center gap-0.5 text-yellow-300">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.rating
                                ? "text-yellow-300"
                                : "text-gray-200"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 font-bold text-sm text-gray-900">
                    {review.title}
                  </p>
                  <p className="mt-4 text-sm text-gray-700">{review.comment}</p>
                  <div className="border-t border-gray-200 mt-6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
