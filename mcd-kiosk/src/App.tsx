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

function App() {
  const isLoading = useMenuStore((state) => state.isLoading);

  const Layout = () => (
    <div className="relative w-screen h-screen flex flex-col items-center bg-gray-100">
      <div className="relative w-[900px] h-[1600px] bg-white shadow-lg">
        <div className="fixed top-0 w-[900px] h-[480px] bg-amber-500 z-50 flex items-center justify-center">
          <h1 className="text-white font-bold text-lg">Navbar</h1>
        </div>

        <div className="w-[900px] h-[1000px] overflow-auto mt-[480px] mb-[120px]">
          <Outlet />
        </div>
        <div className="fixed bottom-0 w-[900px] h-[120px] bg-amber-500 z-50 flex items-center justify-center">
          <h1 className="text-white font-bold text-lg">Footer</h1>
        </div>
      </div>
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
      ],
    },
  ]);

  return isLoading ? <Loader /> : <RouterProvider router={router} />;
}

export default App;
