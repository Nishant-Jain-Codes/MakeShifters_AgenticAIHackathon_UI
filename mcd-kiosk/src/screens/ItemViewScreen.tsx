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
    <div className="rounded-xl shadow-md p-4 flex gap-8 flex-col bg-white h-full  my-20 mx-auto">
      <div className="flex flex-col items-center gap-8 justify-center">
        <img
          src={imgSrc}
          alt={item.name}
          className="w-64 h-64 border border-gray-100 object-cover rounded-xl my-4"
        />
        <h2 className="text-lg font-bold">{item.name}</h2>
        <p className="text-gray-700">{item.description}</p>
        <p className="text-center text-gray-700 mt-1 font-medium  text-4xl">
          <span className="text-gray-500">
            {"₹"}
            {item.price}
          </span>
        </p>

        <div className="flex items-center mt-5 justify-center">
          {quantity > 0 ? (
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
                className="bg-primaryYellow p-2 rounded-full hover:bg-yellow-400  cursor-pointer"
              >
                <Plus size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addItemToBasket(item.id);
              }}
              className="bg-primaryYellow py-2 px-4 rounded-lg hover:bg-yellow-400 cursor-pointer flex gap-2 items-center"
            >
              Add
              <span>
                {" "}
                <Plus size={20} />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemViewScreen;
