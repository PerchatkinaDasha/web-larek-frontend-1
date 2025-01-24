import { ensureElement } from "../utils/utils";
import { Card } from "./card";
import { IEvents } from "./base/events";
import { ProductItem } from "../types";

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
    }

    buttonText(value: string) {
        this.setText(this.inBasketButton, value);
    }
}