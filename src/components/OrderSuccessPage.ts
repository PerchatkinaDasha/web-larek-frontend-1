import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ConfirmationPage } from "../types";

// Класс для отображения результата оформления заказа
export class OrderSuccessPage extends Component<ConfirmationPage> implements ConfirmationPage {
    protected totalOrder: HTMLElement;
    protected nextButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.totalOrder = ensureElement('.order-success__description', this.container) as HTMLElement;
        this.nextButton = ensureElement('.order-success__close', this.container) as HTMLButtonElement;
        this.nextButton.addEventListener('click', () => this.events.emit('success:click'));
    }

    set total(value: number) {
        this.setText(this.totalOrder, `Списано ${String(value)} синапсов`);
    }
}
