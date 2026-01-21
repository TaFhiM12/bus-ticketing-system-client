import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import MyTicketPage from "../pages/MyTicketPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import Login from "../pages/Login/Login";
import Signup from "../pages/SignUp/SignUp";
import Error from "../shared/components/Error";
import PrivateRoute from "./PrivateRoute";
import BusSearchResults from "../pages/BusSearchResults";
import BookingPage from "../pages/BookingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children: [
      {
        index: true, 
        element: <HomePage/>
      },
      {
        path: 'my-tickets',
        element: <PrivateRoute>
          <MyTicketPage/>
        </PrivateRoute>
      },
      {
        path: 'about',
        element: <AboutPage/>
      },
      {
        path: 'contact',
        element: <ContactPage/>
      },
      {
        path: 'login',
        element: <Login/>
      },
      {
        path: 'signup',
        element: <Signup/>
      },
      {
        path: 'results',
        element: <BusSearchResults/>
      },
      {
        path: 'booking',
        element: <PrivateRoute>
          <BookingPage/>
        </PrivateRoute>
      },
      {
        path: '*',
        element: <Error/>
      }
    ]
  },
]);