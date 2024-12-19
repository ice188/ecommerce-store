import { RatingSummary } from "./RatingSummary";
import { Review } from "./Review";

export interface ReviewContextProps {
    reviews: Review[];
    ratingSummary: RatingSummary[];
    averageRating: number;
    reviewCount: number;
    loadReview: () => Promise<void>;
}

export const defaultReviewContext: ReviewContextProps = {
    averageRating: 0,
    reviewCount: 0,
    reviews: [],
    ratingSummary: [],
    loadReview: async () => {}, 
}