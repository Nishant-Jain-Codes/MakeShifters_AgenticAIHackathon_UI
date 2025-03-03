import useMenuStore from "../store/useMenuStore";
import { moveToNextScreen } from "../utils/functions";
import { MenuItem } from "../types";
import MenuItemCard from "../components/MenuItemCard";

export default function McBuddyItems({ itemIds }: { itemIds: number[] }) {
  const currentSelectedItem = useMenuStore(
    (state) => state.currentSelectedItem
  );
  const menuList = useMenuStore((state) => state.menuList);
  const setCurrentSelectedItem = useMenuStore(
    (state) => state.setCurrentSelectedItem
  );

  // Filter menu based on provided item IDs
  const filteredMenu: MenuItem[] = menuList.filter((item: MenuItem) =>
    itemIds.includes(item.id)
  );

  return (
    <div className="h-[80vh] overflow-y-auto scrollbar-hidden">
      <div className="flex flex-wrap gap-3 p-1">
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
