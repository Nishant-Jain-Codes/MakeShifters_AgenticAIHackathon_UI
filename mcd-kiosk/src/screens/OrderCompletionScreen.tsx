import useMenuStore from "../store/useMenuStore";

export default function OrderCompletionScreen() {
  const orderType = String(useMenuStore((state) => state.orderType) ?? "take awa");
  const orderId = useMenuStore((state) => state.orderId) ?? "0000";
  
  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-primaryYellow shadow-lg rounded-2xl p-20 w-full flex flex-col items-center justify-start text-center">
        
        {/* Takeaway Mode */}
        {orderType === "take away" ? (
          <>
            <h1 className="text-4xl font-semibold mt-20 text-black">
              Thank you! Please collect your number below and wait for it to be called
            </h1>
            <p className="text-3xl font-medium text-black mt-40">
              Your take away order number is
            </p>
            <p className="text-9xl font-bold text-black mt-10">{orderId}</p>
          </>
        ) : (
          /* Dine-In Mode */
          <>
            <h1 className="text-4xl font-semibold mt-20 text-black">Thank you!</h1>
            <p className="text-3xl text-black mt-40">
              Please take a table number on your left.
            </p>
            <p className="text-9xl font-bold text-black mt-10">{orderId}</p>

            <p className="text-3xl text-black mt-20">Enjoy your meal!</p>
            <img src="/meal-icon.png" alt="Meal Icon" className="w-48 mt-10" />
          </>
        )}
      </div>
    </div>
  );
}
