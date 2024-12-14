import { SubmitOrderRequest, SubmitOrderResponse, ProductItemAPI, ProductListAPI } from "../types";
import { API_URL } from "../utils/constants";
import { Api } from "./base/api";

/**
 * Класс для работы с API магазина.
 * Предоставляет методы для получения данных о товарах и оформления заказов.
 */
export class ShopApi extends Api {
    /**
     * Конструктор для создания экземпляра API магазина.
     * @param {string} baseUrl Базовый URL для API.
     * @param {RequestInit} [options] Опциональные настройки запроса.
     */
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options); // Вызов конструктора базового класса Api.
    }

    /**
     * Получает информацию о конкретном продукте.
     * @param {string} id Идентификатор продукта.
     * @returns {Promise<ProductItemAPI>} Промис с данными о продукте.
     */
    getProduct(id: string): Promise<ProductItemAPI> {
        return this.get<ProductItemAPI>(`/product/${id}`); // Выполнение GET-запроса для получения информации о продукте.
    }

    /**
     * Получает список всех доступных продуктов.
     * @returns {Promise<ProductListAPI>} Промис с данными о списке продуктов.
     */
    getProducts(): Promise<ProductListAPI> {
        return this.get<ProductListAPI>('/product/'); // Выполнение GET-запроса для получения списка продуктов.
    }

    /**
     * Отправляет заказ в систему.
     * @param {SubmitOrderRequest} order Объект с данными заказа.
     * @returns {Promise<SubmitOrderResponse>} Промис с ответом сервера на отправку заказа.
     */
    placeOrder(order: SubmitOrderRequest): Promise<SubmitOrderResponse> {
        return this.post<SubmitOrderResponse>('/order', order, 'POST'); // Выполнение POST-запроса для размещения заказа.
    }
}

// Экземпляр API для взаимодействия с сервером магазина.
export const api = new ShopApi(API_URL);






