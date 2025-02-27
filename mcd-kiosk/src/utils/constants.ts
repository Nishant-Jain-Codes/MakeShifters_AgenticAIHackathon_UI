import { DataObject } from "../types";

export const OrderTypes : DataObject[] = [
  {
    id: "dine in",
    label: "Dine In",
    imgSrc: "place_holder.svg",
  },
  {
    id: "take away",
    label: "Take Away",
    imgSrc: "place_holder.svg",
  },
];
export const ItemTypes : DataObject[] = [
    {
        id: "burger",
        label: "Burger",
        imgSrc: "./assets/placeholder-category-item.webp",
    },
    {
        id: "pizza",
        label: "Pizza",
        imgSrc: "./assets/placeholder-category-item.webp",
    },
    {
        id: "drink",
        label: "Drink",
        imgSrc: "./assets/placeholder-category-item.webp",
    },
    {
        id: "dessert",
        label: "Dessert",
        imgSrc: "./assets/placeholder-category-item.webp",
    },
]