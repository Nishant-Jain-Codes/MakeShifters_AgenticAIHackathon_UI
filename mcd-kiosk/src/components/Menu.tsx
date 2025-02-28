// import { useNavigate } from "react-router-dom";
import useMenuStore from "../store/useMenuStore";
import { moveToNextScreen } from "../utils/functions";
import { MenuItem } from "./../types";
import MenuItemCard from "./MenuItemCard";

export default function Menu() {
  const { currentSelectedItem, currentSelectedItemType, menuList, setCurrentSelectedItem } =
    useMenuStore();
  // const navigate = useNavigate();

  // Filter menu based on selected category
  const filteredMenu: MenuItem[] = menuList.filter(
    (item: MenuItem) => item.categoryId === currentSelectedItemType
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-y-auto">
      {filteredMenu.map((item: MenuItem) => (
        <MenuItemCard
          key={item.id}
          item={item}
          isSelected={currentSelectedItem === item.id}
          onSelect={()=>{
            setCurrentSelectedItem(item.id);
            moveToNextScreen();
          }}
        />
      ))}
    </div>
  );
}
