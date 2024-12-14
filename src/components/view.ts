import { ensureElement} from "../utils/utils";
import { settings } from "../utils/constants";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ModalBase } from "./Modal";
import {MainPage, ProductCard,ModalWindow, ProductItem, ShoppingCart,CartItem, OrderSettings,UserContactInfo, ConfirmationPage,PaymentOption} from "../types";

/**
 * Класс Page - отображение главной страницы.
 */
export class Page extends Component<MainPage> implements MainPage {
    protected productsContainer: HTMLElement;
    protected numberProducts: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.productsContainer = ensureElement('.gallery', this.container);
        this.numberProducts = ensureElement('.header__basket-counter', this.container);
        this.basketButton = ensureElement('.header__basket', this.container) as HTMLButtonElement;
        this.basketButton.addEventListener('click', () => this.events.emit('basketIcon:click'));
    }

    set displayedProductList(items: HTMLElement[]) {
        this.productsContainer.replaceChildren(...items);
    }

    set cartItemCount(value: number) {
        this.setText(this.numberProducts, value);
    }
}

// Класс отображения карточки товара
export class Card extends Component<ProductCard> {
    protected categoryItem: HTMLElement;
    protected titleItem: HTMLElement;
    protected imageItem: HTMLImageElement;
    protected priceItem: HTMLElement;
    protected galleryButton: HTMLButtonElement;
    protected _id: string;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.categoryItem = ensureElement('.card__category', this.container);
        this.titleItem = ensureElement('.card__title', this.container);
        this.imageItem = ensureElement('.card__image', this.container) as HTMLImageElement;
        this.priceItem = ensureElement('.card__price', this.container);
        this.galleryButton = this.container as HTMLButtonElement;
        this.galleryButton.addEventListener('click', () => this.events.emit('card:click', {id: this._id}));
    }
    // устанавливает идентификатор товара
    set id(value: string) {
        this._id = value;
    }

    // обновляет категорию товара, изменяя её стиль и текст
    set category(value: string) {
        // Устанавливаем текст категории
        this.setText(this.categoryItem, value);
    
        // Убираем предыдущий стиль категории
        const currentClass = this.categoryItem.classList[1];
        this.categoryItem.classList.remove(currentClass);
    
        // Получаем новый стиль категории из настроек и добавляем его
        const newStyle = settings[value];
        this.categoryItem.classList.add(newStyle);
    }

    // обновляет название товара
    set title(value: string) {
        // Применяем текстовое значение в элемент
        this.setText(this.titleItem, value);
    }

    // устанавливает изображение товара, обновляя его ссылку
    set image(value: string) {
        // Используем метод для изменения изображения
        this.setImage(this.imageItem, value);
    }

    // обновляет цену товара, добавляя единицу измерения
    set price(value: number) {
        // Устанавливаем текст с ценой в нужный формат
        const priceText = `${value} синапсов`;
        this.setText(this.priceItem, priceText);
    }
}
// Класс основы модального окна
export class Modal extends ModalBase<ModalWindow> implements ModalWindow {
    protected contentContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.contentContainer = ensureElement('.modal__content', this.container);
        this.closeButton = ensureElement('.modal__close', this.container) as HTMLButtonElement;
        this.closeButton.addEventListener('click', () => this.events.emit('closeModal:click'));
    }

    set modalContent(data: HTMLElement) {
        this.contentContainer.replaceChildren(data);
    };
}
// Класс отображения карточки товара в модальном окне
export class CardPreview extends Card implements ProductItem {
    protected textItem: HTMLElement;
    protected inBasketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this.categoryItem = ensureElement('.card__category_other', this.container);
        this.textItem = ensureElement('.card__text', this.container);
        this.inBasketButton = ensureElement('.button', this.container) as HTMLButtonElement;
        this.inBasketButton.addEventListener('click', () => this.events.emit('inBasket:click', {id: this._id}));
    }

    set description(value: string) {
        this.setText(this.textItem, value);
    };

    buttonText(value: string) {
        this.setText(this.inBasketButton, value);
    }
}

