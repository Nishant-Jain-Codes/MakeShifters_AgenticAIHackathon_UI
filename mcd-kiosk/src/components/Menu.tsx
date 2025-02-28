import { useNavigate } from "react-router-dom";
import useMenuStore from "../store/useMenuStore";
import { MenuItem } from "./../types";
import MenuItemCard from "./MenuItemCard";

export default function Menu() {
  const { currentSelectedItem, currentSelectedItemType, menuList } =
    useMenuStore();
  const navigate = useNavigate();

  // Filter menu based on selected category
  const filteredMenu: MenuItem[] = menuList.filter(
    (item: MenuItem) => item.categoryId === currentSelectedItemType
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 h-screen overflow-y-auto">
      {filteredMenu.map((item: MenuItem) => (
        <MenuItemCard
          key={item.id}
          item={item}
          isSelected={currentSelectedItem === item.id}
          onSelect={() => navigate(`/item/${item.id}`)} // ✅ Navigate to Item Details Page
        />
      ))}
    </div>
  );
}
