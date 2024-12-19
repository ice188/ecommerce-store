/* eslint-disable @typescript-eslint/no-explicit-any */
import { Review } from "../types/Review";

export const fetchReviewById = async (id: string): Promise<Review[]> => {
  const serverUrl = import.meta.env.VITE_SERVER_API_URL;
  const res = await fetch(`${serverUrl}/api/review/${id}`, {
    method: "GET",
  });
  const data = await res.json();
  const reviewById: Review[] = data.review.map((review: any) => ({
    review_id: review.review_id,
    user_id: review.user_id,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    img_url: review.img_url,
    time: new Date(review.time),
  }));
  return reviewById;
};
