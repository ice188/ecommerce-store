import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Logout } from "../api/Logout";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { User } from "../types/User";
import { LoginStatus } from "../api/LoginStatus";

export default function AccountIcon() {
  const [user, setUser] = useState<User|null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await Logout();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  useEffect(()=>{
    const loadAuth = async() => {
      const {user, isLoggedIn} = await LoginStatus();
      setUser(user);
      setIsLoggedIn(isLoggedIn);
    }
    loadAuth();
  },[]);
  
  return (
    <div>
      {isLoggedIn ? (
        <div className="flex lg:ml-4 md:ml-4">
          <Popover className="relative">
            <PopoverButton className="p-2 !pr-0 text-gray-400 hover:text-emerald-600">
              <span className="sr-only">Account</span>
              <UserIcon aria-hidden="true" className="h-6 w-6 mr-2" />
            </PopoverButton>

            <PopoverPanel
              className="absolute left-0 z-10 mt-2 w-40 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5"
              transition
            >
              <div className="p-4">
                <a
                  href={`/user/${user?.user_id}`}
                  className="flex items-center gap-x-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  <UserCircleIcon className="h-5 w-5 text-gray-500" />
                  <div className="text-sm font-medium ml-2">Account</div>
                </a>
                <a
                  href={`/order/${user?.user_id}`}
                  className="flex items-center gap-x-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                  <div className="text-sm font-medium ml-2">Orders</div>
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-gray-500" />
                  <div className="text-sm font-medium ml-2">Logout</div>
                </button>
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      ) : (
        <div className="flex lg:ml-4 md:ml-4">
          <Popover className="relative">
            <PopoverButton className="p-2 !pr-0 text-gray-400 hover:text-emerald-600">
              <span className="sr-only">Account</span>
              <UserIcon aria-hidden="true" className="h-6 w-6 mr-2" />
            </PopoverButton>

            <PopoverPanel
              className="absolute left-0 z-10 mt-2 w-40 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5"
              transition
            >
              <div className="p-4">
                <a
                  href="/login"
                  className="flex items-center gap-x-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-gray-500" />
                  <div className="text-sm font-medium ml-2">Login</div>
                </a>
                <a
                  href="/register"
                  className="flex items-center gap-x-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                  <div className="text-sm font-medium ml-2">Register</div>
                </a>
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      )}
    </div>
  );
}
