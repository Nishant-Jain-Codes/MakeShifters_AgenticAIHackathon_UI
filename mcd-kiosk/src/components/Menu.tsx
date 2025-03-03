// import { useNavigate } from "react-router-dom";
import useMenuStore from "../store/useMenuStore";
import { moveToNextScreen } from "../utils/functions";
import { MenuItem } from "./../types";
import MenuItemCard from "./MenuItemCard";

export default function Menu() {
  const currentSelectedItem = useMenuStore((state) => state.currentSelectedItem);
  const menuList = useMenuStore((state) => state.menuList);
  const setCurrentSelectedItem = useMenuStore((state) => state.setCurrentSelectedItem);
  const currentSelectedItemType = useMenuStore((state) => state.currentSelectedItemType);

  
  // Filter menu based on selected category
  const filteredMenu: MenuItem[] = menuList.filter(
    (item: MenuItem) => item.categoryId === currentSelectedItemType
  );

  return (
      <div className="h-[80vh] overflow-y-auto scrollbar-hidden">
    <div className="flex flex-wrap gap-3 p-1 ">
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
  );
}
