import { BasketItem } from "../store/useMenuStore";
import useMenuStore from "../store/useMenuStore";

export default function OrderSummaryScreen() {
  const { basket } = useMenuStore();

  return (
    <div>
      {basket.map((item: BasketItem) => (
        <div>
          <div className="flex flex-col items-center gap-8 justify-center">
            <img
              src={item.MenuItem.imageUrl}
              alt={item.MenuItem.imageUrl}
              className="w-64 h-64 border border-gray-100 object-cover rounded-xl my-4"
            />
            <h2 className="text-lg font-bold">{item.MenuItem.name}</h2>
            <p className="text-gray-700">{item.MenuItem.description}</p>
            <p className="text-center text-gray-700 mt-1 font-medium  text-4xl">
              <span className="text-gray-500">
                {"₹"}
                {item.price}
              </span>
            </p>

          </div>
        </div>
      ))}
    </div>
  );
}
