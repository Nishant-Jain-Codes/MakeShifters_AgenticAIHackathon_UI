import OrderTypeSelectionScreen from './screens/OrderTypeSelectionScreen';
import MenuScreen from './screens/MenuScreen';
import ItemViewScreen from './screens/ItemViewScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrderCompletionScreen from './screens/OrderCompletionScreen';
import "./App.css";
import { createBrowserRouter, RouterProvider ,Outlet} from "react-router-dom";
import useMenuStore from "./store/useMenuStore";
import Loader from "./components/Loader";

function App() {
  const isLoading = useMenuStore((state) => state.isLoading);

  const Layout = () => (
    <div className="max-h-[100vh] mx-auto aspect-[9/16]">
      {/* <Navbar /> */}
      <Outlet/>
    </div>
  );

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

  return isLoading ? <Loader /> : <RouterProvider router={router} />;
}

export default App;
