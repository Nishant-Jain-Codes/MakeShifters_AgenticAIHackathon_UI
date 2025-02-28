/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { OrderTypes } from "../utils/constants";
import { loadMenuData, moveToNextScreen } from "../utils/functions";
import FaceDetection from "../components/FaceDetect";

export default function OrderTypeSelectionScreen() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

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
              }`}
              onClick={() => {
                setSelectedOrder(order.id);
                // Don't move to next screen yet, wait for face detection
              }}
            >
              <div className="mb-4">
                <img
                  src={order.imgSrc}
                  alt={order.label}
                  className="w-50 h-50 object-contain"
                />
              </div>
              <span className="font-medium text-lg">{order.label}</span>
            </button>
          ))}
        </div>
      </div>
      {selectedOrder && !isFaceDetected && (
        <FaceDetection
          onFaceDetected={() => {
            console.log("✅ Face detected! Moving to next screen...");
            setIsFaceDetected(true);
            moveToNextScreen();
            loadMenuData();
          }}
        />
      )}
    </div>
  );
}
