import { Wallet, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import useMenuStore from "../store/useMenuStore";
import { moveToNextScreen, moveToPreviousScreen } from "../utils/functions";
import { useState } from "react";

export default function PaymentScreen() {
  const { basket } = useMenuStore();
  const [loading, setLoading] = useState(false);

  const totalPrice = basket.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const checkoutHandler = async () => {
    try {
      setLoading(true);
      const key = import.meta.env.VITE_RAZORPAY_API_KEY;
      const { data: payment } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/checkout`,
        { amount: totalPrice },
        { withCredentials: false }
      );

      const options = {
        key: key,
        amount: Number(payment.order.amount),
        currency: "INR",
        name: "McDonald's",
        description: "Payment using RazorPay",
        image: "/assets/mcd-logo-filled.svg",
        order_id: payment.order.id,
        callback_url: `${
          import.meta.env.VITE_BACKEND_URL
        }/payment/verify-payment`,
        theme: { color: "#FFC72C" },
        handler: () => {
          toast.success("Payment successful!");
          moveToNextScreen();
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      debugger;
      toast.error("Payment failed. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-full bg-gradient-to-br p-6">
      <div className=" bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 flex flex-col gap-5 items-center w-[90%] bg-yellow-50 shadow-2xl transition-all duration-300 hover:scale-102 border border-white/30">
        <h1 className="text-2xl  font-bold text-center mb-6">
          Select Payment Method
        </h1>

        <button
          onClick={checkoutHandler}
          className="flex items-center justify-center gap-3 bg-[#FFC72C] hover:bg-yellow-500 transition-all cursor-pointer text-black font-semibold py-4 rounded-lg w-full shadow-lg text-lg transform hover:scale-102"
          disabled={loading}
        >
          <CreditCard size={24} />
          {loading ? "Processing..." : "Pay Online"}
        </button>

        <button
          className="flex cursor-pointer items-center justify-center gap-3 bg-[#D52B1E] hover:bg-red-600 transition-all text-white font-semibold py-4 rounded-lg w-full shadow-lg text-lg mt-4 transform hover:scale-102"
          onClick={moveToNextScreen}
        >
          <Wallet size={24} />
          Cash (Pay at Counter)
        </button>

        <button
          className="mt-6 cursor-pointer border py-3 px-6 rounded-lg hover:bg-white hover:text-black transition-all w-[60%] text-lg transform hover:scale-102"
          onClick={() => moveToPreviousScreen()}
        >
          Back
        </button>
      </div>
    </div>
  );
}
