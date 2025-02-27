import MenuItem from "../components/MenuItem";

export default function MenuScreen() {
  // const setCategory = useKioskStore((state) => state.setCategory);

  const menuItems = [
    {
      id: 1,
      name: "Big Mac",
      price: "RM 0.00",
      imgSrc: "/assets/big-mac.jpeg",
    },
    {
      id: 2,
      name: "McChicken®",
      price: "RM 0.00",
      imgSrc: "/assets/mcchicken.jpeg",
    },
    {
      id: 3,
      name: "Filet-O-Fish™",
      price: "RM 0.00",
      imgSrc: "/assets/filet-o-fish.jpeg",
    },
    {
      id: 4,
      name: "Cheeseburger",
      price: "RM 0.00",
      imgSrc: "/assets/cheeseburger.jpeg",
    },
    {
      id: 5,
      name: "Porridge",
      price: "RM 0.00",
      imgSrc: "/assets/porridge.jpeg",
    },
    {
      id: 6,
      name: "BBQ Burger",
      price: "RM 0.00",
      imgSrc: "/assets/bbq-burger.jpeg",
    },
  ];

  return (
    <div>
      <h1>Menu</h1>
      <div className="flex flex-wrap gap-20 w-500 h-200">

      {menuItems.map((item, index) => (
        <div className="flex">
          <MenuItem {...item} key={index} />
        </div>
      ))}
      </div>

    </div>
  );
}
