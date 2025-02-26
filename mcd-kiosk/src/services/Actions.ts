import { create } from "zustand";

interface MenuState {
  items: Record<string, { id: string; customizations: string[] }>; // Stores items with possible customizations
  currentSelectedItemType: string | null;
  currentSelectedItemSubType: string | null;
  currentSelectedItem: string | null;
  currentSelectedLanguage: string;
  currentScreen: string;
  orderType: "dine in" | "take away" | null;
  paymentType: string | null;

  // Actions
  add: (itemId: string, customisationId?: string) => void;
  remove: (itemId: string, customisationId?: string) => void;
  customise: (itemId: string) => void;
  setCurrentSelectedItemType: (type: string) => void;
  setCurrentSelectedItemSubType: (subType: string) => void;
  setCurrentSelectedItem: (itemId: string) => void;
  setCurrentSelectedLanguage: (language: string) => void;
  cancel: () => void;
  setCurrentScreen: (screenType: string) => void;
  selectOrderType: (orderType: "dine in" | "take away") => void;
  confirmOrder: () => void;
  selectPaymentType: (paymentType: string) => void;
}

const useMenuStore = create<MenuState>((set) => ({
  items: {}, // Empty cart initially
  currentSelectedItemType: null,
  currentSelectedItemSubType: null,
  currentSelectedItem: null,
  currentSelectedLanguage: "English",
  currentScreen: "home",
  orderType: null,
  paymentType: null,

  // Add item with optional customisation
  add: (itemId, customisationId) =>
    set((state) => {
      const updatedItems = { ...state.items };
      if (!updatedItems[itemId]) {
        updatedItems[itemId] = { id: itemId, customizations: [] };
      }
      if (customisationId) {
        updatedItems[itemId].customizations.push(customisationId);
      }
      return { items: updatedItems };
    }),

  // Remove item with optional customisation
  remove: (itemId, customisationId) =>
    set((state) => {
      const updatedItems = { ...state.items };
      if (updatedItems[itemId]) {
        if (customisationId) {
          updatedItems[itemId].customizations = updatedItems[itemId].customizations.filter(
            (id) => id !== customisationId
          );
        } else {
          delete updatedItems[itemId]; // Remove item completely if no customisation specified
        }
      }
      return { items: updatedItems };
    }),

  // Customize an item (just logs in store for now)
  customise: (itemId) => console.log(`Customizing item: ${itemId}`),

  // Set selected item type
  setCurrentSelectedItemType: (type) => set({ currentSelectedItemType: type }),

  // Set selected item subtype
  setCurrentSelectedItemSubType: (subType) =>
    set({ currentSelectedItemSubType: subType }),

  // Set current selected item
  setCurrentSelectedItem: (itemId) => set({ currentSelectedItem: itemId }),

  // Set selected language
  setCurrentSelectedLanguage: (language) =>
    set({ currentSelectedLanguage: language }),

  // Cancel the order (reset all states)
  cancel: () =>
    set({
      items: {},
      currentSelectedItemType: null,
      currentSelectedItemSubType: null,
      currentSelectedItem: null,
      orderType: null,
      paymentType: null,
    }),

  // Set the current screen
  setCurrentScreen: (screenType) => set({ currentScreen: screenType }),

  // Select order type (Dine In or Takeaway)
  selectOrderType: (orderType) => set({ orderType }),

  // Confirm order (mocked action)
  confirmOrder: () => console.log("Order confirmed!", useMenuStore.getState()),

  // Select payment type
  selectPaymentType: (paymentType) => set({ paymentType }),
}));

export default useMenuStore;
