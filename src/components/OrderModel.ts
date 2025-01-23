import { OrderDetails, PaymentOption } from "../types"; 
import { IEvents } from "./base/events"; 

export class OrderModel { 
  protected order: OrderDetails = {
    payment: "", 
    email: "", 
    phone: "", 
    address: "", 
    items: [] 
  }; 

  constructor(protected events: IEvents) {} 

  editOrder(data: Partial<OrderDetails>) { 
    Object.assign(this.order, data); 
  } 

  getProductIds(): string[] { 
    return this.order.items; 
  }
  

  getProductCount(): number { 
    return this.order.items.length; 
  }

  addProduct(data: string) { 
    this.order.items = [data, ...this.order.items]; 
    this.events.emit('order_items:change_order'); 
  } 

  removeProduct(data: string) { 
    if (typeof data === 'string') { 
      this.order.items = this.order.items.filter(item => item !== data); 
      this.events.emit('order_items:change_order'); 
    } 
  } 

  getPaymentMethod(): PaymentOption { 
    return this.order.payment; 
  } 

  getDeliveryAddress(): string { 
    return this.order.address; 
  } 

  getUserEmail(): string { 
    return this.order.email; 
  } 

  getUserPhone(): string { 
    return this.order.phone; 
  } 

  getOrder(): OrderDetails { 
    return this.order; 
  }

  // Методы валидации
  validatePayment(): string {
    return this.order.payment ? '' : 'Выберите способ оплаты';
  }

  validateAddress(): string {
    return this.order.address ? '' : 'Введите адрес доставки заказа';
  }

  validateEmail(): string {
    return this.order.email ? '' : 'Введите email';
  }

  validatePhone(): string {
    return this.order.phone ? '' : 'Введите телефон';
  }

  

  // Метод для проверки валидности заказа
  validateOrder(): { isValid: boolean; error: string } {
    let error = this.validatePayment() || this.validateAddress();
    const isValid = !error;
    return { isValid, error };
  }

  validateUserInfo(): { isValid: boolean; error: string } {
    let error = this.validateEmail() || this.validatePhone();
    const isValid = !error;
    return { isValid, error };
  }
}
