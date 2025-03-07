import { useEffect, useState } from 'react';
import useMenuStore from '../store/useMenuStore';
import MenuItemCategory from './MenuItemCategory';
import Shimmer from './Shimmer';

export default function CategoryList() {
  const itemCategories = useMenuStore((state) => state.itemCategories);
  const llmRecommendedItems = useMenuStore((state) => state.llmRecommendedItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

      const interval = setInterval(() => {
          setLoading(false);
          clearInterval(interval);
      }, 700);

      return () => clearInterval(interval);
  }, []);

  
const filteredCategories = llmRecommendedItems?.length ?? 0 > 0 
? itemCategories 
: itemCategories.filter((item) => item.id !== 0);

  return (
   <div>
    {loading ? <Shimmer /> : (
    <div className="flex flex-col gap-3 p-1 h-[80vh] overflow-y-auto scrollbar-hidden">
    {filteredCategories?.map((item) => (
      <MenuItemCategory key={item.id} {...item} />
    ))}
  </div>
    )}
    </div>
  );
}
