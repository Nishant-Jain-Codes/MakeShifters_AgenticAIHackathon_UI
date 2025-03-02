import { motion } from "framer-motion";
import clsx from "clsx";
import { MenuItem } from "./../types";
import { Plus, Minus } from "lucide-react";
import useMenuStore from "../store/useMenuStore";
import { memo, useRef } from "react";

interface MenuItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onSelect: () => void;
}

const MenuItemCard = memo(function MenuItemCard({
  item,
  isSelected,
  onSelect,
}: MenuItemCardProps) {
  const { basket, addItemToBasket, removeItemFromBasket } = useMenuStore();
  const basketItem = basket.find((b) => b.id === item.id);
  const quantity = basketItem ? basketItem.qty : 0;

  // Ref to store scroll position
  const scrollPosition = useRef(0);

  // Store current scroll position before state change
  const handleAddToCart = (itemId: number) => {
    scrollPosition.current = window.scrollY; // Save current scroll position
    addItemToBasket(itemId);

    setTimeout(() => {
      window.scrollTo(0, scrollPosition.current); // Restore scroll position after state update
    }, 0);
  };

  const imgSrc = item.imageUrl.replace("{format}", "png").replace("{size}", "128");

  return (
    <motion.div
      onClick={onSelect}
      className={clsx(
        "p-4 flex flex-col justify-between w-[180px] border border-gray-200 rounded-xl cursor-pointer transition-all shadow-md relative",
        isSelected
          ? " text-primaryBlack shadow-lg"
          : "bg-white text-black hover:shadow-lg hover:scale-102"
      )}
      animate={isSelected ? { scale: 1.1, y: [-2, 2, -2] } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      {/* Veg/Non-Veg Icon */}
      <div className="absolute top-2 right-2">
        {item.isVeg ? (
          <img src="/assets/veg.png" alt="" className="w-4" />
        ) : (
          <img src="/assets/nonveg.png" alt="" className="w-4" />
        )}
      </div>

      <img src={imgSrc} alt={item.name} className="w-16 h-16 object-contain mx-auto" />
      <p className="mt-2 text-center font-semibold">{item.name}</p>

      {/* Price on Left & Add Button on Right */}
      <div className="flex items-center gap-1 justify-between mt-3 -ml-1">
        <p className="text-amber-700 font-semibold text-lg">₹{item.price}</p>

        {quantity > 0 ? (
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeItemFromBasket(item.id);
              }}
              className="bg-gray-200 p-1 rounded-full hover:bg-gray-300 cursor-pointer"
            >
              <Minus size={20} />
            </button>

            <span className="text-lg font-semibold">{quantity}</span>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(item.id);
              }}
              className="bg-primaryYellow p-1 rounded-full hover:bg-yellow-400 cursor-pointer"
            >
              <Plus size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(item.id);
            }}
            className="bg-primaryYellow py-1 px-3 rounded-lg hover:bg-yellow-400 cursor-pointer flex gap-2 items-center"
          >
            Add
            <span>
              <Plus size={20} />
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
});

export default MenuItemCard;
