import { motion } from 'framer-motion';
import useMenuStore from '../store/useMenuStore';
import clsx from 'clsx';

interface ItemCategory {
  id: number;
  imageUrl: string;
  name: string;
}

export default function MenuItemCategory({ id, imageUrl, name }: ItemCategory) {
  const { currentSelectedItemType, setCurrentSelectedItemType } = useMenuStore();

  const isSelected = currentSelectedItemType === id;

  // Replace {format} with "png" and {size} with "512x512"
  const imgSrc = imageUrl.replace('{format}', 'png').replace('{size}', '128');

  return (
    <motion.div
      onClick={() => setCurrentSelectedItemType(id)}
      className={clsx(
        'p-4 rounded-xl cursor-pointer transition-all shadow-md',
        isSelected
          ? 'bg-primaryYellow text-primaryBlack shadow-lg scale-110'
          : 'bg-white text-black hover:shadow-lg hover:scale-105'
      )}
      animate={isSelected ? { scale: 1.1, y: [-2, 2, -2] } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <img src={imgSrc} alt={name} className="w-16 h-16 object-contain mx-auto" />
      <p className="mt-2 text-center font-semibold">{name}</p>
    </motion.div>
  );
}
