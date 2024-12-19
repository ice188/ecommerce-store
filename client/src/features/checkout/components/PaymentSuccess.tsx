import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../../authentication/types/User";
import { LoginStatus } from "../../authentication/api/LoginStatus";

export default function PaymentSuccess() {
  const [user, setUser] = useState<User|null>(null);

  useEffect(()=>{
    const loadAuth = async() => {
      const {user} = await LoginStatus();
      setUser(user);
    }
    loadAuth();
  },[]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div role="status" className="flex flex-col items-center -mt-20">
        <span className="sr-only">Success!</span>
        <p className="text-3xl font-bold text-emerald-600">Payment Success!</p>
        <p className="mt-4 text-gray-400 mb-10 ">Thank you for choosing EbuyX ❤️ </p>
        <div className="flex-col space-y-4">
        <Link to={`/order/${user?.user_id}`}>
          <button
            type="button"
            className="text-sm px-4 py-3 mb-4 w-full font-semibold tracking-wide bg-emerald-600 hover:bg-emerald-400 text-white rounded-md"
          >
            Check order status
          </button>
        </Link>

        <Link to={`/`}>
          <button
            type="button"
            className="text-sm px-4 py-3 w-full font-semibold tracking-wide bg-gray-300 hover:bg-gray-200  text-white rounded-md"
          >
           Back to product list
          </button>
        </Link>
        </div>
      </div>
    </div>
  );
}
