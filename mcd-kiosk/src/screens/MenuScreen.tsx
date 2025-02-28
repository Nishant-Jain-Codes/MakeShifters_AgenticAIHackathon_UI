import CategoryList from "../components/CategoryList";
import Menu from "../components/Menu";

export default function MenuScreen() {
  // const setCategory = useKioskStore((state) => state.setCategory);

  
  return (
    <div className="flex">
      <div className="w-1/5">
        <CategoryList />
      </div>
      <div className="w-4/5" >
        <Menu />
      </div>
    </div>
  );
}
