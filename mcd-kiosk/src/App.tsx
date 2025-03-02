import { useEffect, Component, ReactNode, useState } from "react";
import { Toaster } from "react-hot-toast";
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
import VoiceAssistant from "./components/VoiceAssistant";
import AvatarWelcome from "./screens/AvatarWelcome";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h2 className="text-center text-red-600 font-bold">
          Something went wrong. Please refresh.
        </h2>
      );
    }
    return this.props.children;
  }
}

function App() {
  const isLoading = useMenuStore((state) => state.isLoading);
  const currentScreen = useMenuStore((state) => state.currentScreen);
  const basket = useMenuStore((state) => state.basket);
  const [orderStarted, setOrderStarted] = useState(false);
  useEffect(() => {
    loadMenuData();
  }, []);

  const Layout = ({ children }: { children: ReactNode }) => (
    <div className="max-h-[100vh]">
      <div className="flex flex-col mx-auto w-[600px] h-[95.5vh] border-28 rounded-xl border-b-40 ">
        {!orderStarted ? (
          <AvatarWelcome setOrderStarted={setOrderStarted} />
        ) : (
          <>
            <Toaster position="top-center" reverseOrder={false} />
            {/* Top Section - Static */}
            <div className="relative h-[27vh] w-full bg-red-50 flex items-center border justify-center">
              {/* Back Button - Positioned at the top-left */}
              {currentScreen !== "OrderTypeSelection" && (
                <button
                  onClick={moveToPreviousScreen}
                  className="absolute bg-white rounded-full py-1 px-3 z-50 top-5 left-5  border-2 flex items-center text-2xl text-yellow-500 hover:text-yellow-400"
                >
                  <>
                    <ChevronLeft size={30} className="-ml-3" />
                    Back
                  </>
                </button>
              )}
              <VoiceAssistant />
              <Avatar />
              <img
                className="absolute object-cover border-4 w-full h-full z-10"
                src="https://image.lexica.art/full_webp/0ca5b78e-8c1f-4d56-84ab-3c30db53f9fd"
                alt=""
              />
            </div>

            {/* Middle Section - Scrollable */}
            <div className="h-full w-full overflow-y-auto">{children}</div>

            {/* Bottom Section - Static */}
            {basket.length > 0 && currentScreen !== "OrderTypeSelection" && (
              <div>
                <CartFooter />
              </div>
            )}
          </>
        )}
      </div>
      <div className="w-[200px] h-10 bg-black mx-auto"></div>
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

  return (
    <ErrorBoundary>
      {isLoading ? <Loader /> : <Layout>{renderScreen()}</Layout>}
    </ErrorBoundary>
  );
}

export default App;
