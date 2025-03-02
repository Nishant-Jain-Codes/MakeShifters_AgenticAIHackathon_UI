import { ChevronRight } from "lucide-react";
import useMenuStore from "../store/useMenuStore"; // Import Zustand store
import { moveToSpecificScreen } from "../utils/functions";

const CartFooter = () => {
  const { basket,currentScreen } = useMenuStore();

  // Safely access `price` and ensure it is a valid number
  const totalPrice: number = basket.reduce(
    (total, item) => total + item.qty * (item.price || 0),
    0
  );

  return currentScreen === "OrderSummary" ? (
    <footer
    onClick={() => moveToSpecificScreen("Payment")}
    className="w-full h-full border-t p-4 px-10 text-xl bg-primaryYellow rounded-t-2xl shadow-xl flex gap-5 justify-between items-center"
  >
    <div className="flex gap-3 items-center">

    <img src="/assets/cart-outline.svg" alt="" />
    <span className="flex gap-4 font-medium">
      <span className="font-semibold">
        {basket.length}
        {basket.length > 1 ? " Items" : " Item"}
      </span>
      <span>{"|"}</span>
    </span>
    <span className=" font-medium">
      <span className="font-semibold">
        {"₹"}
        {totalPrice.toFixed(2)}
      </span>
    </span>
    </div>

    <p className="font-semibold flex gap-1 items-center">Proceed to Pay
      <ChevronRight size={32} />
    </p>
  </footer>
  ) : (
    <footer
      onClick={() => moveToSpecificScreen("OrderSummary")}
      className="w-full h-full border-t p-4 px-10 text-xl bg-primaryYellow rounded-t-2xl shadow-xl flex gap-5 justify-between items-center"
    >
      <div className="flex gap-5 items-center">

      <img src="/assets/cart-outline.svg" alt="" />
      <span className="flex gap-4 font-medium">
        <span className="font-semibold">
          {basket.length}
          {basket.length > 1 ? " Items" : " Item"}
        </span>
        <span>{"|"}</span>
      </span>
      <span className=" font-medium">
        <span className="font-semibold">
          {"₹"}
          {totalPrice.toFixed(2)}
        </span>
      </span>
      </div>

      <p className="font-semibold  flex gap-1 items-center">Go to Cart
        <ChevronRight size={32} />
      </p>
    </footer>
  );
};

export default CartFooter;