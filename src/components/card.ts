import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { settings } from "../utils/constants";
import { ProductCard, ProductItem } from "../types";

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

    set id(value: string) {
        this._id = value;
    }

    set category(value: string) {
        this.setText(this.categoryItem, value);
        const currentClass = this.categoryItem.classList[1];
        this.categoryItem.classList.remove(currentClass);
        const newStyle = settings[value];
        this.categoryItem.classList.add(newStyle);
    }

    set title(value: string) {
        this.setText(this.titleItem, value);
    }

    set image(value: string) {
        this.setImage(this.imageItem, value);
    }

    set price(value: number) { 
        if (value === null) {
            this.setText(this.priceItem, "Бесценно");
        } else {
            this.setText(this.priceItem, `${value} синапсов`);
        }
    }
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
    }

    buttonText(value: string) {
        this.setText(this.inBasketButton, value);
    }
}