// Класс отображения корзины в модальном окне
export class Basket extends Component<ShoppingCart> implements ShoppingCart {
    protected productsContainer: HTMLElement;
    protected totalOrder: HTMLElement;
    protected placeOrderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.productsContainer = ensureElement('.basket__list', this.container);
        this.totalOrder = ensureElement('.basket__price', this.container);
        this.placeOrderButton = ensureElement('.button', this.container) as HTMLButtonElement;
        this.placeOrderButton.addEventListener('click', () => this.events.emit('placeOrder:click'));
    };

    set itemsInCart(items: HTMLElement[]) {
        this.productsContainer.replaceChildren(...items);
    };

    set total(value: number) {
        this.totalOrder.textContent = `${value} синапсов`
    };

    set valid(isValid: boolean) {
        if (!isValid) {
            this.placeOrderButton.setAttribute('disabled', '');
        } else {
            this.placeOrderButton.removeAttribute('disabled');
        };
	}
}

// Класс отображения элемента списка товаров в корзине
export class CardBasket extends Component<CartItem> {
    protected itemIndex: HTMLElement;
    protected titleItem: HTMLElement;
    protected priceItem: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    protected _id: string;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.itemIndex = ensureElement('.basket__item-index', this.container);
        this.titleItem = ensureElement('.card__title', this.container);
        this.priceItem = ensureElement('.card__price', this.container);
        this.deleteButton = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;
        this.deleteButton.addEventListener('click', () => this.events.emit('deleteProduct:click', {id: this._id}));
    }

    // устанавливает id товара
    set id(value: string) {
        this._id = value;
    };

    // устанавливает номер товара в списке товаров в корзине
    set IndexITem(value: number) {
        this.setText(this.itemIndex, `${value}`);
    };

    // устанавливает название товара
    set title(value: string) {
        this.setText(this.titleItem, value);
    };

    // устанавливает цену товара
    set price(value: number) {
        this.setText(this.priceItem, `${value}`);
    };
}
// Класс отображения формы настроек заказа(способа оплаты и адреса доставки)
export class SettingsOrder extends Component<OrderSettings> implements OrderSettings {
    protected formElement: HTMLFormElement;
    protected paymentOnlineButton: HTMLButtonElement;
    protected paymentReceiptButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;
    protected nextButton: HTMLButtonElement;
    protected errorMessage: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.formElement = this.container as HTMLFormElement;
		this.addressInput = ensureElement('.form__input', this.container) as HTMLInputElement;
        this.paymentOnlineButton = ensureElement('button[name="card"]', this.container) as HTMLButtonElement;
        this.paymentReceiptButton = ensureElement('button[name="cash"]', this.container) as HTMLButtonElement;
        this.nextButton = ensureElement('.order__button', this.container) as HTMLButtonElement;
        this.errorMessage = ensureElement('.form__errors', this.container) as HTMLElement;
        this.addressInput.addEventListener('change', () => this.events.emit('inputAddress:change', {value: this.addressInput.value}));
        this.paymentOnlineButton.addEventListener('click', () => this.events.emit('payment:click', {paymentOrder: 'Онлайн'}));
        this.paymentReceiptButton.addEventListener('click', () => this.events.emit('payment:click', {paymentOrder: 'При получении'}));
        this.formElement.addEventListener('submit', (evt) => {
			evt.preventDefault();
            this.events.emit('settingsNext:click');
        });
    }

    set address(data: string) {
        this.addressInput.value = data;
    };

    set payment(data: PaymentOption) {
        if (data === 'Онлайн') {
            this.paymentOnlineButton.classList.remove('button_alt');
            this.paymentReceiptButton.classList.add('button_alt');
        } else if (data === 'При получении') {
            this.paymentOnlineButton.classList.add('button_alt');
            this.paymentReceiptButton.classList.remove('button_alt');
        } else {
            if (!this.paymentOnlineButton.classList.contains('button_alt')) {
                this.paymentOnlineButton.classList.add('button_alt');
            }
            if (!this.paymentReceiptButton.classList.contains('button_alt')) {
                this.paymentReceiptButton.classList.add('button_alt');
            }
        }
    };

    set error(data: string) {
        this.errorMessage.textContent = data;
    };

    set valid(isValid: boolean) {
        if (!isValid) {
            this.nextButton.setAttribute('disabled', '');
        } else {
            this.nextButton.removeAttribute('disabled');
        };
	}
}
// Класс для отображения формы настроек данных пользователя
export class InfoUser extends Component<UserContactInfo> implements UserContactInfo {
    // Элементы формы, которые будут использоваться
    protected formElement: HTMLFormElement;
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected nextButton: HTMLButtonElement;
    protected errorMessage: HTMLElement;

