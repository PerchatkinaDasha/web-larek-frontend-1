
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ShoppingCart } from "../types";

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