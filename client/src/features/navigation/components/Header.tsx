import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverGroup,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { fetchNewProducts } from "../../product/api/FetchNewProducts";
import { getProductRating } from "../../review/utils/getProductRating";
import { Navigation, defaultNavigation } from "../types/Navigation";
import { fetchPopularProducts } from "../../product/api/FetchPopularProducts";
import AccountIcon from "../../authentication/components/AccountIcon";
import { Logout } from "../../authentication/api/Logout";
import { fetchReviewById } from "../../review/api/FetchReviewById";
import { Product } from "../../product/types/Product";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "../../authentication/types/User";
import { LoginStatus } from "../../authentication/api/LoginStatus";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [navigation, setNavigation] = useState<Navigation>(defaultNavigation);
  const [isNew, setIsNew] = useState(false);
  const [isPop, setIsPop] = useState(false);
  const [user, setUser] = useState<User|null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await Logout();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  const handleCartClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (localStorage.getItem("token")) {
      const {user} = await LoginStatus();
      setUser(user);
      navigate(`/cart/${user?.user_id}`);
    } else {
      navigate("/login");
    }
  };

  useEffect(()=>{
    const loadAuth = async() => {
      const {user, isLoggedIn} = await LoginStatus();
      setUser(user);
      setIsLoggedIn(isLoggedIn);
    }
    loadAuth();
  },[]);
  
  useEffect(() => {
    if (loc.pathname === "/new") {
      setIsNew(true);
      setIsPop(false);
    } else if (loc.pathname === "/popular") {
      setIsPop(true);
      setIsNew(false);
    }
  }, [loc.pathname]);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      const newProductData = await fetchNewProducts();
      const newProductsWithRatings = await Promise.all(
        newProductData.map(async (product) => {
          const reviews = await fetchReviewById(product.id.toString());
          const { averageRating, reviewCount } = getProductRating(reviews);
          return { ...product, rating: averageRating, reviews: reviewCount };
        })
      );

      const popularProductData = await fetchPopularProducts();
      const popularProductsWithRatings = await Promise.all(
        popularProductData.map(async (product) => {
          const reviews = await fetchReviewById(product.id.toString());
          const { averageRating, reviewCount } = getProductRating(reviews);
          return { ...product, rating: averageRating, reviews: reviewCount };
        })
      );

      setNewProducts(newProductsWithRatings);
      setPopularProducts(popularProductsWithRatings);

      setNavigation((prevNavigation) => ({
        ...prevNavigation,
        categories: prevNavigation.categories.map((category) =>
          category.id === "new-arrivals"
            ? { ...category, featured: newProducts }
            : { ...category, featured: popularProducts }
        ),
      }));
    };
    loadFeaturedProducts();
  }, [newProducts, popularProducts]);

  return (
    <div className="bg-white relative z-50">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        {/* Close Button */}
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* Featured page links*/}
            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.categories.map((category) => (
                <div key={category.name} className="flow-root">
                  <a
                    href={category.href}
                    className={`-m-2 block p-2 font-medium hover:text-emerald-600 border-b-2 border-transparent data-[selected]:border-emerald-600 ${
                      (isNew && category.id === "new-arrival") ||
                      (isPop && category.id === "popular")
                        ? "text-emerald-600"
                        : ""
                    }`}
                  >
                    {category.name}
                  </a>
                </div>
              ))}
            </div>

            {/* Page Links */}
            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <a
                    href={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900 hover:text-emerald-600"
                  >
                    {page.name}
                  </a>
                </div>
              ))}
            </div>

            {/* Account Links */}
            <div>
              {isLoggedIn ? (
                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <a
                      href={`/user/${user?.user_id}`}
                      className="-m-2 block p-2 font-medium text-gray-900 hover:text-emerald-600"
                    >
                      Account
                    </a>
                  </div>
                  <div className="flow-root">
                    <a
                      href={`/order/${user?.user_id}`}
                      className="-m-2 block p-2 font-medium text-gray-900 hover:text-emerald-600"
                    >
                      Order
                    </a>
                  </div>
                  <div className="flow-root">
                    <button
                      onClick={handleLogout}
                      className="-m-2 block p-2 font-medium text-gray-900 hover:text-emerald-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 border-t border-gray-200 px-4 py-6 ">
                  <div className="flow-root">
                    <a
                      href="/login"
                      className="-m-2 block p-2 font-medium text-gray-900 hover:text-emerald-600"
                    >
                      Login
                    </a>
                  </div>
                  <div className="flow-root">
                    <a
                      href="/register"
                      className="-m-2 block p-2 font-medium text-gray-900 hover:text-emerald-600"
                    >
                      Create New Account
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="border-t border-gray-200 px-4 py-6 ">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://tailwindui.com/plus/img/flags/flag-canada.svg"
                  className="block h-auto w-5 flex-shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">
                  CAD
                </span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Header */}
      <header className="relative bg-white">
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="">
            {/* Open Button */}
            <div className="flex h-12 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">EbuyX</span>
                  <img alt="logo" src="/logo.png" className="h-8 w-auto" />
                </Link>
              </div>

              {/* Featured Pages Links */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {/* Category Name */}
                      <div className="relative flex">
                        <a
                          href={category.href}
                          className={`relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-medium transition-colors duration-200 ease-out hover:text-emerald-600 data-[open]:border-emerald-600 data-[open]:text-emerald-600 ${
                            (isNew && category.id === "new-arrival") ||
                            (isPop && category.id === "popular")
                              ? "text-emerald-600"
                              : ""
                          }`}
                        >
                          {category.name}
                        </a>
                      </div>
                    </Popover>
                  ))}
                  {/* Page Link */}
                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-emerald-600"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                {/* Search */}
                <div className="flex ">
                  <Link to="/search" className="text-gray-400 hover:text-emerald-600">
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="h-6 w-6"
                    />
                  </Link>
                </div>
                {/* Account */}
                <div className="ml-4 hidden md:block">
                  <AccountIcon />
                </div>

                {/* Currency Selector */}
                <div className="hidden lg:ml-7  lg:flex">
                  <a
                    href="#"
                    className="flex items-center text-gray-900 hover:text-emerald-600"
                  >
                    <img
                      alt=""
                      src="https://tailwindui.com/plus/img/flags/flag-canada.svg"
                      className="block h-auto w-5 flex-shrink-0"
                    />
                    <span className="ml-3 block text-sm font-medium">CAD</span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div>

                {/* Cart */}
                <div className="ml-4 md:ml-7 flow-root lg:ml-7">
                  <button
                    onClick={handleCartClick}
                    className="group -m-2 flex items-center p-2"
                  >
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-emerald-600"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900 group-hover:text-emerald-600">
                      0
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="border-t border-gray-200"></div>
    </div>
  );
}
