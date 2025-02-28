import { use, useState } from "react";
// import { Switch } from "@/components/ui/switch"
import { OrderTypes } from "../utils/constants";
import { useNavigate } from "react-router-dom";

export default function OrderTypeSelectionScreen() {
  const [takeOut, setTakeOut] = useState(false);
  const Navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-[50vh] bg-[#f1ece5]">
      <img src="assets/mcd-logo-unfilled.svg" alt="" className="w-64 mt-40" />

      <h1 className=" w-full flex flex-col items-center my-50 text-3xl font-bold">
        Where will you be eating today?
      </h1>

      <div className="bg-primaryYellow p-20 w-full min-h-[50vh] ">
        <div className=" flex gap-20 px-6 w-full max-w-3xl mx-auto ">
          {OrderTypes.map((order) => (
            <button
              key={order.id}
              className={`flex-1 bg-white rounded-3xl p-6 flex flex-col items-center shadow-md ${
                (order.id === "take away") === takeOut
                  ? "ring-4 ring-red-500"
                  : ""
              }`}
              onClick={() => {
                setTakeOut(order.id === "take away");
                Navigate("/menu");
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
    </div>
  );
}
