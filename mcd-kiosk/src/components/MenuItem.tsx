type MenuItemProps = {
  name: string;
  price: string;
  imgSrc: string;
};

const MenuItem: React.FC<MenuItemProps> = ({ name, price, imgSrc }) => {
  return (
    <div className="border rounded-xl shadow-md p-4 flex flex-col items-center bg-white">
      <img src={imgSrc} alt={name} className="w-24 h-24 object-cover mb-2 rounded-lg" />
      <span className="text-lg font-semibold">{name}</span>
      <span className="text-gray-600">{price}</span>
    </div>
  );
};

export default MenuItem;
