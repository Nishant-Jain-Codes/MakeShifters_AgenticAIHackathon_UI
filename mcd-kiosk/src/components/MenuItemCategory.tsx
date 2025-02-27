import { motion } from 'framer-motion';
import  useMenuStore  from '../store/useMenuStore';

interface DataObject {
  id: string;
  label: string;
  imgSrc: string;
}

export default function MenuItemCategory({ id, label, imgSrc }: DataObject) {
  const { currentSelectedItemType, setCurrentSelectedItemType } = useMenuStore();

  const isSelected = currentSelectedItemType === id;

  return (
    <motion.div
      onClick={() => setCurrentSelectedItemType(id)}
      className={`p-4 rounded-xl cursor-pointer transition-all ${
        isSelected ? 'bg-primaryYellow text-primaryBlack shadow-lg' : 'bg-white text-black'
      }`}
      animate={isSelected ? { scale: 1.1, y: [-2, 2, -2] } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <img src={imgSrc} alt={label} className="w-16 h-16 object-contain mx-auto" />
      <p className="mt-2 text-center font-semibold">{label}</p>
    </motion.div>
  );
}
