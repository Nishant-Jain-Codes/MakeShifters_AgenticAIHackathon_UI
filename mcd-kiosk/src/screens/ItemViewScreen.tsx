import React from "react";
import { useParams } from "react-router-dom";
import useMenuStore from "../store/useMenuStore";
import { Plus, Minus } from "lucide-react";

const ItemViewScreen = () => {
  const {
    basket,
    menuList,
    addItemToBasket,
    removeItemFromBasket,
    currentSelectedItem,
  } = useMenuStore();

  const id = currentSelectedItem;
  const item = menuList.find((menuItem) => menuItem.id === id);
  const imgSrc = item?.imageUrl
    .replace("{format}", "png")
    .replace("{size}", "128");

  const basketItem = basket.find((b) => b.id === item?.id);
  const quantity = basketItem ? basketItem.qty : 0;

  if (!item) {
    return (
      <div className="text-center text-gray-500 mt-10">Item not found</div>
    );
  }

  return (
    <div className="border rounded-xl shadow-md p-4 flex gap-8 flex-col items-center bg-white h-full w-[80%] my-20 mx-auto">
      <img
        src={imgSrc}
        alt={item.name}
        className="w-full h-64 object-cover rounded-lg my-4"
      />
      <h2 className="text-lg font-bold">{item.name}</h2>
      <p className="text-gray-700">{item.description}</p>
      <p className="text-center text-gray-700 mt-1 font-medium  text-4xl">
        <span className="text-gray-500">
          {"₹"}
          {item.price}
        </span>
      </p>

      {/* Quantity Selector (Using Zustand) */}
      <div className="flex items-center gap-3 justify-center mt-3 space-x-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeItemFromBasket(item.id);
          }}
          className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 cursor-pointer"
        >
          <Minus size={20} />
        </button>

        <span className="text-lg font-semibold">{quantity}</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addItemToBasket(item.id);
          }}
          className="bg-primaryYellow p-2 rounded-full hover:bg-yellow-400 cursor-pointer"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default ItemViewScreen;
