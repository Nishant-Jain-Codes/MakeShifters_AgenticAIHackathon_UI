import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import useMenuStore from "./store/useMenuStore";
import Home from "./pages/Home";
import Loader from "./components/Loader";

function App() {
  const setMenu = useMenuStore((state: any) => state.setMenu);
  const menuLoaded = useMenuStore((state: any) => state.menuLoaded);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/test`
        );

        if (response.status === 200) {
          setMenu(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTestData();


    setTimeout(() => {
      useMenuStore.getState().setMenuLoaded(true);
    }, 1500);
  }, []);

  if (!menuLoaded) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  const Layout = () => {
    return (
      <div className="max-h-[100vh] mx-auto aspect-[9/16]">
        {/* <Navbar /> */}
        <div className="">
          <Outlet />
        </div>
      </div>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [{ path: "/", element: <Home /> }],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
