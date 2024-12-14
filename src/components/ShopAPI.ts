import { SubmitOrderRequest, SubmitOrderResponse, ProductItemAPI, ProductListAPI } from "../types";
import { API_URL } from "../utils/constants";
import { Api } from "./base/api";


export class ShopApi extends Api {
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }
    getProduct(id: string): Promise<ProductItemAPI> {
        return this.get<ProductItemAPI>(`/product/${id}`);
    }
    getProducts(): Promise<ProductListAPI> {
        return this.get<ProductListAPI>('/product/');
    }
    placeOrder(order: SubmitOrderRequest): Promise<SubmitOrderResponse> {
        return this.post<SubmitOrderResponse>('/order', order, 'POST');
    }
}
export const api = new ShopApi(API_URL);