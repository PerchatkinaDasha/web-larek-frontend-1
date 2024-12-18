import { ProductItem } from "../types";
import { IEvents } from "./base/events";

export class ProductModel {
  protected items: ProductItem[] = []; // Массив для хранения товаров

  constructor(protected events: IEvents) {} // Конструктор принимает объект событий для эмита событий

  // Устанавливает список товаров (массив объектов Product)
  setProductsList(items: ProductItem[]) {
    this.items = items;
    this.events.emit("product_items:set_items"); // Эмитирует событие, что товары были загружены
  }

  // Получить товар по его id
  getProduct(id: string): ProductItem | undefined {
    return this.items.find((item) => item.id === id); // Находит товар по id
  }

  // Получить список всех товаров
  getProductsList(): ProductItem[] {
    return this.items; // Возвращает весь массив товаров
  }

  // Получить товары по списку их id
  getProductsArr(ids: string[]): (ProductItem | undefined)[] {
    return ids.map((id) => this.getProduct(id)); // Возвращает массив товаров по переданным id
  }

  // Получить список id товаров, у которых есть ненулевая цена
  getProductsArrNotNull(ids: string[]): string[] {
    return ids.filter((id) => {
      const product = this.getProduct(id); // Получает товар по id
      return product && product.price !== null; // Фильтрует товары, у которых цена не null
    });
  }

  // Вычислить полную стоимость корзины по списку товаров (их id)
  getTotalBasket(ids: string[]): number {
    return ids.reduce((total, id) => {
      const product = this.getProduct(id); // Получает товар по id
      return product ? total + product.price : total; // Суммирует стоимость товаров с ненулевой ценой
    }, 0); // Начальная стоимость корзины 0
  }
}
