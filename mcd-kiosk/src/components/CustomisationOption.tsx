import { useEffect, useState } from "react";
import useMenuStore from "../store/useMenuStore";
import { MenuItem } from "../types";
import customisationOptions from "../utils/mcdMenuCustomisations.json";

export default function CustomisationOption(props: { cust: MenuItem }) {
  const { menuList } = useMenuStore();
  const [customizations, setCustomizations] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (!props.cust.items) return;

    const filteredItems = props.cust.items
      .map((c) => menuList.find((item: MenuItem) => item.id === c))
      .filter(Boolean) as MenuItem[]; // Remove undefined values

    setCustomizations((prev) => {
      const uniqueItems = new Map(prev.map((item) => [item.id, item])); // Store existing items in a Map
      filteredItems.forEach((item) => uniqueItems.set(item.id, item)); // Add new items, overwriting duplicates

      return Array.from(uniqueItems.values()); // Convert Map back to array
    });
  }, [props.cust, menuList]);

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden p-6 ${customizations.length === 0 && 'hidden'}`}>
      <h3 className="text-xl font-bold text-red-600 mb-4 border-b border-gray-100 pb-2">
        Customization Options
      </h3>
      {customizations.map((item: MenuItem) => (
        <div key={item.id} className="flex items-center gap-3 mt-4">
          <img src={item.imageUrl} alt="" className="w-40 h-40" />
          <div>
            {item.name}
            <p className="text-gray-500">₹{item.price}</p>
          </div>
        </div>
      ))}

      {/*     
      {customisationOptions.map((option) => (
        <div key={option.id} className="flex items-center gap-3 mt-4">
          <img src={option.imageUrl} alt="" className="w-40 h-40" />
          <div>
            {option.name}
            <p className="text-gray-500">₹{option.extraPrice}</p>
          </div>
        </div>
      ))} */}
    </div>
  );
}
