import { CreditCard, QrCode, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function PaymentScreen() {
  
  

  const checkoutHandler = async () => {
   

    try {
      const key = import.meta.env.VITE_RAZORPAY_API_KEY;
      // create order
      const { data: payment } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/checkout`,
        { amount: 152 },
        { withCredentials: true }
      );

      const options = {
        key: key,
        amount: Number(payment.order.amount),
        currency: "INR",
        name: "McDonald's",
        description: "Payment using RazorPay",
        image:
          "/assets/mcd-logo-filled.svg",
        order_id: payment.order.id,
        callback_url: `${
          import.meta.env.VITE_BACKEND_URL
        }/payment/verify-payment`,
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#1e3a8a",
        },
        handler:  () => {
          toast.success("Payment successful!");
        }
      }

      const razorpay = new (window as any).Razorpay(options);

      razorpay.open();
    } catch (error) {
      // toast.error(error?.response?.data?.error || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Card Container */}
      <div className="bg-white rounded-2xl p-10 w-[500px] gap-10 flex flex-col items-center justify-between">
        <h1 className="text-2xl font-semibold text-center text-black mt-10">
          Please select a payment type
        </h1>

        <div className="flex flex-col gap-6 w-full px-10">
          <button
            onClick={checkoutHandler}
            className="flex items-center justify-center gap-3 bg-[#FFC72C] hover:bg-yellow-500 transition-all text-primaryBlack font-medium py-5 rounded-lg w-full shadow-md text-lg"
          >
            <QrCode size={24} />
            QR Pay
          </button>

          <button className="flex items-center justify-center gap-3 bg-[#FFC72C] hover:bg-yellow-500 transition-all text-primaryBlack font-medium py-5 rounded-lg w-full shadow-md text-lg">
            <CreditCard size={24} />
            Credit/Debit Card
          </button>

          <button className="flex items-center justify-center gap-3 bg-[#FFC72C] hover:bg-yellow-500 transition-all text-primaryBlack font-medium py-5 rounded-lg w-full shadow-md text-lg">
            <Wallet size={24} />
            Cash (Pay at counter)
          </button>
        </div>

        <button className="mb-10 border border-primaryBlack text-primaryBlack py-4 px-6 rounded-lg hover:bg-gray-100 transition-all w-[60%] text-lg">
          Back
        </button>
      </div>
    </div>
  );
}
