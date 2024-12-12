// Интерфейс модели объекта Товар
export interface ProductItem {
  uniqueId: string;       // уникальный идентификатор товара
  details: string;        // описание товара
  imageUrl: string;       // ссылка на изображение товара
  name: string;           // название товара
  productCategory: string; // категория товара
  cost: number;           // стоимость товара
}

// Тип интерфейса способа оплаты заказа
export type PaymentOption = 'Online' | 'On Delivery' | ''; // возможные способы оплаты

// Интерфейс модели объекта Заказ
export interface OrderDetails {
  paymentMethod: PaymentOption; // способ оплаты
  userEmail: string;            // email покупателя
  userPhone: string;            // телефон покупателя
  deliveryAddress: string;      // адрес доставки
  productIds: string[];         // идентификаторы товаров
}

// Интерфейс API для одного товара
export interface APIProductItem {
  productId: string;     // уникальный идентификатор товара
  descriptionText: string; // описание товара
  imageLink: string;     // ссылка на изображение товара
  productTitle: string;  // название товара
  categoryType: string;  // категория товара
  priceValue: number;    // цена товара
}

// Интерфейс API для списка товаров
export interface APIProductList {
  totalCount: number;      // общее количество товаров
  productItems: APIProductItem[]; // список товаров
}

// Интерфейс API для отправки заказа
export interface SubmitOrderRequest {
  paymentType: PaymentOption;  // способ оплаты
  emailAddress: string;        // email покупателя
  contactNumber: string;       // телефон покупателя
  shippingAddress: string;     // адрес доставки
  orderTotal: number;          // итоговая сумма заказа
  productIdentifiers: string[]; // массив идентификаторов товаров
}

// Интерфейс API ответа на отправку заказа
export interface SubmitOrderResponse {
  orderId: string;  // уникальный идентификатор заказа
  finalAmount: number; // итоговая сумма заказа
}

// Интерфейс взаимодействия с API
export interface APIHandler {
  fetchProduct: (productId: string) => Promise<APIProductItem>; // получение одного товара по ID
  fetchProductList: () => Promise<APIProductList>; // получение списка товаров
  placeOrder: (orderDetails: SubmitOrderRequest) => Promise<SubmitOrderResponse>; // отправка заказа
}

// Интерфейс главной страницы
export interface MainPage {
  displayedProductList: HTMLElement[];  // отображаемые карточки товаров на главной странице
  cartItemCount: number; // количество товаров в корзине
}

// Интерфейс карточки товара
export interface ProductCard {
  cardId: string;        // уникальный идентификатор карточки товара
  productCategory: string; // категория товара
  productName: string;   // название товара
  productImage: string;  // изображение товара
  productPrice: number;  // цена товара
}

// Интерфейс модального окна
export interface ModalWindow {
  modalContent: HTMLElement;  // содержимое модального окна
}

// Интерфейс корзины
export interface ShoppingCart {
  itemsInCart: HTMLElement[]; // товары, добавленные в корзину
  cartTotal: number;  // общая стоимость товаров в корзине
  isValid: boolean;   // валидность корзины (например, если корзина пуста)
}

// Интерфейс элемента корзины
export interface CartItem {
  itemName: string;  // название товара
  itemPrice: number; // цена товара
  itemIndex: number; // индекс товара в корзине
  productId: string; // уникальный идентификатор товара
}

// Интерфейс параметров заказа
export interface OrderSettings {
  deliveryLocation: string; // адрес доставки
  paymentOption: PaymentOption; // способ оплаты
  validationError: string; // ошибка валидации
  isFormValid: boolean; // валидность формы заказа
}

// Интерфейс контактной информации пользователя
export interface UserContactInfo {
  contactEmail: string; // email пользователя
  contactPhone: string; // телефон пользователя
  validationError: string; // ошибка валидации (если есть)
  isValidData: boolean; // валидность данных
}

// Интерфейс отображения страницы подтверждения
export interface ConfirmationPage {
  finalTotal: number;  // итоговая сумма заказа
}

//Интерфейс ResponseError описывает структуру ответа от API в случае ошибки с кодами 4xx (клиентская ошибка). 
export interface ResponseError {
  error: string;
}