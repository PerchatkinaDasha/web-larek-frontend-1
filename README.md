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
    : (productId: string) => Promise<APIProductItem>;
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
Класс является моделью данных, предназначен для хранения и работы с данными объектов товаров.
#### Конструктор класса
```typescript
 class ProductModel {
    protected items: ProductItem[] = []; 
    constructor(protected events: IEvents) {}
}
```

#### `Поля класса`:
-`items: ProductItem[]` — массив объектов товаров типа ProductItem.

#### `Методы класса`:
-`setProducts(products: ProductItem[])`
Загружает список товаров.
npm 
-`getProductById(id: string): ProductItem | undefined`
Возвращает товар по его uniqueId.

-`getAllProducts(): ProductItem[]`
Возвращает все товары.

-`getProductsByIds(ids: string[]): ProductItem[]`
Возвращает товары по списку идентификаторов uniqueId.

-`getNonZeroPriceProducts(ids: string[]): ProductItem[]`
Возвращает товары с ненулевой стоимостью.


### Класс OrderModel
Класс `OrderModel` отвечает за управление информацией о заказе. Он предоставляет методы для обновления данных о заказе, работы с товарами в заказе и получения информации о пользователе, доставке и способах оплаты.
#### Конструктор класса

```typescript
constructor(protected events: IEvents) {}
```
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
Класс `ModalBase` является базовым классом для реализации модальных окон. Он наследуется от класса `Component` с обобщённым типом `T`, который передаётся как тип данных, используемый в компоненте.
 #### Конструктор модального окна.
   * @param {HTMLElement} container Корневой контейнер модального окна.
   * @param {IEvents} events Объект событий, передаваемый для связи с внешними обработчиками.

#### Поля класса:
`- modal: HTMLElement` - элемент модального окна;
`- events: IEvents` - брокер событий.

#### `Методы класса:`

`open()`
Открывает модальное окно.

`close()`
Закрывает модальное окно.

### Класс Page
Класс `Page`, реализующий отображение главной страницы, является наследником класса `Component` и реализует интерфейс `MainPage`. Его конструктор принимает два параметра: HTML-элемент container, который выступает в качестве родителя для отображаемого содержимого, и объект events, содержащий обработчики событий.

#### Поля класса
`productsContainer: HTMLElement`
Элемент DOM, служащий контейнером для списка товаров.

`numberProducts: HTMLElement`
Элемент интерфейса, отображающий количество товаров, добавленных в корзину. Текст этого элемента динамически обновляется.

`basketButton: HTMLButtonElement`
Кнопка корзины, расположенная в шапке (header). При нажатии на неё открывается модальное окно корзины. Кнопка связана с брокером событий, который отправляет сигналы о взаимодействии с корзиной.

#### `Методы класса:`

`displayedProductList(items: HTMLElement[])`
Устанавливает список товаров.

`cartItemCount(value: number)`
Устанавливает количество товаров в корзине.

### Класс Card
Класс `Card` предназначен для отображения карточки товара в списке на главной странице. Этот класс является наследником `Component` и реализует интерфейс `ProductCard`. Его конструктор принимает два параметра: HTML-элемент container, который выступает в роли родительского элемента для карточки, и объект events, содержащий необходимые обработчики событий.

#### Поля класса
`categoryItem: HTMLElement`
DOM-элемент, который отображает название категории, к которой принадлежит товар. Текст внутри этого элемента соответствует категории товара.

`titleItem: HTMLElement`
Элемент разметки, используемый для отображения названия товара.

`imageItem: HTMLElement`
Элемент, предназначенный для демонстрации изображения товара. Содержит ссылку на изображение, которое отображается в карточке.

`priceItem: HTMLElement`
DOM-элемент, показывающий цену товара. Текст элемента обновляется в зависимости от данных конкретного товара.

`galleryButton: HTMLButtonElement`
Кнопка, предназначенная для открытия модального окна с детальной информацией о товаре. Эта кнопка связана с брокером событий, который отправляет сигналы о запросе на отображение детализации.

`_id: string`
Уникальный идентификатор товара, связанный с текущей карточкой. Используется для взаимодействия с данными товара, например, при добавлении в корзину или запросе дополнительных данных.

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
Класс `Modal` служит основой для работы с модальными окнами. Он наследует функциональность класса `ModalBase` и реализует интерфейс `ModalWindow`. Конструктор принимает два аргумента: HTML-элемент container, который используется как родительский контейнер для модального окна, и объект events, управляющий событиями модального окна.

#### Поля класса
`contentContainer: HTMLElement`
Основной элемент разметки внутри модального окна, предназначенный для размещения динамического контента. Этот контейнер обновляется в зависимости от того, какое содержимое требуется показать пользователю.

`closeButton: HTMLButtonElement`
Кнопка закрытия модального окна. Позволяет пользователю закрыть окно вручную. Этот элемент является частью разметки модального окна и может быть привязан к обработчику события закрытия.

#### `Методы класса:`

`setContent(data: HTMLElement)`
Устанавливает содержимое модального окна.
## Класс CardPreview
Класс `CardPreview` предназначен для отображения карточки товара в модальном окне. Он расширяет класс `Card` и реализует интерфейс `ProductItem`. Конструктор класса принимает два аргумента: HTML-элемент container, который является родительским для карточки товара в модальном окне, и объект events, управляющий событиями, связанными с этим элементом.

#### Поля класса
`textItem: HTMLElement`
Элемент разметки, отображающий описание товара. В этом элементе содержится текстовое описание, предоставляющее дополнительную информацию о товаре.

`inBasketButton: HTMLButtonElement`
Кнопка "В корзину", которая позволяет добавить товар в корзину или удалить его, если он уже был добавлен. Кнопка связана с брокером событий, который обрабатывает логику добавления/удаления товара из корзины.

