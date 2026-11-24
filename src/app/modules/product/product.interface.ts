export interface IProduct {
    name: string;
    categoryId: string;
    costPrice: number;
    sellingPrice: number;
    stock: number;
}

export interface IProductUpdate {
    name?: string;
    categoryId?: string;
    costPrice?: number;
    sellingPrice?: number;
    stock?: number;
}

