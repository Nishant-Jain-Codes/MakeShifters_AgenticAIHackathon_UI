/* eslint-disable @typescript-eslint/no-explicit-any */
import categoryData from "./mcdCategoryList.json";
import menuData from "./mcdMenu.json";
import mealData from "./mcdMeals.json";
import customizationData from "./mcdMenuCustomisations.json";
import useMenuStore from "../store/useMenuStore";
import {
  CustomizationOption,
  ItemCategory,
  MealItem,
  MenuItem,
} from "../types"; // Assuming you have defined types separately

export const loadMenuData = async () => {
  const {
    setMenu,
    setMealItems,
    setItemCategories,
    setCustomizationOptions,
    setIsLoading,
  } = useMenuStore.getState();

  try {
    setIsLoading(true);

    // Map categories
    const categories: ItemCategory[] = categoryData.map(
      (category: Record<string, any>) => ({
        id: category["id"],
        imageUrl: category["imageUrl"],
        name: category["name"],
      })
    );

    // Map menu items
    const menuList: MenuItem[] = menuData.map((item: Record<string, any>) => ({
      id: item["id"],
      price: item["price"],
      isVeg: item["isVeg"],
      categoryId: item["categoryId"],
      name: item["name"],
      description: item["description"],
      imageUrl: item["imageUrl"],
      is_customisable: item["is_customisable"],
      items: item["items"],
    }));

    // Map meal items
    const mealList: MealItem[] = mealData.map((item: Record<string, any>) => ({
      id: item["id"],
      price: item["price"],
      isVeg: item["isVeg"],
      items: item["items"],
      imageUrl: item["imageUrl"],
      description: item["description"],
      name: item["name"],
      categoryId: item["categoryId"],
    }));

    // Map customization options
    const customizationOptions: CustomizationOption[] = customizationData.map(
      (option: Record<string, any>) => ({
        id: option["id"],
        extraPrice: option["extraPrice"],
        isVeg: option["isVeg"],
        categoryId: option["categoryId"],
        imageUrl: option["imageUrl"],
        name: option["name"],
      })
    );

    // Update global store states
    // Update global store states
    setItemCategories(categories);
    setMenu(menuList);
    setMealItems(mealList);
    setCustomizationOptions(customizationOptions);
    setMealItems(mealList);
    setCustomizationOptions(customizationOptions);
  } catch (error) {
    console.error("Error loading menu data:", error);
  } finally {
    setIsLoading(false);
  }
};

const flow = [
  "OrderTypeSelection",
  "Menu",
  "ItemView",
  "OrderSummary",
  "Payment",
  "OrderCompletion",
];

export const moveToNextScreen = () => {
  const { currentScreen, setCurrentScreen, screenStack, setScreenStack } =
    useMenuStore.getState();
  const currentIndex = flow.indexOf(currentScreen);

  if (currentIndex === -1 || currentIndex === flow.length - 1) return; // Do nothing if at the last screen

  const nextScreen = flow[currentIndex + 1];

  setScreenStack([...screenStack, currentScreen]); // Push current screen to stack
  setCurrentScreen(nextScreen);
};

export const moveToPreviousScreen = () => {
  const { screenStack, setCurrentScreen, setScreenStack } =
    useMenuStore.getState();

  if (screenStack.length === 0) setCurrentScreen("OrderTypeSelection"); // No previous screen to go back to

  const previousScreen = screenStack[screenStack.length - 1]; // Get last screen
  setScreenStack(screenStack.slice(0, -1)); // Remove last screen from stack
  setCurrentScreen(previousScreen);
};

export const moveToSpecificScreen = (screenName: string) => {
  const { setCurrentScreen, screenStack, setScreenStack, currentScreen } =
    useMenuStore.getState();
  // if (!flow.includes(screenName)) return; // Do nothing if screen not in flow

  setScreenStack([...screenStack, currentScreen]); // Store previous screen before moving
  setCurrentScreen(screenName);
};

