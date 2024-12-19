import { createContext, useEffect, useState } from "react";
import {
  defaultReviewContext,
  ReviewContextProps,
} from "../types/ReviewContextProps";
import { getProductRating } from "../utils/getProductRating";
import { fetchReviewById } from "../api/FetchReviewById";
import { Review } from "../types/Review";
import { RatingSummary } from "../types/RatingSummary";
import { getRatingSummary } from "../utils/getRatingSummary";

export const ReviewContext =
  createContext<ReviewContextProps>(defaultReviewContext);

export const ReviewProvider: React.FC<{
  children: React.ReactNode;
  id: string;
}> = ({ children, id }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [ratingSummary, setRatingSummary] = useState<RatingSummary[]>([]);

  const loadReview = async () => {
    const reviewsData = await fetchReviewById(id);
    const { averageRating, reviewCount } = getProductRating(reviewsData);
    const summary = getRatingSummary(reviewsData);
    setAverageRating(averageRating);
    setReviewCount(reviewCount);
    setReviews(reviewsData);
    setRatingSummary(summary);
  };

  useEffect(() => {
    loadReview();
  }, [id]);

  return (
    <ReviewContext.Provider
      value={{ reviews, ratingSummary, averageRating, reviewCount, loadReview }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
