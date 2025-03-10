// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import McBuddyItems from "../screens/McBuddyItems";
import useMenuStore from "../store/useMenuStore";
import { moveToNextScreen } from "../utils/functions";
import { MenuItem } from "./../types";
import MenuItemCard from "./MenuItemCard";
import Shimmer from "./Shimmer";

export default function Menu() {
  const currentSelectedItem = useMenuStore((state) => state.currentSelectedItem);
  const menuList = useMenuStore((state) => state.menuList);
  const setCurrentSelectedItem = useMenuStore((state) => state.setCurrentSelectedItem);
  const currentSelectedItemType = useMenuStore((state) => state.currentSelectedItemType);
  const llmRecommendedItems = useMenuStore((state) => state.llmRecommendedItems);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const interval = setInterval(() => {
        setLoading(false);
        clearInterval(interval);
    }, 700);

    return () => clearInterval(interval);
}, []);
  // Filter menu based on selected category
  const filteredMenu: MenuItem[] = menuList.filter(
    (item: MenuItem) => item.categoryId === currentSelectedItemType
  );

  return (
    <div>{loading?<Shimmer/> :(
      <div className="h-[80vh] overflow-y-auto scrollbar-hidden">
    <div className="flex flex-wrap gap-3 p-1 ">

      {currentSelectedItemType == 0 && (
        <McBuddyItems itemIds ={llmRecommendedItems}/>
      ) }
      {filteredMenu.map((item: MenuItem) => (
          <MenuItemCard
            key={item.id}
            item={item}
            isSelected={currentSelectedItem === item.id}
            onSelect={() => {
              setCurrentSelectedItem(item.id);
              moveToNextScreen();
            }}
          />
        ))}
        </div>
    </div>
    )}
    </div>
  )
}
