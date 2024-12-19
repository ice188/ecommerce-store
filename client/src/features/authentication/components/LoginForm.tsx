import { useState } from "react";
import { Login } from "../api/Login";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await Login(email, password);

    if (res.status === 401) {
      setError("Invalid credentials. Please try again.");
    } else if (res.status === 200) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setError("");
      navigate("/");
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
          <Link to="/">
            <img alt="EbuyX" src="/logo.png" className="mx-auto h-10 w-auto" />
          </Link>
        </div>

        <div className="mt-6 mb-6 border border-gray-200 rounded-lg bg-white p-4 px-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-4 mb-4 text-center text-2xl/9 font-bold tracking-tight text-gray-800">
            Sign in
          </h2>

          {error && (
            <p className="mb-4 text-center text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-800"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm/6"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onFocus={() => {
                    setError("");
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-800"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-emerald-600 hover:text-emerald-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm/6"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onFocus={() => {
                    setError("");
                  }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-3 mb-3 text-center text-sm/6 text-gray-500">
            Not a member?{" "}
            <a
              href="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-500"
            >
              Register Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
