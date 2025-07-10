import React from "react";
import "./App.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/landingPage/LandingPage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import SelectDashboard from "./pages/selectDashboard/SelectDashboard";
// import Customer from "./pages/dashboard/customer/Customer";
// import Account from "./pages/dashboard/account/Account";
// import Payment from "./pages/dashboard/payment/Payment";
// import Meter from "./pages/dashboard/meter/Meter";
// import Partner from "./pages/dashboard/partner/Partner";
// import Analytics from "./pages/dashboard/analytics/Analytics";
// import ElectricBill from "./pages/electricBill/ElectricBill";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <LandingPage />
      </div>
    ),
  },
  {
    path: "/Login",
    element: (
      <div>
        <Login />
      </div>
    ),
  },
  {
    path: "/Register",
    element: (
      <div>
        <Register />
      </div>
    ),
  },
  {
    path: "/SelectDashboard",
    element: (
      <div>
        <SelectDashboard />
      </div>
    ),
  },
  // // NEW: Routes for dashboards with a user ID parameter
  // {
  //   path: "/Dashboard/Customer/:userId", // :userId parameter
  //   element: (
  //     <div>
  //       <Customer />
  //     </div>
  //   ),
  // },
  // {
  //   path: "/Dashboard/Account/:userId", // :userId parameter
  //   element: (
  //     <div>
  //       <Account />
  //     </div>
  //   ),
  // },
  // {
  //   path: "/Dashboard/Payment/:userId", // :userId parameter
  //   element: (
  //     <div>
  //       <Payment />
  //     </div>
  //   ),
  // },
  // {
  //   path: "/Dashboard/Partner/:userId", // :userId parameter
  //   element: (
  //     <div>
  //       <Partner />
  //     </div>
  //   ),
  // },
  // {
  //   path: "/Dashboard/Meter/:userId", // :userId parameter
  //   element: (
  //     <div>
  //       <Meter />
  //     </div>
  //   ),
  // },
  // {
  //   path: "/Dashboard/Analytics/:userId", // :userId parameter
  //   element: (
  //     <div>
  //       <Analytics />
  //     </div>
  //   ),
  // },
  // // END NEW
  // {
  //   path: "/ElectricBill",
  //   element: (
  //     <div>
  //       <ElectricBill />
  //     </div>
  //   ),
  // },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
