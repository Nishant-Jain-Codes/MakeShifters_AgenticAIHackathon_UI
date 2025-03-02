import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { OrderTypes } from "../utils/constants";
import { loadMenuData, moveToNextScreen } from "../utils/functions";
import FaceDetection from "../components/FaceDetect";

export default function OrderTypeSelectionScreen() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>("");
  const [isFaceDetected, setIsFaceDetected] = useState<boolean>(false);

  // Subtle background animation on mount
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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          id="animatedBlob"
          className="absolute top-0 left-0 w-full h-full opacity-20 transition-transform duration-5000"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, #FFBC0D 0%, transparent 50%), " +
              "radial-gradient(circle at 70% 60%, #FF5C5C 0%, transparent 50%), " +
              "radial-gradient(circle at 40% 80%, #FFBC0D 0%, transparent 40%)",
          }}
        />

        {/* McDonald's arch shapes */}
        <div className="absolute -right-20 top-10 w-80 h-80 rounded-full border-8 border-yellow-400 opacity-10"></div>
        <div className="absolute -left-40 bottom-10 w-96 h-96 rounded-full border-8 border-yellow-400 opacity-10"></div>
      </div>

      {/* McDonald's logo */}
      <motion.div
        className="absolute top-6 left-1/2 transform -translate-x-1/2"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-16 h-16 text-yellow-400 mb-2">
          <img src="/assets/mcd-logo-unfilled.svg" alt="" className="w-30" />
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 w-full max-w-3xl px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.h1
          className="text-center font-croissant text-3xl font-bold text-white mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Where will you be eating today?
        </motion.h1>

        {/* Order type selection cards */}
        <div className="grid grid-cols-2 gap-6">
          {OrderTypes.map((order) => (
            <motion.button
              key={order.id}
              className={`relative overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center h-48 transition-all ${
                selectedOrder === order.id
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/50"
                  : "bg-white/10 backdrop-blur-md hover:bg-white/15"
              }`}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedOrder(order.id)}
            >
              {/* Background decorative elements */}
              {selectedOrder === order.id && (
                <motion.div
                  className="absolute inset-0 opacity-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white"></div>
                  <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-white"></div>
                </motion.div>
              )}

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-4"
              >
                <img
                  src={order.imgSrc}
                  alt={order.label}
                  className="w-20 h-20 object-contain drop-shadow-lg"
                />
              </motion.div>

              <span
                className={`font-semibold text-lg ${
                  selectedOrder === order.id ? "text-white" : "text-white"
                }`}
              >
                {order.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Proceed button */}
      {selectedOrder && (
        <motion.button
          className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-red-800 font-bold py-3 px-10 rounded-full shadow-lg transform transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
        </motion.button>
      )}

      {/* Face Detection Component (hidden until needed) */}
      {selectedOrder && !isFaceDetected && (
        <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
          <motion.div
            className="bg-white p-6 rounded-xl max-w-md text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-red-700 mb-4">
              Face Detection
            </h3>
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
          </motion.div>
        </div>
      )}
    </div>
  );
}
