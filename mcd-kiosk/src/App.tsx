import { useEffect } from "react";
import OrderTypeSelectionScreen from "./screens/OrderTypeSelectionScreen";
import MenuScreen from "./screens/MenuScreen";
import ItemViewScreen from "./screens/ItemViewScreen";
import OrderSummaryScreen from "./screens/OrderSummaryScreen";
import PaymentScreen from "./screens/PaymentScreen";
import OrderCompletionScreen from "./screens/OrderCompletionScreen";
import "./App.css";
import useMenuStore from "./store/useMenuStore";
import Loader from "./components/Loader";
import { loadMenuData } from "./utils/functions";
import CartFooter from "./components/CartFooter";

function App() {
  const isLoading = useMenuStore((state) => state.isLoading);
  const currentScreen = useMenuStore((state) => state.currentScreen);
  useEffect(() => {
    loadMenuData();
  }, []);
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col h-screen w-screen">
      {/* Top Section - Static */}
      <div className="h-[27vh] w-full bg-red-50 flex items-center justify-center">
        Top Section
      </div>

      {/* Middle Section - Scrollable */}
      <div className="h-[60vh] w-full overflow-y-auto pb-[5.125vh]">
        {children}
      </div>

      {/* Bottom Section - Static */}
      <div className="h-[5.125vh] w-full bg-blue flex items-center justify-center">
        <CartFooter />
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case "OrderTypeSelection":
        return <OrderTypeSelectionScreen />;
      case "Menu":
        return <MenuScreen />;
      case "ItemView":
        return <ItemViewScreen />;
      case "OrderSummary":
        return <OrderSummaryScreen />;
      case "Payment":
        return <PaymentScreen />;
      case "OrderCompletion":
        return <OrderCompletionScreen />;
      default:
        return <OrderTypeSelectionScreen />;
    }
  };

  return isLoading ? <Loader /> : <Layout>{renderScreen()}</Layout>;
}

export default App;
