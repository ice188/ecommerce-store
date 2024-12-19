import { RatingSummary } from "../types/RatingSummary";
import { Review } from "../types/Review";

export const getRatingSummary = (reviews:Review[]): RatingSummary[] => {
    const ratingCounts = Array(5).fill(0);
    reviews.forEach(review => {
        ratingCounts[review.rating-1] += 1;
    })
    const totalReviews = reviews.length;
    const summary: RatingSummary[] = ratingCounts.map((count, index)=>{
        const rating = index + 1;
        const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        return { rating, percent, review_cnt: count };
    })
    return summary;
}