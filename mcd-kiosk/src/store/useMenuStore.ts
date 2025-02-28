/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { ItemCategory ,MenuItem } from "../types";
interface BasketItem {
  id: number;
  customizations?: string[];
  MenuItem: MenuItem;
  qty: number;
  price: number;
}
type OrderType = "dine in" | "take away";
export interface MenuStoreState {
  menuList: MenuItem[] | [];
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
  language: string;
  menu: string[];

  // Actions
  setMenu: (menu: MenuItem[]) => void;
  setItemCategories: (itemCategories: ItemCategory[]) => void;
  setIsLoading: (loaded: boolean) => void;
  setOrderId: (id: string) => void;
  setOrderType: (type:OrderType) => void;
  setPaymentDetails: (details: string) => void;
  addItemToBasket: (itemId: number, customizations?: string[]) => void;
  removeItemFromBasket: (itemId: number, customizations?: string[]) => void;
  setCurrentSelectedItemType: (type: number) => void;
  setCurrentSelectedItemSubType: (subType: number) => void;
  setCurrentSelectedItem: (itemId: number) => void;
  setCurrentScreen: (screen: string) => void;
  setLanguage: (language: string) => void;
  confirmOrder: () => void;
  resetOrder: () => void;
}

const useMenuStore = create<MenuStoreState>((set) => ({
  menuList: [],
  itemCategories: [],
  isLoading: false,
  orderId: null,
  orderType: null,
  paymentDetails: null,
  basket: [],
  currentSelectedItemType: null,
  currentSelectedItemSubType: null,
  currentSelectedItem: null,
  currentScreen: "home",
  language: "English",
  menu: [],

  // Actions
  setMenu: (menu) => set({ menuList: menu }),
  setItemCategories: (itemCategories) => set({ itemCategories }),
  setIsLoading: (loaded) => set({ isLoading: loaded }),
  setOrderId: (id) => set({ orderId: id }),
  setOrderType: (type) => set({ orderType: type }),
  setPaymentDetails: (details) => set({ paymentDetails: details }),

  addItemToBasket: (itemId: number, customizations?: string[]) =>
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
      if (state.basket.some(item => item.id === itemId && JSON.stringify(item.customizations) === JSON.stringify(customizations))) {
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
            price: menuItem.price.discountPrice,
          } as BasketItem,
        ],
      };
    }),
  
  

    removeItemFromBasket: (itemId, customizations) =>
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
  setLanguage: (language) => set({ language }),

  confirmOrder: () => console.log("Order confirmed!", useMenuStore.getState()),

  resetOrder: () =>
    set({
      orderId: null,
      orderType: null,
      paymentDetails: null,
      basket: [],
      currentSelectedItemType: null,
      currentSelectedItemSubType: null,
      currentSelectedItem: null,
      currentScreen: "home",
    }),
}));
export default useMenuStore;
