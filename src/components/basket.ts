import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ShoppingCart, CartItem } from "../types";

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
    }

    set itemsInCart(items: HTMLElement[]) {
        this.productsContainer.replaceChildren(...items);
    }

    set total(value: number) {
        this.totalOrder.textContent = `${value} синапсов`;
    }

    set valid(isValid: boolean) {
        if (!isValid) {
            this.placeOrderButton.setAttribute('disabled', '');
        } else {
            this.placeOrderButton.removeAttribute('disabled');
        }
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

    set id(value: string) {
        this._id = value;
    }

    set IndexITem(value: number) {
        this.setText(this.itemIndex, `${value}`);
    }

    set title(value: string) {
        this.setText(this.titleItem, value);
    }

    set price(value: number) { 
        if (value === null) {
            this.setText(this.priceItem, "Бесценно");
        } else {
            this.setText(this.priceItem, `${value} синапсов`);
        }
    }
}