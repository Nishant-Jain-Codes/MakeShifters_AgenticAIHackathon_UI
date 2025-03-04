import useMenuStore from "../store/useMenuStore";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import CustomizationOption from "../components/CustomisationOption";
import toast from "react-hot-toast";
import { moveToSpecificScreen } from "../utils/functions";

const ItemViewScreen = () => {
  const basket = useMenuStore((state) => state.basket);
  const menuList = useMenuStore((state) => state.menuList);
  const addItemToBasket = useMenuStore((state) => state.addItemToBasket);
  const removeItemFromBasket = useMenuStore((state) => state.removeItemFromBasket);
  const currentSelectedItem = useMenuStore((state) => state.currentSelectedItem);

  const id = currentSelectedItem;
  const item = menuList.find((menuItem) => menuItem.id === id);
  const imgSrc = item?.imageUrl
    .replace("{format}", "png")
    .replace("{size}", "128");

  const basketItem = basket.find((b) => b.id === item?.id);
  const quantity = basketItem ? basketItem.qty : 0;

  if (!item) {
    moveToSpecificScreen("Menu");
    return
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Main Content */}
      <div className="max-w-3xl mx-auto w-full py-6 px-4 flex flex-col">
        {/* Product Image & Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-b from-red-600 to-red-700 pt-6 pb-10 relative">
            <div className="absolute -bottom-30 left-1/2 transform -translate-x-1/2">
              <img
                src={imgSrc}
                alt={item.name}
                className="w-52 h-52 object-contain "
              />
            </div>
          </div>

          <div className="pt-28 pb-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
            <p className="text-gray-600 mt-2 mb-4">{item.description}</p>
            <div className="flex justify-center items-center gap-2 mb-4"></div>

            <div className="mt-4 flex justify-between items-center px-10">
              <span className="text-3xl font-bold text-red-600">
                ₹{item.price}
              </span>
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
                      addItemToBasket(item.id);
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
                    addItemToBasket(item.id);
                    toast.success("Item added to cart");
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
          </div>
        </div>

        {/* Customization Options */}
        <div className="">
         
          <CustomizationOption cust={item} />
        </div>
      </div>
    </div>
  );
};

export default ItemViewScreen;
