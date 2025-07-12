import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Eager imports
import LandingPage from "./pages/landingPage/LandingPage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import SelectDashboard from "./pages/selectDashboard/SelectDashboard";
import Customer from "./pages/dashboard/customer/Customer";
import Logout from "./pages/logout/Logout";
import Account from "./pages/dashboard/account/Account";
import Payment from "./pages/dashboard/payment/Payment";
import Meter from "./pages/dashboard/meter/Meter";
import Partner from "./pages/dashboard/partner/Partner";
import Analytics from "./pages/dashboard/analytics/Analytics";
import ElectricBill from "./pages/electricBill/ElectricBill";
import Unauthorized from "./pages/misc/unauthorized/Unauthorized";
import NotFound from "./pages/misc/notFound/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/Logout",
    element: <Logout />,
  },
  {
    path: "/SelectDashboard/:id",
    element: (
      <ProtectedRoute>
        <SelectDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/Dashboard/Customer/:id",
    element: (
      <ProtectedRoute>
        <Customer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Dashboard/Account/:id",
    element: (
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Dashboard/Payment/:id",
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Dashboard/Meter/:id",
    element: (
      <ProtectedRoute>
        <Meter />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Dashboard/Partner/:id",
    element: (
      <ProtectedRoute>
        <Partner />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Dashboard/Analytics/:id",
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ElectricBill/:id",
    element: (
      <ProtectedRoute>
        <ElectricBill />
      </ProtectedRoute>
    ),
  },

  {
    path: "/Unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
