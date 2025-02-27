import useMenuStore  from '../store/useMenuStore';
import MenuItemCategory from './MenuItemCategory';

export default function CategoryList() {
  const { itemTypeList } = useMenuStore();

  return (
    <div className="flex flex-col gap-4 p-4">
      {itemTypeList?.map((item) => (
        <MenuItemCategory key={item.id} {...item} />
      ))}
    </div>
  );
}
