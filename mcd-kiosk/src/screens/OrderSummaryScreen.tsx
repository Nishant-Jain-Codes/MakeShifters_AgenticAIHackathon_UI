import { BasketItem } from "../store/useMenuStore";
import useMenuStore from "../store/useMenuStore";
 
export default function OrderSummaryScreen() {
  const { basket } = useMenuStore();
 
  const totalPrice = basket.reduce((total, item) => total + item.price * item.qty, 0);
 
  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Order Summary</h1>
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        {basket.map((item: BasketItem) => (
          <div key={item.MenuItem.id} className="flex items-center gap-4 border-b border-gray-300 py-4">
            <img
              src={item.MenuItem.imageUrl}
              alt={item.MenuItem.name}
              className="w-32 h-32 border border-gray-300 object-cover rounded-lg shadow-md"
            />
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-gray-800">{item.MenuItem.name}</h2>
              <p className="text-gray-600">{item.MenuItem.description}</p>
              <p className="text-gray-500 mt-1">Quantity: {item.qty}</p>
            </div>
            <p className="text-xl font-bold text-gray-800">
              <span className="text-gray-500">₹</span>{item.price}
            </p>
          </div>
        ))}
        <div className="mt-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Total: 
            <span className="text-gray-500"> ₹{totalPrice}</span>
          </h2>
          <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-200">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}