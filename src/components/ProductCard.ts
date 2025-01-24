import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ProductCard } from "../types";

// Общий класс для отображения товара
export class ProductCardComponent extends Component<ProductCard> {
    protected titleItem: HTMLElement;
    protected priceItem: HTMLElement;
    protected _id: string;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.titleItem = ensureElement('.card__title', this.container);
        this.priceItem = ensureElement('.card__price', this.container);
    }

    set id(value: string) {
        this._id = value;
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