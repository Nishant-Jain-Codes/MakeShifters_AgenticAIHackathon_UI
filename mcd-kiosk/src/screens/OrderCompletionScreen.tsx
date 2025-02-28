import useMenuStore from "../store/useMenuStore";

export default function OrderCompletionScreen() {
  const orderType = String(useMenuStore((state) => state.orderType) ?? "dine in");
  const orderId = useMenuStore((state) => state.orderId) ?? "0000";
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-[#FFC72C] shadow-lg rounded-2xl p-20 w-[900px] h-[1500px] flex flex-col items-center justify-start text-center">
        
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
            
            <p className="text-3xl text-black mt-40">
              When it beeps & flashes, proceed to the counter to collect your meal.
            </p>
            <img src="/beep-flash-icon.png" alt="Beeping Icon" className="w-44 mt-10" />

            <p className="text-3xl text-black mt-40">Enjoy your meal!</p>
            <img src="/meal-icon.png" alt="Meal Icon" className="w-48 mt-10" />
          </>
        )}
      </div>
    </div>
  );
}
