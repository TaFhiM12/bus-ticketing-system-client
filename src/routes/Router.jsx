import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import MyTicketPage from "../pages/MyTicketPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children: [
        {
            index: true, element:<HomePage/>
        },
        {
          path:'my-tickets',
          element: <MyTicketPage/>
        },
        {
          path: 'about',
          element: <AboutPage/>
        },
        {
          path: 'contact',
          element: <ContactPage/>
        }
    ]
  },
]);