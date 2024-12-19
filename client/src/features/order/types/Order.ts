export interface Order{
    order_id: number,
    user_id: number, 
    cart_id: number, 
    amount: number, 
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'; 
    update_time: Date,
}