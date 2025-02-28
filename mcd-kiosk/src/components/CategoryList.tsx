import useMenuStore from '../store/useMenuStore';
import MenuItemCategory from './MenuItemCategory';

export default function CategoryList() {
  const { itemCategories } = useMenuStore();

  return (
    <div className="flex flex-col gap-4 p-4 h-screen overflow-y-auto">
      {itemCategories?.map((item) => (
        <MenuItemCategory key={item.id} {...item} />
      ))}
    </div>
  );
}
