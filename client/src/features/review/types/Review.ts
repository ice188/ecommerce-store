export interface Review {
    review_id: number; 
    user_id: number;     
    rating: number;  
    title: string;    
    comment: string;     
    img_url: string;     
    time: Date;         
}