    // Конструктор, который принимает контейнер и объект событий
    constructor(container: HTMLElement, protected events: IEvents) {
        // Вызов конструктора родительского класса
        super(container);
        
        // Инициализация элементов формы, используя контейнер
        this.formElement = this.container as HTMLFormElement;
        this.emailInput = ensureElement('input[name="email"]', this.container) as HTMLInputElement;
        this.phoneInput = ensureElement('input[name="phone"]', this.container) as HTMLInputElement;
        this.nextButton = ensureElement('.button', this.container) as HTMLButtonElement;
        this.errorMessage = ensureElement('.form__errors', this.container) as HTMLElement;

        // Добавление обработчиков событий на изменения в полях email и phone
        this.emailInput.addEventListener('change', () => this.events.emit('inputEmail:change', {value: this.emailInput.value}));
        this.phoneInput.addEventListener('change', () => this.events.emit('inputPhone:change', {value: this.phoneInput.value}));

        // Добавление обработчика события отправки формы
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault(); // Отмена стандартного поведения формы (перезагрузка страницы)
            this.events.emit('userInfoNext:click'); // Генерация события, когда нажата кнопка "Далее"
        });
    }

    // Геттер и сеттер для установки значения email в форме
    set email(data: string) {
        this.emailInput.value = data; // Устанавливаем значение в поле email
    }

    // Геттер и сеттер для установки значения phone в форме
    set phone(data: string) {
        this.phoneInput.value = data; // Устанавливаем значение в поле phone
    }

    // Геттер и сеттер для установки текста ошибки в форме
    set error(data: string) {
        this.errorMessage.textContent = data; // Отображаем ошибку, если она есть
    };

    // Геттер и сеттер для изменения состояния кнопки "Далее"
    set valid(isValid: boolean) {
        if (!isValid) {
            this.nextButton.setAttribute('disabled', ''); // Если форма невалидна, блокируем кнопку
        } else {
            this.nextButton.removeAttribute('disabled'); // Если форма валидна, разблокируем кнопку
        };
    }
}
// Класс для отображения результата оформления заказа
export class OrderSuccessPage extends Component<ConfirmationPage> implements ConfirmationPage {
    // Элементы страницы, которые будут использоваться
    protected totalOrder: HTMLElement;  // Элемент для отображения информации о сумме заказа
    protected nextButton: HTMLButtonElement;  // Кнопка для закрытия страницы успешного оформления

    // Конструктор, который принимает контейнер и объект событий
    constructor(container: HTMLElement, protected events: IEvents) {
        // Вызов конструктора родительского класса
        super(container);

        // Инициализация элементов на странице
        this.totalOrder = ensureElement('.order-success__description', this.container) as HTMLElement;
        this.nextButton = ensureElement('.order-success__close', this.container) as HTMLButtonElement;

        // Добавление обработчика события на кнопку "Закрыть"
        this.nextButton.addEventListener('click', () => this.events.emit('success:click')); // Генерация события при клике на кнопку
    }

    // Сеттер для установки суммы заказа
    set total(value: number) {
        // Устанавливаем текст в элемент, отображающий сумму заказа
        this.setText(this.totalOrder, `Списано ${String(value)} синапсов`);
    }
}
