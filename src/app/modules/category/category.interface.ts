export interface ICategory {
    name: string;
    type: "PRODUCT" | "EXPENSE" | "BOTH";
}

export interface IUpdateCategory {
    name?: string;
    type?: "PRODUCT" | "EXPENSE" | "BOTH";
    isActive?: boolean
}