####  `Методы класса:`

`setDescription(value: string)`
Устанавливает описание товара.

`setButtonText(value: string)`
Устанавливает текст на кнопке ("В корзину" или "Из корзины").

### Класс Basket
Класс `Basket` предназначен для отображения корзины товаров в модальном окне. Он наследует функциональность от класса `Component` и реализует интерфейс `ShoppingCart`. Конструктор класса принимает два параметра: HTML-элемент container, который служит контейнером для корзины, и объект events, который управляет событиями, связанными с действиями внутри корзины.

#### Поля класса
`productsContainer: HTMLElement`
Элемент DOM, который содержит список товаров, добавленных в корзину. Все элементы, представляющие товары в корзине, размещаются внутри этого контейнера.

`totalOrder: HTMLElement`
Элемент, отображающий общую стоимость всех товаров в корзине. Текст этого элемента обновляется при изменении стоимости товаров в корзине.

`placeOrderButton: HTMLButtonElement`
Кнопка "Оформить заказ", при клике на которую начинается процесс оформления заказа. Кнопка связана с брокером событий, который инициирует соответствующие действия при ее нажатии.

####    `Методы класса:`

`setProductList(items: HTMLElement[])`
Устанавливает список товаров в корзине.

`setTotal(value: number)`
Устанавливает общую стоимость товаров в корзине.

`setButtonState(isValid: boolean)`
Управляет активностью кнопки "Оформить заказ".

### Класс CardBasket
Класс `CardBasket` предназначен для отображения карточки товара в корзине. Он наследует класс `Component` и реализует интерфейс `CartItem`. Конструктор класса принимает два параметра: HTML-элемент container, который является родительским для карточки товара, и объект events, который управляет событиями, связанными с действиями в корзине.

#### Поля класса
`itemIndex: HTMLElement`
Элемент разметки, отображающий порядковый номер товара в списке корзины. Этот элемент помогает пользователю ориентироваться в расположении товаров в корзине.

`titleItem: HTMLElement`
Элемент, который отображает название товара. Текст этого элемента обновляется в зависимости от информации о конкретном товаре.

`priceItem: HTMLElement`
Элемент, показывающий цену товара. В этом элементе отображается стоимость товара, который находится в корзине.

`deleteButton: HTMLButtonElement`
Кнопка "Удалить", которая позволяет удалить товар из корзины при клике. Этот элемент связан с брокером событий, который обрабатывает удаление товара из корзины.

`_id: string`
Уникальный идентификатор товара в корзине. Этот параметр используется для идентификации товара при выполнении различных операций с ним, например, при удалении.

#### `Методы класса:`

`setIndex(value: number)`
Устанавливает порядковый номер товара в корзине.

`setTitle(value: string)`
Устанавливает название товара.

`setPrice(value: number)`
Устанавливает цену товара.

### Класс SettingsOrder
Класс `SettingsOrder` предназначен для отображения формы настройки заказа, включая выбор способа оплаты и указание адреса доставки. Он наследует функциональность от класса `Component`и реализует интерфейс `OrderSettings`. Конструктор класса принимает два параметра: HTML-элемент container, который служит родительским для формы, и объект events, управляющий событиями, связанными с действиями в форме.

#### Поля класса:

`formElement: HTMLFormElement`
Элемент формы, содержащий все элементы управления, такие как поля ввода и кнопки. Этот элемент используется для сбора и отправки данных, введённых пользователем.

`paymentOnlineButton: HTMLButtonElement`
Кнопка, позволяющая выбрать способ оплаты онлайн. При клике на эту кнопку устанавливается соответствующий способ оплаты. Связана с брокером событий для обработки выбора.

`paymentReceiptButton: HTMLButtonElement`
Кнопка, позволяющая выбрать способ оплаты при получении. При клике на эту кнопку устанавливается соответствующий способ оплаты. Связана с брокером событий для обработки выбора.

`addressInput: HTMLInputElement`
Поле ввода для указания адреса доставки. Пользователь вводит свой адрес, который затем используется для оформления заказа. Связано с брокером событий для обработки изменений.

`nextButton: HTMLButtonElement`
Кнопка "Продолжить оформление заказа", при клике на которую начинается следующий этап оформления. Связана с брокером событий для обработки перехода.

`errorMessage: HTMLElement`
Элемент для отображения сообщений об ошибках, например, если форма заполнена некорректно.

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
Класс `UserInfo` предназначен для отображения формы, в которой пользователь может ввести свои контактные данные, такие как электронная почта и номер телефона. Этот класс расширяет функциональность класса `Component` и реализует интерфейс `UserContactInfo`. Конструктор класса принимает два параметра: HTML-элемент container, который служит контейнером для формы, и объект events, который управляет событиями, связанными с действиями в форме.

#### Поля класса
`formElement: HTMLFormElement`
Основной элемент формы, содержащий поля для ввода контактных данных и кнопку для перехода к следующему этапу оформления заказа.

`emailInput: HTMLInputElement`
Поле для ввода адреса электронной почты пользователя. На это поле установлена связь с брокером событий для обработки изменений и валидации ввода.

`phoneInput: HTMLInputElement`
Поле для ввода телефонного номера пользователя. Также связано с брокером событий для обработки изменений и валидации.

`nextButton: HTMLButtonElement`
Кнопка "Продолжить оформление заказа", при нажатии на которую пользователь переходит к следующему этапу оформления. Кнопка привязана к брокеру событий для обработки действия.

`errorMessage: HTMLElement`
Элемент для вывода сообщений об ошибках, например, в случае неверного ввода данных. Этот элемент помогает уведомить пользователя о проблемах с заполнением формы.

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

