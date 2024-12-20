import { ensureElement } from "../utils/utils"; 
import { Component } from "./base/Component"; 
import { IEvents } from "./base/events"; 
import { OrderSettings, PaymentOption } from "../types"; 
 
// Класс отображения формы настроек заказа 
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
        this.addressInput.addEventListener('input', () => 
            this.events.emit('inputAddress:change', { value: this.addressInput.value })
        );
        
        this.paymentOnlineButton.addEventListener('click', () => 
            this.events.emit('payment:click', { paymentOrder: 'Онлайн' })
        );
        
        this.paymentReceiptButton.addEventListener('click', () => 
            this.events.emit('payment:click', { paymentOrder: 'При получении' })
        );
        this.formElement.addEventListener('submit', (evt) => { 
            evt.preventDefault(); 
            this.events.emit('settingsNext:click'); 
        }); 
    } 
 
    set address(data: string) { 
        this.addressInput.value = data; 
    } 
 
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
    } 
 
    set error(data: string) { 
        this.errorMessage.textContent = data; 
    } 
 
    set valid(isValid: boolean) { 
        if (!isValid) { 
            this.nextButton.setAttribute('disabled', ''); 
        } else { 
            this.nextButton.removeAttribute('disabled'); 
        } 
    } 
} 
