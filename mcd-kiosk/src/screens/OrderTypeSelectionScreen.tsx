import { useState, useEffect } from "react";
import { OrderTypes } from "../utils/constants";
import { loadMenuData, moveToNextScreen } from "../utils/functions";
import FaceDetection from "../components/FaceDetect";

export default function OrderTypeSelectionScreen() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>("");
  const [isFaceDetected, setIsFaceDetected] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const blob = document.getElementById("animatedBlob");
      if (blob) {
        const randomX = Math.random() * 10 - 5;
        const randomY = Math.random() * 10 - 5;
        blob.style.transform = `translate(${randomX}px, ${randomY}px)`;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-red-600 to-red-800">
      <div className="absolute inset-0 overflow-hidden">
        <div
          id="animatedBlob"
          className="absolute top-0 left-0 w-full h-full opacity-20 transition-transform duration-[5000ms]"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, #FFBC0D 0%, transparent 50%), " +
              "radial-gradient(circle at 70% 60%, #FF5C5C 0%, transparent 50%), " +
              "radial-gradient(circle at 40% 80%, #FFBC0D 0%, transparent 40%)",
          }}
        />
        <div className="absolute -right-20 top-10 w-80 h-80 rounded-full border-8 border-yellow-400 opacity-10"></div>
        <div className="absolute -left-40 bottom-10 w-96 h-96 rounded-full border-8 border-yellow-400 opacity-10"></div>
      </div>

      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="w-16 h-16 text-yellow-400 mb-2">
          <img src="/assets/mcd-logo-unfilled.svg" alt="" className="w-30" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6">
        <h1 className="text-center font-croissant text-3xl font-bold text-white mb-10 fade-in">
          Where will you be eating today?
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {OrderTypes.map((order) => (
            <button
              key={order.id}
              className={`relative  cursor-pointer overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center h-48 transition-all duration-300 ${
                selectedOrder === order.id
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/50"
                  : "bg-white/20 backdrop-blur-md hover:bg-white/40 hover:scale-105"
              }`}
              onClick={() => setSelectedOrder(order.id)}
            >
              <img
                src={order.imgSrc}
                alt={order.label}
                className="w-25 h-25 object-contain drop-shadow-lg"
              />
              <span className="font-semibold text-lg text-white">
                {order.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <button
          className="mt-8 bg-yellow-400  hover:bg-yellow-500 text-red-800 font-bold py-3 px-10 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => {
            if (!isFaceDetected) {
              // Show face detection component
            } else {
              moveToNextScreen();
              loadMenuData();
            }
          }}
        >
          Continue
        </button>
      )}

      {selectedOrder && !isFaceDetected && (
        <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center fade-in">
          <div className="bg-white p-6 rounded-xl max-w-md text-center">
            <h3 className="text-xl font-bold text-red-700 mb-4">Face Detection</h3>
            <p className="text-gray-700 mb-6">
              Please look at the camera to start your order.
            </p>
            <FaceDetection
              onFaceDetected={() => {
                setIsFaceDetected(true);
                moveToNextScreen();
                loadMenuData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}