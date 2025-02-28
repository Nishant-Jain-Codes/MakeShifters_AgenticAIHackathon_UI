import { useNavigate } from "react-router-dom";
import { CreditCard, QrCode, Wallet } from "lucide-react";

export default function PaymentScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-white p-6 max-h-[55vh]">
      {/* Card Container */}
      <div className="bg-white rounded-2xl p-10 w-[700px] h-[1000px] flex flex-col items-center justify-between">
        <h1 className="text-2xl font-semibold text-center text-black mt-10">
          Please select a payment type
        </h1>

        <div className="flex flex-col gap-6 w-full px-10">
          <button className="flex items-center justify-center gap-3 bg-[#FFC72C] hover:bg-yellow-500 transition-all text-primaryBlack font-medium py-5 rounded-lg w-full shadow-md text-lg">
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

        <button
          className="mb-10 border border-primaryBlack text-primaryBlack py-4 px-6 rounded-lg hover:bg-gray-100 transition-all w-[60%] text-lg"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}
