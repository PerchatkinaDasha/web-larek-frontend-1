import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { UserContactInfo } from "../types";

// Класс для отображения формы настроек данных пользователя
export class InfoUser extends Component<UserContactInfo> implements UserContactInfo {
    protected formElement: HTMLFormElement;
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected nextButton: HTMLButtonElement;
    protected errorMessage: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.formElement = this.container as HTMLFormElement;
        this.emailInput = ensureElement('input[name="email"]', this.container) as HTMLInputElement;
        this.phoneInput = ensureElement('input[name="phone"]', this.container) as HTMLInputElement;
        this.nextButton = ensureElement('.button', this.container) as HTMLButtonElement;
        this.errorMessage = ensureElement('.form__errors', this.container) as HTMLElement;

        this.emailInput.addEventListener('input', () => 
            this.events.emit('inputEmail:change', { value: this.emailInput.value })
        );
        
        this.phoneInput.addEventListener('input', () => 
            this.events.emit('inputPhone:change', { value: this.phoneInput.value })
        );

        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit('userInfoNext:click');
        });
    }

    set email(data: string) {
        this.emailInput.value = data;
    }

    set phone(data: string) {
        this.phoneInput.value = data;
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
