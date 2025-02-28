export type DataObject = {
  id: string;
  label: string;
  imgSrc: string;
};

export type ItemCategory = {
  id: number;
  imageUrl: string;
  name: string;
};
export type MealItem = {
  items: number[];
  imageUrl: string;
  isVeg: boolean;
  price: number;
  id: number;
  description: string;
  name: string;
  categoryId: number;

};
export type MenuItem = {
  price: number;
  isVeg: boolean;
  categoryId: number;
  name: string;
  imageUrl: string;
  id: number;
  description: string;
};

export type CustomizationOption = {
  extraPrice: number;
  isVeg: boolean;
  categoryId: number;
  imageUrl: string;
  name: string;
  id: number;
};
