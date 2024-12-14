import { ProductItem, OrderDetails, PaymentOption } from "../types";
import { IEvents } from "./base/events";

// Класс модели товара
export class ProductModel {
  protected items: ProductItem[] = []; // Массив для хранения товаров

  constructor(protected events: IEvents) {} // Конструктор принимает объект событий для эмита событий

  // Устанавливает список товаров (массив объектов Product)
  setProductsList(items: ProductItem[]) {
    this.items = items;
    this.events.emit("product_items:set_items"); // Эмитирует событие, что товары были загружены
  }

  // Добавляет один товар в начало массива товаров
  addProduct(item: ProductItem) {
    this.items = [item, ...this.items]; // Добавление товара в начало массива
    this.events.emit("product_items:add_item"); // Эмитирует событие, что товар был добавлен
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

// Класс модели заказа
export class OrderModel {
  protected order: OrderDetails = { // Инициализация заказа с пустыми значениями
    payment: "", // Способ оплаты
    email: "", // Email пользователя
    phone: "", // Телефон пользователя
    address: "", // Адрес доставки
    items: [] // Массив товаров (id товаров)
  };

  constructor(protected events: IEvents) {} // Конструктор принимает объект событий для эмита событий

  // Изменяет объект заказа, используя данные, переданные в виде Partial<OrderDetails>
  editOrder(data: Partial<OrderDetails>) {
    Object.assign(this.order, data); // Обновляет свойства заказа, не заменяя другие
  }

  // Получить список id товаров в заказе
  getProductIds(): string[] {
    return this.order.items; // Возвращает массив id товаров в заказе
  }

  // Получить количество товаров в заказе
  getProductCount(): number {
    return this.order.items.length; // Возвращает количество товаров в заказе
  }

   //добавить товар в заказ
   addProduct(data: string) {
    this.order.items = [data, ...this.order.items];
    this.events.emit('order_items:change_order');
};

  //удалить товар из заказа
  removeProduct(data: string) {
    this.order.items = this.order.items.filter(function(item) {
        return item !== data
    });
    this.events.emit('order_items:change_order');
}

  // Получить способ оплаты заказа
  getPaymentMethod(): PaymentOption {
    return this.order.payment; // Возвращает способ оплаты
  }

  // Получить адрес доставки
  getDeliveryAddress(): string {
    return this.order.address; // Возвращает адрес доставки
  }

  // Получить email пользователя
  getUserEmail(): string {
    return this.order.email; // Возвращает email пользователя
  }

  // Получить телефон пользователя
  getUserPhone(): string {
    return this.order.phone; // Возвращает телефон пользователя
  }

  // Получить полный объект заказа
  getOrder(): OrderDetails {
    return this.order; // Возвращает полный объект заказа
  }
}
