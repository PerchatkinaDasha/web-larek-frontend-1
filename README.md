# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Основные элементы интерфейса

Приложение включает следующие ключевые элементы:

`Каталог товаров` — отображение доступных продуктов.

`Детальная информация` — просмотр характеристик товара.

`Корзина`— управление выбранными товарами и оформление покупки.

## Модальные окна

Все модальные окна построены на базе класса ModalCore. Существует класс Modal, который позволяет гибко изменять содержимое модальных окон.

## Архитектура (MVP)

Проект построен на архитектурном шаблоне MVP (Model-View-Presenter), что обеспечивает четкое разделение данных, интерфейса и логики:

`Model`: Управляет данными и бизнес-логикой приложения.

`View`: Обеспечивает отображение и обработку пользовательских взаимодействий.

`Presenter`: Связывает модель и представление, управляет обменом данными.

## Описание типов данных

В проекте используется строгая типизация для данных:

###  Интерфейс товара
```ts
interface ProductItem {
    uniqueId: string;
    details: string;
    imageUrl: string;
    name: string;
    productCategory: string;
    cost: number;
}
```

###  Интерфейс заказа
```ts
interface OrderDetails {
    paymentMethod: PaymentOption;
    userEmail: string;
    userPhone: string;
    deliveryAddress: string;
    productIds: string[]; // Идентификаторы товаров
}
```
###  Тип способа оплаты
```ts
type PaymentOption = 'Online' | 'On Delivery' | '';
```
### Интерфейс API для одного товара
```ts
interface APIProductItem {
    productId: string;
    descriptionText: string;
    imageLink: string;
    productTitle: string;
    categoryType: string;
    priceValue: number;
}
```
###  Интерфейс API для списка товаров
```ts
interface ProductListAPI {
    totalCount: number;
    productItems: APIProductItem[];
}
```

### Интерфейс API для отправки заказа
```ts
interface SubmitOrderRequest {
    paymentType: PaymentOption;
    emailAddress: string;
    contactNumber: string;
    shippingAddress: string;
    orderTotal: number;
    productIdentifiers: string[];
}
```

###  Интерфейс API ответа на отправку заказа
```ts
interface SubmitOrderResponse {
    orderId: string;
    finalAmount: number;
}
```

###  Интерфейс взаимодействия с API
```ts
interface APIHandler {
    getProduct: (productId: string) => Promise<APIProductItem>;
    getProducts: () => Promise<ProductListAPI>;
    placeOrder: (orderDetails: SubmitOrderRequest) => Promise<SubmitOrderResponse>;
}
```
###  Интерфейс главной страницы
```ts
interface MainPage {
    displayedProductList: HTMLElement[];
    cartItemCount: number;
}
```
###  Интерфейс карточки товара
```ts
interface ProductCard {
    cardId: string;
    productCategory: string;
    productName: string;
    productImage: string;
    productPrice: number;
}
```
###  Интерфейс модального окна
```ts
interface ModalWindow {
    modalContent: HTMLElement;
}
```
### Интерфейс корзины
```ts
interface ShoppingCart {
    itemsInCart: HTMLElement[];
    cartTotal: number;
    isValid: boolean;
}
```
###  Интерфейс элемента корзины
```ts
interface CartItem {
    itemName: string;
    itemPrice: number;
    itemIndex: number;
    productId: string;
}
```
### Интерфейс параметров заказа
```ts
interface OrderSettings {
    deliveryLocation: string;
    paymentOption: PaymentOption;
    validationError: string;
    isFormValid: boolean;
}
```
### Интерфейс контактной информации пользователя
```ts
interface UserContactInfo {
    contactEmail: string;
    contactPhone: string;
    validationError: string;
    isValidData: boolean;
}
```
### Интерфейс отображения страницы подтверждения
```ts           
interface ConfirmationPage {
    finalTotal: number;
}
```

## Базовый код

### Класс Api
Этот класс реализует основную логику отправки HTTP-запросов. При создании экземпляра принимаются базовый URL сервера и необязательный объект с заголовками.
Реализуемые методы:

`get` — выполняет HTTP-запрос типа GET к указанному в параметрах эндпоинту и возвращает промис с объектом-ответом от сервера.
`post` — принимает объект с данными для отправки, которые передаются в теле запроса в формате JSON. Запрос отправляется на указанный эндпоинт. По умолчанию используется метод POST, но можно указать другой метод, передав его третьим параметром.
### Класс EventEmitter
Этот класс является брокером событий, который позволяет генерировать события и подписываться на них. Он используется в презентере для обработки событий, а также в других слоях приложения для их генерации.
Ключевые методы определяются интерфейсом IEvents:

`on` — подписывается на указанное событие.
`emit` — инициирует событие.
`trigger` — возвращает функцию, вызов которой инициирует событие, переданное в параметрах.

## Слой данных
### Класс ProductModel
#### `Поля класса`:
-`items: ProductItem[]` — массив объектов товаров типа ProductItem.
#### `Методы класса`:
-`setProducts(products: ProductItem[])`
Загружает список товаров.

-`addProductToList(product: ProductItem)`
Добавляет товар в список.

-`getProductById(id: string): ProductItem | undefined`
Возвращает товар по его uniqueId.

-`getAllProducts(): ProductItem[]`
Возвращает все товары.

-`getProductsByIds(ids: string[]): ProductItem[]`
Возвращает товары по списку идентификаторов uniqueId.

-`getNonZeroPriceProducts(ids: string[]): ProductItem[]`
Возвращает товары с ненулевой стоимостью.

