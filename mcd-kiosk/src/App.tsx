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
import { loadMenuData, moveToPreviousScreen } from "./utils/functions";
import CartFooter from "./components/CartFooter";
import { ChevronLeft } from "lucide-react";
import Avatar from "./components/Avatar";

function App() {
  const isLoading = useMenuStore((state) => state.isLoading);
  const currentScreen = useMenuStore((state) => state.currentScreen);
  const basket = useMenuStore((state) => state.basket);
  useEffect(() => {
    loadMenuData();
  }, []);
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col h-screen w-screen">
      {/* Top Section - Static */}
      <div className="relative h-[27vh] w-full bg-red-50 flex items-center border justify-center">
        {/* Back Button - Positioned at the top-left */}
        <button
          onClick={moveToPreviousScreen}
          className="absolute top-5 left-5 flex items-center gap-2 text-2xl text-yellow-500 hover:text-yellow-400"
        >
{currentScreen !== "OrderTypeSelection" && (
  <>
    <ChevronLeft size={31} /> Back
  </>
)}
        </button>
        <Avatar />
      </div>

      {/* Middle Section - Scrollable */}
      <div className="h-[60vh] w-full overflow-y-auto pb-[5.125vh]">
        {children}
      </div>

  {/* Bottom Section - Static */}
  {basket.length > 0 && currentScreen !== "OrderTypeSelection" && (
  <div>
    <CartFooter />
  </div>
)}
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
