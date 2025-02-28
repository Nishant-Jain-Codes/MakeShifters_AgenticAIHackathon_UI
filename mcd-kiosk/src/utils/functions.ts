/* eslint-disable @typescript-eslint/no-explicit-any */
import categoryData from "./mcdCategoryList.json";
import menuData from "./mcdMenu.json";
import  useMenuStore  from "../store/useMenuStore";
import { ItemCategory, MenuItem } from "../types"; // Assuming you have defined types separately

export const loadMenuData = async () => {
  const { setMenu, setItemCategories, setIsLoading } = useMenuStore.getState();

  try {
    // Map category data
    setIsLoading(true);
    const categories: ItemCategory[] = categoryData.map(
      (category: Record<string, any>) => ({
        id: category["id"],
        imageUrl: category["image"],
        name: category["name"],
      })
    );

    // Map menu data
    const menuList: MenuItem[] = menuData.map((item: Record<string, any>) => ({
      price: {
        id: item["item_price"]?.["id"] ?? 0,
        discountPrice: item["item_price"]?.["discount_price"] ?? "0",
        price: item["item_price"]?.["price"] ?? "0",
        cgst: item["item_price"]?.["cgst"] ?? "0",
        sgst: item["item_price"]?.["sgst"] ?? "0",
        cgstPer: item["item_price"]?.["cgst_per"] ?? "0",
        sgstPer: item["item_price"]?.["sgst_per"] ?? "0",
        currency: item["item_price"]?.["currency"] ?? "INR",
        currencySymbol: item["item_price"]?.["currency_symbol"] ?? "₹",
        offerPrice: item["item_price"]?.["offer_price"] ?? "0",
        offerCgst: item["item_price"]?.["offer_cgst"] ?? "0",
        offerSgst: item["item_price"]?.["offer_sgst"] ?? "0",
      },
      isVeg: item["is_veg"] ?? false,
      categoryId: item["category_id"] ?? 0,
      name: item["item_name"] ?? "Unknown Item",
      description: item["description"] ?? "No description available",
      imageUrl: item["image"] ?? "",
      isCustomizable: item["is_customizable"] ?? false,
      id: item["item_id"]
    }));

    // Update store
    setItemCategories(categories);
    setMenu(menuList);
  } catch (error) {
    console.error("Error loading menu data:", error);
  }finally{
    setIsLoading(false);
  }
};