-`getTotalPrice(ids: string[]): number`
Вычисляет общую стоимость товаров в корзине.

### Класс OrderModel
#### `Поля класса:`

`order: OrderDetails` — объект данных для хранения информации о заказе.
#### `Методы класса:``

`updateOrder(data: Partial<OrderDetails>)`
Обновляет информацию о заказе.

`getProductIds()`
Получает список ID товаров в заказе.

`getProductCount()`
Получает количество товаров в заказе.

`addProductToOrder(id: string)`
Добавляет товар в заказ по его ID.

`removeProductFromOrder(id: string)`
Удаляет товар из заказа по его ID.

`getPaymentMethod()`
Получает способ оплаты заказа.

`getDeliveryAddress()`
Получает адрес доставки.

`getUserEmail()`
Получает email пользователя.

`getUserPhone()`
Получает телефон пользователя.

`getOrderDetails()`
Получает полный объект данных о заказе.

## Классы представления
### Класс Component
Абстрактный класс для работы с DOM в дочерних компонентах.

#### `Методы класса:`

`toggleClass(element: HTMLElement, className: string, force?: boolean)`
Переключает класс у элемента.

`setText(element: HTMLElement, value: unknown)`
Устанавливает текст в элемент.

`setDisabled(element: HTMLElement, state: boolean)`
Блокирует или активирует элемент.

`hide(element: HTMLElement)`
Скрывает элемент.

`show(element: HTMLElement)`
Показывает элемент.

`setImage(element: HTMLImageElement, src: string, alt?: string)`
Устанавливает изображение в элемент.

`render(data?: Partial<T>)`
Рендерит корневой DOM-элемент.

### Класс ModalBase
Реализует базовую логику модального окна.

#### `Методы класса:`

`open()`
Открывает модальное окно.

`close()`
Закрывает модальное окно.

### Класс Page
Отображение главной страницы.

#### `Методы класса:`

`displayedProductList(items: HTMLElement[])`
Устанавливает список товаров.

`cartItemCount(value: number)`
Устанавливает количество товаров в корзине.

### Класс Card
Отображение карточки товара.

#### `Методы класса:`

`setCategory(value: string)`
Устанавливает категорию товара.

`setTitle(value: string)`
Устанавливает название товара.

`setImageItem(value: string)`
Устанавливает изображение товара.

`setPrice(value: number)`
Устанавливает цену товара.

### Класс Modal
Реализует логику модальных окон.

#### `Методы класса:`

`setContent(data: HTMLElement)`
Устанавливает содержимое модального окна.
## Класс CardPreview
Отображение карточки товара в модальном окне.

####   `Методы класса:`

`setDescription(value: string)`
Устанавливает описание товара.

`setButtonText(value: string)`
Устанавливает текст на кнопке ("В корзину" или "Из корзины").

### Класс Basket
Отображение корзины в модальном окне.

####    `Методы класса:`

`setProductList(items: HTMLElement[])`
Устанавливает список товаров в корзине.

`setTotal(value: number)`
Устанавливает общую стоимость товаров в корзине.

`setButtonState(isValid: boolean)`
Управляет активностью кнопки "Оформить заказ".

### Класс CardBasket
Отображение товара в корзине.

#### `Методы класса:`

`setIndex(value: number)`
Устанавливает порядковый номер товара в корзине.

`setTitle(value: string)`
Устанавливает название товара.

`setPrice(value: number)`
Устанавливает цену товара.

### Класс SettingsOrder
Отображение формы настроек заказа (способ оплаты и адрес).

#### `Методы класса:`

`setAddress(value: string)`
Устанавливает адрес доставки.

setPaymentMethod(value: PaymentOption)`
Устанавливает способ оплаты.

`setErrorMessage(value: string)`
Устанавливает сообщение об ошибке.

`setButtonState(isValid: boolean)`
Управляет активностью кнопки "Продолжить оформление заказа".

### Класс InfoUser
Отображение формы с контактными данными пользователя.

#### `Методы класса:`

`setEmail(value: string)`
Устанавливает email пользователя.

`setPhone(value: string)`
Устанавливает телефон пользователя.

`setErrorMessage(value: string)`
Устанавливает сообщение об ошибке.

`setButtonState(isValid: boolean)`
Управляет активностью кнопки "Оплатить".

### Класс OrderSuccessPage
Отображение страницы успеха после оформления заказа.

#### `Методы класса:`

`setTotal(value: number)`
Устанавливает общую стоимость заказа.

## Слой коммуникации
### Класс ShopApi
ShopApi — это основной класс для взаимодействия с сервером, который реализует интерфейс APIHandler и расширяет базовый класс Api. Он предоставляет методы для выполнения запросов к серверу и обработки данных.

#### Конструктор
Конструктор класса принимает два параметра:

`baseUrl` — базовый URL для всех запросов.
`options` — объект дополнительных настроек (например, заголовки или параметры аутентификации), передаваемый в конструктор родительского класса Api.
Разрешенные типы запросов:
```ts

type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
 ```
#### Методы класса:
`getProduct(productId: string): Promise<ProductItemAPI>`
Выполняет GET-запрос к API для получения информации об одном товаре по его идентификатору (productId). Возвращает промис с объектом типа ProductItemAPI.

`getProducts(): Promise<ProductListAPI>`
Выполняет GET-запрос для получения массива всех доступных товаров. Возвращает промис с объектом типа ProductListAPI.

`placeOrder(orderDetails: SubmitOrderRequest): Promise<SubmitOrderResponse>`
Выполняет POST-запрос для отправки данных о заказе. Возвращает промис с объектом ответа типа SubmitOrderResponse.

