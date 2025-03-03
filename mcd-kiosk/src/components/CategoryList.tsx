import useMenuStore from '../store/useMenuStore';
import MenuItemCategory from './MenuItemCategory';

export default function CategoryList() {
  const itemCategories = useMenuStore((state) => state.itemCategories);


  return (
    <div className="flex flex-col gap-3 p-1 h-[80vh] overflow-y-auto scrollbar-hidden">
      {itemCategories?.map((item) => (
        <MenuItemCategory key={item.id} {...item} />
      ))}
    </div>
  );
}
