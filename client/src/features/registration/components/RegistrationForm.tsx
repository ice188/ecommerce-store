/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Register } from "../api/Register";
import { Link, useNavigate } from "react-router-dom";
import { sendCode } from "../api/SendCode";
import { generateCode } from "../utils/GenerateCode";

export default function RegistrationForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [showSentToEmailMsg, setShowSentToEmailMsg] = useState<boolean>(false);
  const navigate = useNavigate();
  const [trueCode, setTrueCode] = useState<string>("");

  const handleSendCode = async () => {
    if (!email) {
      setError("Invalid email. ");
      return;
    }
    const generatedCode = generateCode();
    await sendCode(email, generatedCode);
    setTrueCode(generatedCode);
    setCodeSent(true);
    setShowSentToEmailMsg(true);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code !== trueCode) {
      console.log(code);
      console.log(trueCode);
      setError("Incorrect verification code. Please try again.");
      return;
    }
    const res = await Register(email, password, username);
    if (res.status === 400) {
      setError("Account exists. ");
    } else if (res.status === 200) {
      setError("");
      navigate("/register/success");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowSentToEmailMsg(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center bg-gray-100 px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
          <Link to="/">
            <img alt="EbuyX" src="/logo.png" className="mx-auto h-10 w-auto" />
          </Link>
        </div>

        <div className="mt-6 mb-6 border border-gray-200 rounded-lg bg-white p-4 px-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-4 mb-4 text-center text-2xl/9 font-bold tracking-tight text-gray-800">
            Create account
          </h2>

          {error && (
            <div>
              <p className="mb-4 text-center text-sm font-medium text-red-600">
                {error}
                {error === "Account exists. " && (
                  <a
                    href="#"
                    className="font-semibold text-emerald-600 hover:text-emerald-500"
                  >
                    Forgot password?
                  </a>
                )}
              </p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm/6"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onFocus={() => {
                    setError("");
                    setShowSentToEmailMsg(false);
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
                <div className="text-sm"></div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm/6"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onFocus={() => {
                    setError("");
                    setShowSentToEmailMsg(false);
                  }}
                />
              </div>
            </div>

            <div className="!mb-6">
              <label
                htmlFor="code"
                className="block text-sm/6 font-medium text-gray-800"
              >
                Verification Code
              </label>
              <div className="mt-2 flex">
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm/6"
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                  }}
                  onFocus={() => {
                    setError("");
                    setShowSentToEmailMsg(false);
                  }}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  className={`ml-3 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm 
                    bg-emerald-600 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  }`}
                >
                  {codeSent ? "Resend" : "Send"}
                </button>
              </div>
            </div>

            <div className="fixed top-0 right-0 text-center ">
              {showSentToEmailMsg && (
                <div className="mb-8 bg-emerald-100 border-t-4 border-emerald-500 rounded-b text-emerald-900 px-4 py-3 shadow-md">
                  <div className="flex items-center">
                    <div className="py-1 mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Code sent.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* <div className="!mb-6">
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-800"
              >
                Username (Optional)
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm/6"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  onFocus={() => {
                    setError("");
                  }}
                />
              </div>
            </div> */}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Sign up
              </button>
            </div>
          </form>
          <p className="mt-3 mb-3 text-center text-sm/6 text-gray-500">
            Have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-500"
            >
              Login Here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
