import { useEffect } from "react";
import OrderTypeSelectionScreen from './screens/OrderTypeSelectionScreen';
import MenuScreen from './screens/MenuScreen';
import ItemViewScreen from './screens/ItemViewScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrderCompletionScreen from './screens/OrderCompletionScreen';
import "./App.css";
import axios from "axios";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import useMenuStore from "./store/useMenuStore";
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
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <OrderTypeSelectionScreen /> },
        { path: '/menu', element: <MenuScreen /> },
        { path: '/items', element: <ItemViewScreen /> },
        { path: '/summary', element: <OrderSummaryScreen /> },
        { path: '/payment', element: <PaymentScreen /> },
        { path: '/completion', element: <OrderCompletionScreen /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
