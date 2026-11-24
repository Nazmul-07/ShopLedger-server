export interface ISale {
  productId: string;
  quantity: number;
  unitPrice: number;
  paidAmount: number;
  soldAt?: Date;
}

export interface ISaleUpdate {
  quantity?: number;
  unitPrice?: number;
  paidAmount?: number;
  soldAt?: Date;
}