import { BasketItem } from "../store/useMenuStore";
import useMenuStore from "../store/useMenuStore";

export default function OrderSummaryScreen() {
  const { basket } = useMenuStore();

  const totalPrice = basket.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
  const totalItems = basket.length;
  const totalQuantity = basket.reduce((total, item) => total + item.qty, 0);

  return (
    <div className="flex flex-col items-center h-full px-[10%] mx-auto mt-20">
      {/* Header with Title */}
      <div className="max-w-lg mx-auto flex items-center justify-center">
        <h1 className="text-4xl font-extrabold text-yellow-500 text-center">
          Order Summary
        </h1>
      </div>

      {/* Main content */}
      <div className="w-full mx-auto p-4 mt-10">
        <div className="rounded-2xl shadow-xl overflow-hidden">
          {/* Order items */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">
              Your Order
            </h2>

            {basket.map((item: BasketItem) => (
              <div
                key={item.MenuItem.id}
                className="flex items-center gap-4 border-b border-yellow-100 py-4"
              >
                <div className="relative w-[120px] h-[120px] flex-shrink-0">
                  <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border-2 border-yellow-400">
                    <img
                      src={item.MenuItem.imageUrl}
                      alt={item.MenuItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {item.qty}
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-yellow-500">
                    {item.MenuItem.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.MenuItem.description}
                  </p>
                </div>

                <div className="text-lg font-bold text-[#d97606]">
                  ₹{item.price * item.qty}
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-yellow-50 p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Total Items</span>
              <span className="font-medium">{totalItems}</span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Total Quantity</span>
              <span className="font-medium">{totalQuantity}</span>
            </div>

            <div className="border-t border-yellow-300 my-3"></div>

            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-[#d97606]">
                Total Price
              </span>
              <span className="text-xl font-bold text-[#d97606]">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
