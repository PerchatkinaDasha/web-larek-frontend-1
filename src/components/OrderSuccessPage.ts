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
        
        // Находим кнопку "за новыми покупками"
        this.nextButton = ensureElement('.order-success__close', this.container) as HTMLButtonElement;

        // Добавляем обработчик нажатия на кнопку
        this.nextButton.addEventListener('click', () => {
            // Генерируем событие 'success:click' для закрытия модалки
            this.events.emit('success:click');

            // Закрываем модальное окно
            this.events.emit('modal:closed');
        });
    }

    set total(value: number) {
        this.setText(this.totalOrder, `Списано ${String(value)} синапсов`);
    }
}