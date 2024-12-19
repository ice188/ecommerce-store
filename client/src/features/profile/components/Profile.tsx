import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddressContext } from "../contexts/AddressContext";
import { updateAddress } from "../api/UpdateAddress";
import { addAddress } from "../api/AddAddress";
import { updateUsername } from "../api/UpdateUsername";
import { LoginStatus } from "../../authentication/api/LoginStatus";
import { User } from "../../authentication/types/User";

const Profile: React.FC = () => {
  const { id } = useParams();

  const [showCountryTooltip, setShowCountryTooltip] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const { address, setAddress } = useContext(AddressContext);

  const [state, setState] = useState<string>(address?.state || "");
  const [city, setCity] = useState<string>(address?.city || "");
  const [street, setStreet] = useState<string>(address?.street || "");
  const [postal, setPostal] = useState<string>(address?.postal_code || "");
  const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      //session expired
    } else if (address) {
      await updateAddress(
        id,
        "Canada",
        state || address.state,
        city || address.city,
        street || address.street,
        postal || address.postal_code
      );
      setAddress({
        user_id: +id,
        street: street || address.street,
        city: city || address.city,
        state: state || address.state,
        postal_code: postal || address.postal_code,
        country: "Canada",
      });
    } else if (!address) {
      await addAddress(id, "Canada", state, city, street, postal);
      setAddress({
        user_id: +id,
        street: street,
        city: city,
        state: state,
        postal_code: postal,
        country: "Canada",
      });
    }
    if (user && id && name) {
      await updateUsername(id, name);
    }
    setShowSuccessMsg(true);
  };

  const countries = [
    {
      name: "Canada",
      flag: "https://tailwindui.com/plus/img/flags/flag-canada.svg",
    },
    { name: "USA", flag: "https://readymadeui.com/usa_flag.webp" },
  ];

  const toggleShowCountryTooltip = () => {
    setShowCountryTooltip((prevState) => !prevState);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowSuccessMsg(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const loadAuth = async () => {
      const { user } = await LoginStatus();
      setUser(user);
    };
    loadAuth();
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-8 py-8 lg:max-w-4xl xl:max-w-5xl z-0">
        <div className="mb-6 px-4 sm:px-0">
          <div className="fixed top-0 right-0 text-center px-4 mb-6 sm:px-0">
            {showSuccessMsg && (
              <div className="mb-8 bg-emerald-100 border-t-4 border-emerald-500 rounded-b text-emerald-900 px-4 py-3 shadow-md">
                <div className="flex items-center">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-emerald-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Account updated</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <h3 className="text-2xl font-semibold text-gray-900">Account</h3>
          <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
            Edit Username & Default Shipping Address
          </p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-semibold text-gray-900">
                Email Address
              </dt>
              <dd className="w-full mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                {user?.email}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <p className="text-sm font-semibold text-gray-900 sm:col-span-1 sm:mr-4 sm:self-center">
                Username (Optional)
              </p>
              <div className="mt-2">
                <input
                  className="block w-full rounded-md border-0 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-sm/6"
                  placeholder={user?.username}
                  onChange={(e) => {
                    setName(e.target.value.trim());
                  }}
                  onFocus={() => {
                    setShowSuccessMsg(false);
                  }}
                />
              </div>
            </div>

            <form
              className="border-b border-gray-200"
              onSubmit={handleUpdateInfo}
            >
              <div className="px-4 pb-2 pt-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                <dt className="text-sm/6 font-semibold text-gray-900">
                  Country
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={toggleShowCountryTooltip}
                      className="px-5 py-2.5 rounded text-[#333] text-sm border-2 border-gray-100 hover:bg-emerald-50"
                    >
                      <div className="flex items-center">
                        <img
                          src={countries[0].flag}
                          className="w-6 mr-3"
                          alt={`${countries[0].name} flag`}
                        />
                        {countries[0].name}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 fill-[#333] inline ml-3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                            clipRule="evenodd"
                            data-original="#000000"
                          />
                        </svg>
                      </div>
                    </button>

                    {showCountryTooltip && (
                      <p className="ml-3 text-emerald-600 text-sm font-semibold inline-block">
                        <div className="bg-gray-100 text-gray-600 font-light text-xs p-2 rounded ml-6">
                          Currently we only support shipping to Canada
                        </div>
                      </p>
                    )}
                    {/* {isDropdownOpen && (
                    <ul
                      id="dropdownMenu"
                      className="absolute block shadow-lg bg-white py-2 px-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto"
                    >
                      {countries.map((country, index) => (
                        <li
                          key={index}
                          className="py-2.5 px-4 hover:bg-emerald-50 rounded text-black text-sm cursor-pointer"
                        >
                          <div className="flex items-center">
                            <img
                              src={country.flag}
                              className="w-6 mr-3"
                              alt={`${country.name} flag`}
                            />
                            {country.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )} */}
                  </div>
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                <label
                  htmlFor="state"
                  className="text-sm font-semibold text-gray-900 sm:col-span-1 sm:mr-4 sm:self-center"
                >
                  Province
                </label>
                <div className="mt-2 sm:col-span-2">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-sm/6"
                    onChange={(e) => {
                      setState(e.target.value.trim());
                    }}
                    onFocus={() => {
                      setShowSuccessMsg(false);
                    }}
                    placeholder={address?.state}
                  />
                </div>
              </div>

              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                <label
                  htmlFor="city"
                  className="text-sm font-semibold text-gray-900 sm:col-span-1 sm:mr-4 sm:self-center"
                >
                  City
                </label>
                <div className="mt-2 sm:col-span-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-sm/6"
                    onChange={(e) => {
                      setCity(e.target.value.trim());
                    }}
                    onFocus={() => {
                      setShowSuccessMsg(false);
                    }}
                    placeholder={address?.city}
                  />
                </div>
              </div>

              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                <label
                  htmlFor="address"
                  className="text-sm font-semibold text-gray-900 sm:col-span-1 sm:mr-4 sm:self-center"
                >
                  Street Address
                </label>
                <div className="mt-2 sm:col-span-2">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-sm/6"
                    onChange={(e) => {
                      setStreet(e.target.value.trim());
                    }}
                    onFocus={() => {
                      setShowSuccessMsg(false);
                    }}
                    placeholder={address?.street}
                  />
                </div>
              </div>

              <div className="px-4 py-2 mb-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
                <label
                  htmlFor="postal"
                  className="text-sm font-semibold text-gray-900 sm:col-span-1 sm:mr-4 sm:self-center"
                >
                  Postal Code
                </label>
                <div className="mt-2 sm:col-span-2">
                  <input
                    id="postal"
                    name="postal"
                    type="text"
                    autoComplete="postal"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-sm/6"
                    pattern="^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$"
                    onChange={(e) => {
                      setPostal(e.target.value.trim());
                    }}
                    onFocus={() => {
                      setShowSuccessMsg(false);
                    }}
                    placeholder={address?.postal_code || "A1A 1A1"}
                  />
                </div>
              </div>

              <div className="text-center px-4 mt-6 mb-6 sm:px-0">
                <button
                  type="submit"
                  className="text-sm py-3 w-full font-semibold tracking-wide bg-emerald-600 hover:bg-emerald-400 text-white rounded-md"
                >
                  Update
                </button>
              </div>
            </form>

            {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">About</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
                consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                proident. Irure nostrud pariatur mollit ad adipisicing
                reprehenderit deserunt qui eu.
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">
                Attachments
              </dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-gray-400"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          resume_back_end_developer.pdf
                        </span>
                        <span className="shrink-0 text-gray-400">2.4mb</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <a
                        href="#"
                        className="font-medium text-emerald-600 hover:text-emerald-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-gray-400"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          coverletter_back_end_developer.pdf
                        </span>
                        <span className="shrink-0 text-gray-400">4.5mb</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      <a
                        href="#"
                        className="font-medium text-emerald-600 hover:text-emerald-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div> */}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
