import { Link } from "react-router-dom";

export default function RegisterSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div role="status" className="flex flex-col items-center -mt-20">
        <span className="sr-only">Success!</span>
        <p className="text-3xl font-bold text-emerald-600">Registration Success!
        </p>
        <p className="mt-4 text-gray-400 mb-10 ">We are so happy to have you join us 🥰 </p>
        <Link to={`/login`}>
          <button
            type="button"
            className="text-sm px-4 py-3 w-full font-semibold tracking-wide bg-emerald-600 hover:bg-emerald-400 text-white rounded-md"
          >
            Login and Start Shopping ✨
          </button>
        </Link>
      </div>
    </div>
  );
}
