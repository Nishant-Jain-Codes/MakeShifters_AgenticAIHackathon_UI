import React from 'react';
import useMenuStore from '../store/useMenuStore';
import MenuItemCard from './MenuItemCard';
// type MenuItemProps = {
//   name: string;
//   price: string;
//   imgSrc: string;
// };

const MenuItem = () => {

  const {menuList} = useMenuStore();
  return (
    <div className="border rounded-xl shadow-md p-4 flex flex-col items-center bg-white">
      abcd
      {/* {menuList.map((item) => (
        <MenuItemCard item={item} />
      ))} */}
    </div>
  );
};


export default MenuItem;
