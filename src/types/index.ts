// Интерфейс модели объекта Товар
export interface ProductItem {
  id: string;       // уникальный идентификатор товара
  description: string;        // описание товара
  image: string;       // ссылка на изображение товара
  title: string;           // название товара
  category: string; // категория товара
  price: number;           // стоимость товара
}

// Тип интерфейса способа оплаты заказа
export type PaymentOption = 'Онлайн' | 'При получении' | ''; // возможные способы оплаты

// Интерфейс модели объекта Заказ
export interface OrderDetails {
  payment: PaymentOption; // способ оплаты
  email: string;            // email покупателя
  phone: string;            // телефон покупателя
  address: string;      // адрес доставки
  items: string[];         // идентификаторы товаров
}

// Интерфейс API для одного товара
export interface ProductItemAPI{
  id: string;     // уникальный идентификатор товара
  description: string; // описание товара
  image: string;     // ссылка на изображение товара
  title: string;  // название товара
  category: string;  // категория товара
  price: number;    // цена товара
}

// Интерфейс API для списка товаров
export interface ProductListAPI {
  total: number;      // общее количество товаров
  items: ProductItemAPI[]; // список товаров
}

// Интерфейс API для отправки заказа
export interface SubmitOrderRequest {
  payment: PaymentOption;  // способ оплаты
  email: string;        // email покупателя
  phone: string;       // телефон покупателя
  address: string;     // адрес доставки
  total: number;          // итоговая сумма заказа
  items: string[]; // массив идентификаторов товаров
}

// Интерфейс API ответа на отправку заказа
export interface SubmitOrderResponse {
  id: string;  // уникальный идентификатор заказа
  total: number; // итоговая сумма заказа
}

// Интерфейс взаимодействия с API
export interface APIHandler {
  getProduct: (id: string) => Promise<ProductItemAPI>; // получение одного товара по ID
  getProducts: () => Promise<ProductListAPI>; // получение списка товаров
  placeOrder: (order: SubmitOrderRequest) => Promise<SubmitOrderResponse>; // отправка заказа
}

// Интерфейс главной страницы
export interface MainPage {
  displayedProductList: HTMLElement[];  // отображаемые карточки товаров на главной странице
  cartItemCount: number; // количество товаров в корзине
}

// Интерфейс карточки товара
export interface ProductCard {
  id: string;        // уникальный идентификатор карточки товара
  category: string; // категория товара
  title: string;   // название товара
  image: string;  // изображение товара
  price: number;  // цена товара
}

// Интерфейс модального окна
export interface ModalWindow {
  modalContent: HTMLElement;  // содержимое модального окна
}

// Интерфейс корзины
export interface ShoppingCart {
  itemsInCart: HTMLElement[]; // товары, добавленные в корзину
  total: number;  // общая стоимость товаров в корзине
  valid: boolean;   // валидность корзины (например, если корзина пуста)
}

// Интерфейс элемента корзины
export interface CartItem {
  title: string;  // название товара
  price: number; // цена товара
  IndexITem: number; // индекс товара в корзине
  id: string; // уникальный идентификатор товара
}

// Интерфейс параметров заказа
export interface OrderSettings {
  address: string; // адрес доставки
  payment: PaymentOption; // способ оплаты
  error: string; // ошибка валидации
  valid: boolean; // валидность формы заказа
}

// Интерфейс контактной информации пользователя
export interface UserContactInfo {
  email: string; // email пользователя
  phone: string; // телефон пользователя
  error: string; // ошибка валидации (если есть)
  valid: boolean; // валидность данных
}

// Интерфейс отображения страницы подтверждения
export interface ConfirmationPage {
  total: number;  // итоговая сумма заказа
}

//Интерфейс ResponseError описывает структуру ответа от API в случае ошибки с кодами 4xx (клиентская ошибка). 
export interface ResponseError {
  error: string;
} 