import CategoryList from "../components/CategoryList";
import Menu from "../components/Menu";

export default function MenuScreen() {
    // const setCategory = useKioskStore((state) => state.setCategory);
    return (
      <div>
        <Menu/>
        <CategoryList/>
        {/* <button onClick={() => setCategory('sweets')}>Sweets</button> */}
        {/* <button onClick={() => setCategory('drinks')}>Drinks</button> */}
      </div>
    );
  }