import { useState, useEffect } from "react";
import { OrderTypes } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { loadMenuData } from "../utils/functions";
import FaceDetection from "../components/FaceDetect";
import Loader from "../components/Loader";

export default function OrderTypeSelectionScreen() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [ageDetected, setAgeDetected] = useState<number | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (selectedOrder) {
      timeout = setTimeout(() => {
        if (ageDetected === null) {
          console.log("⏳ No age detected, defaulting to 18");
          handleDetectAge(18);
        }
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [selectedOrder, ageDetected]);

  const handleDetectAge = (age: number) => {
    if (ageDetected === null) {
      setAgeDetected(age);
      console.log("✅ User's detected age:", age);

      setTimeout(() => {
        navigate("/menu");
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[50vh] bg-[#f1ece5]">

      <h1 className="w-full flex flex-col items-center my-50 text-3xl font-bold">
        Where will you be eating today?
      </h1>

      <div className="bg-primaryYellow p-20 w-full min-h-[35.2vh]">
        <div className="flex gap-20 px-6 w-full max-w-3xl mx-auto">
          {OrderTypes.map((order) => (
            <button
              key={order.id}
              className={`flex-1 bg-white rounded-3xl p-6 flex flex-col items-center shadow-md ${
                order.id === selectedOrder ? "ring-4 ring-red-500" : ""
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (!loading) {
                  setSelectedOrder(order.id);
                loadMenuData();
                  setLoading(true);
                }
              }}
            >
              <div className="mb-4">
                <img src={order.imgSrc} alt={order.label} className="w-50 h-50 object-contain" />
              </div>
              <span className="font-medium text-lg">{order.label}</span>
            </button>
          ))}
        </div>
      </div>

      {loading && <Loader />}

      {selectedOrder && <FaceDetection onDetect={handleDetectAge} />}
    </div>
  );
}
