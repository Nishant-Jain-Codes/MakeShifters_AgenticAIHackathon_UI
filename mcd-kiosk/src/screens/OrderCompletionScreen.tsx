import { useState, useEffect, useRef, useCallback, useMemo, use } from "react";
import useMenuStore from "../store/useMenuStore";

export default function OrderCompletionScreen() {
  const orderType = String(
    useMenuStore((state) => state.orderType) ?? "take away"
  );
  const orderId = useMemo(() => Math.floor(100 + Math.random() * 900), []);

  const resetOrder = useMenuStore((state) => state.resetOrder);

  // Generate table number for dine-in orders
  const [tableNumber, setTableNumber] = useState<number | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null); 

  useEffect(() => {
    if (orderType === "dine in" && !tableNumber) {
      setTableNumber(Math.floor(100 + Math.random() * 900)); // Random 3-digit number
    }
  }, [orderType, tableNumber]);


  // Function to handle starting a new order
  const handleNewOrder = () => {
    window.location.reload();
  };

  // Function to handle printing bill
  const handlePrintBill = () => {
    alert("Printing your receipt...");
    // Implement actual printing functionality here
  };

  // Set up auto-redirect timer
  useEffect(() => {
    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Clear interval when we reach zero
          if (timerRef.current) clearInterval(timerRef.current);
          // Execute handleNewOrder
          handleNewOrder();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="relative bg-yellow-400 shadow-xl p-8 w-full max-w-4xl flex flex-col items-center justify-start text-center overflow-hidden">
        {/* Auto-redirect timer banner */}
        <div className="bg-red-600 text-white py-2 px-4 rounded-lg mb-4 w-full">
          <p className="text-lg font-medium">
            Auto-redirecting to new order in {timeLeft} seconds
          </p>
        </div>

        {/* Content container with proper spacing from the arches */}
        <div className="z-10 w-full">
          {/* Takeaway Mode */}
          {orderType === "take away" ? (
            <>
              <h1 className="text-xl font-bold text-red-600 mb-2">
                Order Complete!
              </h1>
              <p className="text-xl  font-medium text-gray-800 mb-3">
                Please collect your order when your number is called
              </p>
              <div className="bg-red-600 text-yellow-400 py-3 px-6 rounded-lg inline-block mb-2">
                <p className="text-xl font-medium">YOUR ORDER NUMBER</p>
              </div>
              <p className="text-2xl  font-bold text-red-600 mb-10">
                {orderId}
              </p>
              <img
                src="/assets/mcd-logo-filled.svg"
                alt="McDonald's Logo"
                className="w-20 mx-auto my-6"
              />
            </>
          ) : (
            /* Dine-In Mode */
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-6">
                Thank You For Dining With Us!
              </h1>

              {/* Table Number Section */}
              <div className="mb-8">
                <p className="text-xl md:text-2xl font-medium text-gray-800 mb-2">
                  Please take a seat at table:
                </p>
                <p className="text-7xl md:text-9xl font-bold text-red-600">
                  {tableNumber}
                </p>
              </div>

              {/* Order Number Section */}
              <div className="bg-red-600 text-yellow-400 py-3 px-6 rounded-lg inline-block mb-6">
                <p className="text-xl font-medium">ORDER NUMBER: {orderId}</p>
              </div>

              <p className="text-2xl text-gray-800 mb-6">Enjoy your meal!</p>
              <img
                src="/assets/burger-icon.svg"
                alt="McDonald's Meal"
                className="w-20 mx-auto my-4"
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/80/80";
                }}
              />
            </>
          )}

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10">
            <button
              onClick={handlePrintBill}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 w-full md:w-auto"
            >
              Print Receipt
            </button>
            <button
              onClick={handleNewOrder}
              className="hover:bg-yellow-200 text-red-600 font-bold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 border-2 border-red-600 w-full md:w-auto"
            >
              Start New Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
