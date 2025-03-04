import useMenuStore from '../store/useMenuStore';
import MenuItemCategory from './MenuItemCategory';

export default function CategoryList() {
  const itemCategories = useMenuStore((state) => state.itemCategories);
  const llmRecommendedItems = useMenuStore((state) => state.llmRecommendedItems);

  
const filteredCategories = llmRecommendedItems?.length ?? 0 > 0 
? itemCategories 
: itemCategories.filter((item) => item.id !== 0);

  return (
    <div className="flex flex-col gap-3 p-1 h-[80vh] overflow-y-auto scrollbar-hidden">
    {filteredCategories?.map((item) => (
      <MenuItemCategory key={item.id} {...item} />
    ))}
  </div>
  );
}
