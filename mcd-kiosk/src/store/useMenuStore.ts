import { create } from "zustand";

interface BasketItem {
  id: string;
  customizations?: string[];
}

interface MenuStoreState {
  menuList: any[] | null;
  menuLoaded: boolean;
  orderId: string | null;
  orderType: "dine in" | "take away" | null;
  paymentDetails: string | null;
  basket: BasketItem[];
  currentSelectedItemType: string | null;
  currentSelectedItemSubType: string | null;
  currentSelectedItem: string | null;
  currentScreen: string;
  language: string;
  menu: string[];

  // Actions
  setMenu: (menu: any[]) => void;
  setMenuLoaded: (loaded: boolean) => void;
  setOrderId: (id: string) => void;
  setOrderType: (type: "dine in" | "take away") => void;
  setPaymentDetails: (details: string) => void;
  addItemToBasket: (itemId: string, customizations?: string[]) => void;
  removeItemFromBasket: (itemId: string, customizations?: string[]) => void;
  setCurrentSelectedItemType: (type: string) => void;
  setCurrentSelectedItemSubType: (subType: string) => void;
  setCurrentSelectedItem: (itemId: string) => void;
  setCurrentScreen: (screen: string) => void;
  setLanguage: (language: string) => void;
  confirmOrder: () => void;
  resetOrder: () => void;
}

const useMenuStore = create<MenuStoreState>((set) => ({
  menuList: null,
  menuLoaded: false,
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
  setMenuLoaded: (loaded) => set({ menuLoaded: loaded }),
  setOrderId: (id) => set({ orderId: id }),
  setOrderType: (type) => set({ orderType: type }),
  setPaymentDetails: (details) => set({ paymentDetails: details }),

  addItemToBasket: (itemId, customizations) =>
    set((state) => ({
      basket: [...state.basket, { id: itemId, customizations }],
    })),

  removeItemFromBasket: (itemId, customizations) =>
    set((state) => ({
      basket: state.basket.filter(
        (item) =>
          item.id !== itemId ||
          (customizations &&
            item.customizations &&
            item.customizations.some((c) => !customizations.includes(c)))
      ),
    })),

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
