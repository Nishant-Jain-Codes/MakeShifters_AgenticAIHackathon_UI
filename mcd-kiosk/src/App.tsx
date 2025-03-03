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
import { ChevronLeft, TriangleAlert } from "lucide-react";
import Avatar from "./components/Avatar";
import VoiceAssistant from "./components/VoiceAssistant";
import AvatarWelcome from "./screens/AvatarWelcome";

interface ErrorBoundaryProps {
  children: ReactNode;
  setOrderStarted: (value: boolean) => void;
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
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-6">
          <div className="bg-white shadow-xl rounded-2xl p-10 flex flex-col items-center">
            <TriangleAlert className="w-20 h-20 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-red-600">
              Something Went Wrong
            </h1>
            <p className="text-gray-600 mt-2">
              An unexpected error has occurred. Please try again.
            </p>
            <button
              onClick={() => this.props.setOrderStarted(false)}
              className="mt-6 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const isLoading = useMenuStore((state) => state.isLoading);
  const currentScreen = useMenuStore((state) => state.currentScreen);
  const orderStarted = useMenuStore((state) => state.orderStarted);
  const [kiosk, setKiosk] = useState(true);
  useEffect(() => {
    loadMenuData();
  }, []);

  const Layout = ({ children }: { children: ReactNode }) => (
    <div className="max-h-[100vh]">
      <div
        className={`flex flex-col mx-auto w-[600px] h-[95.5vh] ${
          !kiosk ? "border-0 border-b-0" : "border-28 rounded-xl border-b-40"
        }`}
      >
        <div
          className={`${
            kiosk
              ? "absolute top-0 right-0 w-[550px]  text-white "
              : "relative text-right"
          }  cursor-pointer`}
          onClick={() => setKiosk((prev) => !prev)}
        >
          {kiosk ? "Hide Kiosk" : "Show Kiosk"}
        </div>
        {!orderStarted ? (
          <AvatarWelcome />
        ) : (
          <>
            <Toaster position="top-center" reverseOrder={false} />
            {/* Top Section - Static */}
            <div className="relative h-[27vh] w-full bg-red-50 flex items-center border justify-">
              {/* Back Button - Positioned at the top-left */}
              {currentScreen !== "OrderTypeSelection" && (
                <button
                  onClick={moveToPreviousScreen}
                  className="absolute bg-yellow-500 rounded-full p-1 z-50 top-5 left-5 border-2 border-yellow-600 hover:bg-yellow-400"
                >
                  <ChevronLeft size={20} className="text-red-800" />
                </button>
              )}

              <VoiceAssistant />
       
                <Avatar />
         

              <img
                className="absolute object-cover blur-[3px] w-full h-full z-10"
                src="/assets/avatar-bg.webp"
                alt=""
              />
              <div className="absolute inset-0 z-40 bg-gradient-to-r from-black to-transparent w-full h-full opacity-60"></div>
            </div>

            {/* Middle Section - Scrollable */}
            <div className="h-full w-full overflow-y-auto">{children}</div>

            {/* Bottom Section - Static */}

            <div>
              <CartFooter />
            </div>
          </>
        )}
      </div>
      {kiosk && <div className="w-[200px] h-10 bg-black mx-auto"></div>}
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
    <ErrorBoundary setOrderStarted={useMenuStore.getState().setOrderStarted}>
      {isLoading ? <Loader /> : <Layout>{renderScreen()}</Layout>}
    </ErrorBoundary>
  );
}

export default App;
