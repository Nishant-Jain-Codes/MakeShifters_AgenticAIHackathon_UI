import CategoryList from "../components/CategoryList";
import Menu from "../components/Menu";

export default function MenuScreen() {
  // const setCategory = useKioskStore((state) => state.setCategory);

  return (
    <div className="flex w-full ">
      <div className="w-1/4 overflow-y-auto">
        <CategoryList />
      </div>
      <div className="w-4/5 overflow-y-auto">
        <Menu />
      </div>
    </div>
  );
}
