import { OrderDetails, PaymentOption } from "../types";
import { IEvents } from "./base/events";
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

  // Добавить товар в заказ
  addProduct(data: string) {
    this.order.items = [data, ...this.order.items];
    this.events.emit('order_items:change_order');
  }

  // Удалить товар из заказа
  removeProduct(data: string) {
    // Проверяем, является ли data строкой и совпадает ли с элементами в корзине
    if (typeof data === 'string') {
      // Фильтруем товары в корзине, исключая тот, который нужно удалить
      this.order.items = this.order.items.filter(item => item !== data);
      
      // После изменения вызываем событие, чтобы обновить корзину
      this.events.emit('order_items:change_order');
    }
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