export const handleLLMTriggeredActions = () => {
  debugger;
  const { currentUserTranscription, currentLLMResponse } =
    useMenuStore.getState();
  const response = currentLLMResponse;

  //we can use this message to implement some front end logic
  const message = response?.message;
  const setCustomScreen = (screen: string) => {
    const inputScreen = screen.toLowerCase();
    const llmResponseToScreenMapping: Record<string, string> = {
      menu: "Menu",
      paymentselection: "Payment",
      orderSummary: "OrderSummary",
      ordertype: "OrderTypeSelection",
      ordercompletion: "OrderCompletion",
      ordersummary: "OrderSummary",
    };
    moveToSpecificScreen(
      llmResponseToScreenMapping[inputScreen] || "OrderTypeSelection"
    );
    // Use inputScreen and llmResponseToScreenMapping as needed
  };
  const setCurrentlySelectedId = (categoryName: string) => {
    const { setCurrentSelectedItemType, itemCategories } =
      useMenuStore.getState();

    // Find the category whose name includes the given categoryName (case-insensitive)
    const category = itemCategories.find((category) =>
      category.name.toLowerCase().includes(categoryName.toLowerCase())
    );

    // If a matching category is found, set the selected item type to its ID
    if (category) {
      setCurrentSelectedItemType(category.id);
    }
  };
  const setCurrentlySelectedItemId = (id: string) => {
    const { setCurrentSelectedItem, menuList } = useMenuStore.getState();
    const menuItem = menuList.find((item) => item.id.toString() === id);
    if (menuItem) {
      setCurrentSelectedItem(parseInt(id));
    }
  };
  const setCurrentlySelectedItemIdByName = (itemName: string) => {
    const { setCurrentSelectedItem, menuList } = useMenuStore.getState();

    // Find the menu item whose name includes the provided itemName (case-insensitive)
    const menuItem = menuList.find((item) =>
      item.name.toLowerCase().includes(itemName.toLowerCase())
    );

    // If a matching item is found, set the selected item ID
    if (menuItem) {
      setCurrentSelectedItem(menuItem.id);
    }
  };

  //TODO karan handle this 
  const setPaymentMode = (mode: string) => {
    // const { setPaymentDetails } = useMenuStore.getState();
    // setPaymentDetails(mode);
    // TODO : take update from karan regarding this function , how is he handling the payment type seleciton and tell him to update it
  };
  const setTheOrderType = (orderType: string) => {
    const { setOrderType } = useMenuStore.getState();
    const value = orderType.toLowerCase().includes("dine")
      ? "dine in"
      : orderType.toLowerCase().includes("away")
      ? "take away"
      : null;
    if (value) setOrderType(value);
  };
  //TODO : karan check this also , is this correct i am looping over the quantity and adding the items to the cart
  const updateTheCartByAddingSelectedItemsByQuantity = (quantity: string) => {
    const { currentSelectedItem, addItemToBasket, menuList } =
      useMenuStore.getState();

    // Find the selected menu item
    const menuItem = menuList.find((item) => item.id === currentSelectedItem);
    if (!menuItem) return;

    // Convert quantity to a number
    const newQuantity = parseInt(quantity, 10);
    if (isNaN(newQuantity) || newQuantity <= 0) return; // Ensure valid quantity

    // Call the function to add the item to the basket
    for (let i = 0; i < newQuantity; i++) {
      addItemToBasket(menuItem.id);
    }
  };

  const setTheCostFilterType = (under: boolean) => {
    const { menuList, setllmRecommendedItems, setCurrentSelectedItemType } =
      useMenuStore.getState();

    // Filter items based on price condition (assuming under means under a certain threshold)
    const threshold = 100; // Adjust this if needed
    const filteredItems = menuList.filter((item) =>
      under ? item.price < threshold : item.price >= threshold
    );

    // Extract item IDs
    const itemIds = filteredItems.map((item) => item.id);

    // Update recommendations if items exist
    if (itemIds.length > 0) {
      setllmRecommendedItems(itemIds);
      setCurrentSelectedItemType(0);
    }
  };

  const setTheCostFilterValue = (priceRange: number) => {
    const { menuList, setllmRecommendedItems, setCurrentSelectedItemType } =
      useMenuStore.getState();

    // Filter items within the given price range
    const filteredItems = menuList.filter((item) => item.price <= priceRange);

    // Extract item IDs
    const itemIds = filteredItems.map((item) => item.id);

    // Update recommendations if items exist
    if (itemIds.length > 0) {
      setllmRecommendedItems(itemIds);
      setCurrentSelectedItemType(0);
    }
  };

  const setTheItemFilterType = (itemType: "veg" | "nonVeg" | "all") => {
    const { menuList, setllmRecommendedItems, setCurrentSelectedItemType } =
      useMenuStore.getState();

    // Filter based on item type
    const filteredItems = menuList.filter((item) => {
      if (itemType === "veg") return item.isVeg;
      if (itemType === "nonVeg") return !item.isVeg;
      return true; // "all" returns everything
    });

    // Extract item IDs
    const itemIds = filteredItems.map((item) => item.id);

    // Update recommendations if items exist
    if (itemIds.length > 0) {
      setllmRecommendedItems(itemIds);
      setCurrentSelectedItemType(0);
    }
  };
  const handleLLMTriggeredMove = (move: string) => {
    if(move==="next"){
      moveToNextScreen();
    }
    else if(move==="previous"){
      moveToPreviousScreen();
    }
  }
  const handlers = {
    screen: setCustomScreen,
    category: setCurrentlySelectedId,
    menuType: setCurrentlySelectedId,
    itemId: setCurrentlySelectedItemId,
    paymentmode: setPaymentMode,
    nextScreen: moveToNextScreen,
    previousScreen: moveToPreviousScreen,
    orderType: setTheOrderType,
    itemName: setCurrentlySelectedItemIdByName,
    quantity: updateTheCartByAddingSelectedItemsByQuantity,
    under: setTheCostFilterType,
    priceRange: setTheCostFilterValue,
    itemType: setTheItemFilterType,
    move: handleLLMTriggeredMove,
  };
  const extractParameters = (response) => {
    try {
      return response?.parameters &&
        Object.keys(response?.parameters)?.length > 0
        ? response?.parameters
        : null;
    } catch (error) {
      return null;
    }
  };
  const handleParameters = (params, handlers) => {
    const order = ["itemId", "itemName", "quantity"]; // Define desired order

    // Sort entries based on predefined order, unknown keys come last alphabetically
    const sortedEntries = Object.entries(params).sort(([keyA], [keyB]) => {
      const indexA = order.indexOf(keyA);
      const indexB = order.indexOf(keyB);

      if (indexA === -1 && indexB === -1) {
        return keyA.localeCompare(keyB); // Sort unknown keys alphabetically
      }
      if (indexA === -1) return 1; // Unknown keys go last
      if (indexB === -1) return -1; // Known keys come first

      return indexA - indexB; // Sort known keys based on predefined order
    });
    sortedEntries.forEach(([key, value]) => {
      if (
        handlers[key] &&
        typeof handlers[key] === "function" &&
        handlers[key].length > 0
      ) {
        handlers[key](value);
      }
    });
  };

  console.log("currentUserTranscription", currentUserTranscription);
  console.log("currentLLMResponse", currentLLMResponse);

  const extractedParams = extractParameters(response);

  if (extractedParams) {
    handleParameters(extractedParams, handlers);
  } else {
    console.log("No parameters found");
  }
};
