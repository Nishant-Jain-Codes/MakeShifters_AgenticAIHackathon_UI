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
  if (!flow.includes(screenName)) return; // Do nothing if screen not in flow

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
      payment: "Payment",
      orderSummary: "OrderSummary",
      OrderType: "OrderTypeSelection",
      OrderCompletion: "OrderCompletion",
    };
    moveToSpecificScreen(
      llmResponseToScreenMapping[inputScreen] || "OrderTypeSelection"
    );
    // Use inputScreen and llmResponseToScreenMapping as needed
  };
  const setCurrentlySelectedId = (id: string) => {
    const { setCurrentSelectedItemType, itemCategories ,currentLLMResponse} =
      useMenuStore.getState();
    // Iterate over the itemCategories and if the provided id exists in the itemCategories then set the currentSelectedItemType to that id
    const category = itemCategories.find((category) => category.id.toString() === id);
    if (category) {
      setCurrentSelectedItemType(parseInt(id));
    }
  };
  const setCurrentlySelectedItemId = (id: string)=>{
    const { setCurrentSelectedItem, menuList } = useMenuStore.getState();
    const menuItem = menuList.find((item) => item.id.toString() === id);
    if (menuItem) {
      setCurrentSelectedItem(parseInt(id));
    }
  }
  const setPaymentMode = (mode: string)=>{
    // const { setPaymentDetails } = useMenuStore.getState();

    // setPaymentDetails(mode);
    // TODO : take update from karan regarding this function , how is he handling the payment type seleciton and tell him to update it 
  }
  const handlers = {
    screen: setCustomScreen,
    category: setCurrentlySelectedId,
    itemId: setCurrentlySelectedItemId,
    paymentmode: setPaymentMode,
    nextScreen: moveToNextScreen,
    previousScreen: moveToPreviousScreen,
  };
  const extractParameters = (response) => {
    try {
      const jsonResponse = JSON.parse(response);
      return jsonResponse.parameters &&
        Object.keys(jsonResponse.parameters).length > 0
        ? jsonResponse.parameters
        : null;
    } catch (error) {
      return null;
    }
  };
  const handleParameters = (params, handlers) => {
    Object.entries(params).forEach(([key, value]) => {
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

  

  const extractedParams = extractParameters(JSON.stringify(response));

  if (extractedParams) {
    handleParameters(extractedParams, handlers);
  } else {
    console.log("No parameters found");
  }
};