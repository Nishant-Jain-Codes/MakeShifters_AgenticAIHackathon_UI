import { motion } from 'framer-motion';
import useMenuStore from '../store/useMenuStore';
import clsx from 'clsx';

interface ItemCategory {
  id: number;
  imageUrl: string;
  name: string;
}

export default function MenuItemCategory({ id, imageUrl, name }: ItemCategory) {
  const currentSelectedItemType = useMenuStore((state) => state.currentSelectedItemType);
  const setCurrentSelectedItemType = useMenuStore((state) => state.setCurrentSelectedItemType);

  const isSelected = currentSelectedItemType === id;

  // Replace {format} with "png" and {size} with "512x512"
  const imgSrc = imageUrl.replace('{format}', 'png').replace('{size}', '128');

  return (
    <motion.div
      onClick={() => setCurrentSelectedItemType(id)}
      className={clsx(
        'px-1 py-2 w-[98px] rounded-xl cursor-pointer transition-all shadow-lg border border-gray-200',
        isSelected
          ? 'bg-primaryYellow text-primaryBlack shadow-lg scale-107'
          : 'bg-white text-black hover:shadow-lg hover:scale-105'
      )}
      animate={isSelected ? { scale: 1.1, y: [-2, 2, -2] } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <img src={imgSrc} alt={name} className="w-12 h-12 object-contain mx-auto" />
      <p className="mt-1 text-center text-xs font-semibold">{name.length > 15 ? name.substring(0, 15) + '...' : name.substring(0, 15)}</p>
    </motion.div>
  );
}
