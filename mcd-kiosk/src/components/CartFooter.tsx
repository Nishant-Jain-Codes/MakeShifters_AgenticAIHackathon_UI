import useMenuStore from "../store/useMenuStore"; // Import Zustand store
import { moveToSpecificScreen } from "../utils/functions";

const CartFooter = () => {
  const { basket } = useMenuStore();

  // Safely access `price` and ensure it is a valid number
  const totalPrice: number = basket.reduce(
    (total, item) => total + item.qty * (item.price || 0),
    0
  );

  return (
    <footer
      onClick={() => moveToSpecificScreen("OrderSummary")}
      className="w-full h-full border-t p-4 bg-primaryYellow rounded-t-2xl shadow-xl flex gap-5  items-center"
    >
      <img src="/assets/cart-outline.svg" alt="" />
      <span className="flex gap-4 font-medium">
        <span className="font-bold">
          {basket.length}
          {basket.length > 1 ? " Items" : " Item"}
        </span>
        <span>{"|"}</span>
      </span>
      <span className=" font-medium">
        <span className="font-bold">
          {"₹"}
          {totalPrice.toFixed(2)}
        </span>
      </span>
    </footer>
  );
};

export default CartFooter;
