import { Review } from "../types/Review";

export const getProductRating = (reviews: Review[]) => {
  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? Math.round(
        (reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount) *
          10
      ) / 10
    : 0;

  return { averageRating, reviewCount };
};
