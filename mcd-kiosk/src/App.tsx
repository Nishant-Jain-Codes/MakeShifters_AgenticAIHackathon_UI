import OrderTypeSelectionScreen from "./screens/OrderTypeSelectionScreen";
import MenuScreen from "./screens/MenuScreen";
import ItemViewScreen from "./screens/ItemViewScreen";
import OrderSummaryScreen from "./screens/OrderSummaryScreen";
import PaymentScreen from "./screens/PaymentScreen";
import OrderCompletionScreen from "./screens/OrderCompletionScreen";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import useMenuStore from "./store/useMenuStore";
import Loader from "./components/Loader";
import { useEffect } from "react";
import { loadMenuData } from "./utils/functions";
import CartFooter from "./components/CartFooter";
import MenuItem from "./components/MenuItem";

function App() {
  const { basket, isLoading } = useMenuStore();

  useEffect(() => {
    loadMenuData();
  }, []);
  const Layout = () => (
    // <div className="relative w-screen h-screen flex flex-col items-center bg-gray-100">
    //   <div className="relative w-[900px] h-[1600px] bg-white shadow-lg">
    //     <div className="top-0 w-[900px] h-[30vh] bg-amber-500 z-50 flex items-center justify-center">
    //       <h1 className="text-white font-bold text-lg">Navbar</h1>
    //     </div>

    //     <div className="w-[900px] h-[62.5vh] overflow-auto bg-red-200">
    //       <Outlet />
    //     </div>
    //     <div className="fixed bottom-0 w-[900px] h-[7.5vh] bg-amber-500 z-50 flex items-center justify-center">
    //       <h1 className="text-white font-bold text-lg">Footer</h1>
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col  h-full w-full">
      <div className="h-[27vh] w-full bg-amber-500  flex items-center justify-center">
        Top Section
      </div>

      <div className="h-[60vh] w-full overflow-y-auto pb-[5.125vh] ">
        <Outlet />
      </div>

      {/* {basket.length > 0 && ( */}
        <div className="h-[5.125vh] w-full flex items-center justify-center border">
          <CartFooter />
        </div>
      {/* )} */}
    </div>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <OrderTypeSelectionScreen /> },
        { path: "/menu", element: <MenuScreen /> },
        { path: "/items", element: <ItemViewScreen /> },
        { path: "/summary", element: <OrderSummaryScreen /> },
        { path: "/payment", element: <PaymentScreen /> },
        { path: "/completion", element: <OrderCompletionScreen /> },
        { path: "/item/:id", element: <MenuItem /> }
      ],
    },
  ]);

  return isLoading ? <Loader /> : <RouterProvider router={router} />;
}

export default App;
