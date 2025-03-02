/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  CustomizationOption,
  ItemCategory,
  MealItem,
  MenuItem,
} from "../types";
export interface BasketItem {
  id: number;
  customizations?: string[];
  MenuItem: MenuItem;
  qty: number;
  price: number;
}
type OrderType = "dine in" | "take away";
type CustomerAgeClass = "child" | "adult" | "senior";
export interface MenuStoreState {
  menuList: MenuItem[] | [];
  mealList: MealItem[] | []; // ✅ Added meal items list
  customizationOptions: CustomizationOption[] | []; // ✅ Added customization options
  itemCategories: ItemCategory[] | [];
  isLoading: boolean;
  orderId: string | null;
  orderType: OrderType | null;
  paymentDetails: string | null;
  basket: BasketItem[];
  currentSelectedItemType: number | null;
  currentSelectedItemSubType: number | null;
  currentSelectedItem: number | null;
  currentScreen: string;
  screenStack: string[];
  language: string;
  menu: string[];
  customerAgeClass: CustomerAgeClass | null;
  orderStarted : boolean;

  // Actions
  setMenu: (menu: MenuItem[]) => void;
  setMealItems: (meals: MealItem[]) => void; // ✅ New action for meal items
  setCustomizationOptions: (options: CustomizationOption[]) => void; // ✅ New action for customization options
  setItemCategories: (itemCategories: ItemCategory[]) => void;
  setIsLoading: (loaded: boolean) => void;
  setOrderId: (id: string) => void;
  setOrderType: (type: OrderType) => void;
  setPaymentDetails: (details: string) => void;
  addItemToBasket: (itemId: number, customizations?: string[]) => void;
  removeItemFromBasket: (itemId: number, customizations?: string[]) => void;
  setCurrentSelectedItemType: (type: number) => void;
  setCurrentSelectedItemSubType: (subType: number) => void;
  setCurrentSelectedItem: (itemId: number) => void;
  setCurrentScreen: (screen: string) => void;
  setScreenStack: (stack: string[]) => void;
  setLanguage: (language: string) => void;
  confirmOrder: () => void;
  resetOrder: () => void;
  setCustomerAgeClass: (ageClass: CustomerAgeClass) => void;
  setOrderStarted: (value: boolean) => void;
}
const useMenuStore = create<MenuStoreState>((set) => ({
  menuList: [],
  mealList: [], // ✅ Added meal items list
  customizationOptions: [], // ✅ Added customization options list
  itemCategories: [],
  isLoading: false,
  orderId: null,
  orderType: null,
  paymentDetails: null,
  basket: [],
  currentSelectedItemType: 7,
  currentSelectedItemSubType: null,
  currentSelectedItem: null,
  currentScreen: "OrderTypeSelection",
  screenStack: [],
  language: "English",
  menu: [],
  customerAgeClass: null,
  orderStarted : false,

  // ✅ Setters for newly added state
  setMenu: (menu: MenuItem[]) => set({ menuList: menu }),
  setMealItems: (meals: MealItem[]) => set({ mealList: meals }), // ✅ New setter for meal items
  setCustomizationOptions: (options: CustomizationOption[]) =>
    set({ customizationOptions: options }), // ✅ New setter for customization options
  setItemCategories: (itemCategories: ItemCategory[]) =>
    set({ itemCategories }),
  setIsLoading: (loaded: boolean) => set({ isLoading: loaded }),
  setOrderId: (id: string) => set({ orderId: id }),
  setOrderType: (type) => set({ orderType: type }),
  setPaymentDetails: (details: string) => set({ paymentDetails: details }),
  setCustomerAgeClass: (ageClass) => set({ customerAgeClass: ageClass }),
  addItemToBasket: (itemId: number, customizations: string[] = []) =>
    set((state) => {
      const menuItem = state.menuList.find((item) => item.id === itemId);
      if (!menuItem) return {}; // ✅ Don't modify state if menuItem is not found

      const updatedBasket = state.basket.map((item) => {
        if (
          item.id === itemId &&
          JSON.stringify(item.customizations) === JSON.stringify(customizations)
        ) {
          return { ...item, qty: item.qty + 1 }; // ✅ Increase quantity only
        }
        return item;
      });

      // If the item exists, return the updated basket
      if (
        state.basket.some(
          (item) =>
            item.id === itemId &&
            JSON.stringify(item.customizations) ===
              JSON.stringify(customizations)
        )
      ) {
        return { basket: updatedBasket };
      }

      // ✅ If item does not exist, add it once
      return {
        basket: [
          ...state.basket,
          {
            id: itemId,
            customizations,
            MenuItem: menuItem,
            qty: 1,
            price: menuItem.price,
          } as BasketItem,
        ],
      };
    }),

  removeItemFromBasket: (itemId: number, customizations: string[] = []) =>
    set((state) => {
      const existingItemIndex = state.basket.findIndex(
        (item) =>
          item.id === itemId &&
          JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );

      if (existingItemIndex === -1) return state; // If item not found, return unchanged state

      const updatedBasket = [...state.basket];

      if (updatedBasket[existingItemIndex].qty > 1) {
        updatedBasket[existingItemIndex].qty -= 1; // Reduce quantity by 1
      } else {
        updatedBasket.splice(existingItemIndex, 1); // Remove item if qty is 1
      }

      return { basket: updatedBasket };
    }),

  setCurrentSelectedItemType: (type) => set({ currentSelectedItemType: type }),
  setCurrentSelectedItemSubType: (subType) =>
    set({ currentSelectedItemSubType: subType }),
  setCurrentSelectedItem: (itemId) => set({ currentSelectedItem: itemId }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  setScreenStack: (stack) => set({ screenStack: stack }),
  setLanguage: (language) => set({ language }),
  setOrderStarted: (value) => set({ orderStarted: value }),

  confirmOrder: () =>
    console.log("✅ Order confirmed!", useMenuStore.getState()),

  resetOrder: () =>
    set({
      orderId: null,
      orderType: null,
      paymentDetails: null,
      basket: [],
      currentSelectedItemType: null,
      currentSelectedItemSubType: null,
      currentSelectedItem: null,
      currentScreen: "OrderTypeSelection",
    }),
}));
export default useMenuStore;
