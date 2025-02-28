import { motion } from 'framer-motion';
import clsx from 'clsx';
import { MenuItem } from './../types';

interface MenuItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onSelect: () => void;
}

export default function MenuItemCard({ item, isSelected, onSelect }: MenuItemCardProps) {
  const imgSrc = item.imageUrl.replace('{format}', 'png').replace('{size}', '128');

  return (
    <motion.div
      onClick={onSelect}
      className={clsx(
        'p-4 rounded-xl cursor-pointer transition-all shadow-md',
        isSelected
          ? 'bg-primaryYellow text-primaryBlack shadow-lg scale-110'
          : 'bg-white text-black hover:shadow-lg hover:scale-105'
      )}
      animate={isSelected ? { scale: 1.1, y: [-2, 2, -2] } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <img src={imgSrc} alt={item.name} className="w-16 h-16 object-contain mx-auto" />
      <p className="mt-2 text-center font-semibold">{item.name}</p>
    </motion.div>
  );
}
