export type DataObject = {
    id: string,
    label: string,
    imgSrc: string,
}
export type ItemCategory = {
    id: number;
    imageUrl: string;
    name: string;
};
export type ItemPrice = {
    id: number;
    discountPrice: number;
    price: number;
    cgst: string;
    sgst: string;
    cgstPer: string;
    sgstPer: string;
    currency: string;
    currencySymbol: string;
    offerPrice: string;
    offerCgst: string;
    offerSgst: string;
};

export type MenuItem = {
    price: ItemPrice;
    isVeg: boolean;
    categoryId: number;
    name: string;
    description: string;
    imageUrl: string;
    isCustomizable: boolean;
    id:number;
};
