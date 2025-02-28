import { motion } from "framer-motion";
import clsx from "clsx";
import { MenuItem } from "./../types";
import { Plus, Minus } from "lucide-react";
import useMenuStore from "../store/useMenuStore";

interface MenuItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onSelect: () => void;
}

export default function MenuItemCard({
  item,
  isSelected,
  onSelect,
}: MenuItemCardProps) {
  const { basket, addItemToBasket, removeItemFromBasket } = useMenuStore();

  const basketItem = basket.find((b) => b.id === item.id);
  const quantity = basketItem ? basketItem.qty : 0;

  const imgSrc = item.imageUrl.replace("{format}", "png").replace("{size}", "128");

  return (
    <motion.div
      onClick={onSelect}
      className={clsx(
        "p-4 rounded-xl cursor-pointer transition-all shadow-md relative",
        isSelected
          ? " text-primaryBlack shadow-lg scale-110"
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

      <img
        src={imgSrc}
        alt={item.name}
        className="w-16 h-16 object-contain mx-auto"
      />
      <p className="mt-2 text-center font-semibold">{item.name}</p>

      {/* Price Display */}
      <p className="text-center text-gray-700 mt-1 font-medium">
        <span className="line-through text-gray-500">
          {item.price.currencySymbol}
          {item.price.price}
        </span>
        <span className="ml-2 font-bold">
          {item.price.currencySymbol}
          {item.price.discountPrice}
        </span>
      </p>

      {/* Quantity Selector (Using Zustand) */}
      <div className="flex items-center justify-center mt-3 space-x-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeItemFromBasket(item.id);
          }}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 cursor-pointer"
        >
          <Minus size={16} />
        </button>

        <span className="text-lg font-semibold">{quantity}</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addItemToBasket(item.id);
          }}
          className="bg-primaryYellow p-2 rounded-full hover:bg-yellow-400 cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>
    </motion.div>
  );
}
