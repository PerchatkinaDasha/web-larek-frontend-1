import { ensureElement } from "../utils/utils";
import { settings } from "../utils/constants";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { MainPage } from "../types";

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