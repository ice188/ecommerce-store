import React from "react";
import ListingPage from "./pages/ListingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";
import NewArrivalPage from "./pages/NewArrivalPage";
import PopularPage from "./pages/PopularPage";
import CartPage from "./pages/CartPage";
import RegistrationPage from "./pages/RegistrationPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import { Provider } from 'react-redux';
import store from "./features/authentication/store";
import RegisterSuccessPage from "./pages/RegisterSuccessPage";
import SearchPage from "./pages/SearchPage";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<ListingPage />} />
          <Route path="/new" element={<NewArrivalPage />} />
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart/:id/" element={<CartPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/user/:id" element={<ProfilePage />} />
          <Route path="/checkout/:id/:cid" element={<CheckoutPage/>} />
          <Route path="/order/:id" element={<OrderPage/>} />
          <Route path="/order/detail/:oid" element={<OrderDetailPage/>} />
          <Route path="/checkout/success" element={<PaymentSuccessPage/>} />
          <Route path="/register/success" element={<RegisterSuccessPage/>} />
          <Route path="/search" element={<SearchPage/>} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
