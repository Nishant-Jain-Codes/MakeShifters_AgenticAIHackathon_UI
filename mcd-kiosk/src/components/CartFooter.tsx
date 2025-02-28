import useMenuStore from "../store/useMenuStore"; // Import Zustand store

const CartFooter = () => {
  const { basket } = useMenuStore();

  // Safely access `price` and ensure it is a valid number
  const totalPrice: number = basket.reduce(
    (total, item) => total + item.qty * (item.price || 0),
    0
  );

  // Get currency symbol safely (fallback to "$" if missing)
  const currencySymbol: string =
    basket.length > 0 ? basket[0]?.MenuItem?.price?.currencySymbol : "₹";

  return (
    <footer className="w-full h-full border-t p-4 bg-primaryYellow shadow-md flex gap-5  items-center">
      <img src="/assets/cart-outline.svg" alt="" />
      <span className="flex gap-4 font-medium">
       <span className="font-bold">{basket.length}{basket.length>0 ? " Items": " Item"}</span>
       <span>{"|"}</span>
      </span>
      <span className=" font-medium">
       
        <span className="font-bold">
          {currencySymbol}
          {totalPrice.toFixed(2)}
        </span>
      </span>
    </footer>
  );
};

export default CartFooter;
