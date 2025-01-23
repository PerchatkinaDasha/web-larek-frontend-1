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
    
        // Уникальные селекторы для полей электронной почты и номера телефона
        this.emailInput = ensureElement('input[name="email"]', this.container) as HTMLInputElement;
        this.phoneInput = ensureElement('input[name="phone"]', this.container) as HTMLInputElement;
    
        this.nextButton = ensureElement('.button', this.container) as HTMLButtonElement;
        this.errorMessage = ensureElement('.form__errors', this.container) as HTMLElement;
    
        // Устанавливаем начальное состояние кнопки
        this.updateButtonState();
    
        // Слушатели для проверки ввода
        this.emailInput.addEventListener('input', (evt) => this.handleInputChange(evt));
        this.phoneInput.addEventListener('input', (evt) => this.handleInputChange(evt));
    
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit('userInfoNext:click');
        });
    }

    // Проверка состояния кнопки на основе заполненности полей
    protected updateButtonState() {
        const isEmailFilled = this.emailInput.value.trim().length > 0;
        const isPhoneFilled = this.phoneInput.value.trim().length > 0;

        if (isEmailFilled && isPhoneFilled) {
            this.nextButton.removeAttribute('disabled');
        } else {
            this.nextButton.setAttribute('disabled', '');
        }
    }

    // Обработчик изменения ввода
    protected handleInputChange(evt: Event) {
        // Сохраняем текущий фокус
        const activeElement = document.activeElement;

        // Обновляем состояние кнопки
        this.updateButtonState();

        // Генерируем события изменения для каждого поля
        if (evt.target === this.emailInput) {
            this.events.emit('inputEmail:change', { value: this.emailInput.value });
        } else if (evt.target === this.phoneInput) {
            this.events.emit('inputPhone:change', { value: this.phoneInput.value });
        }

        // Восстанавливаем фокус на активном поле после изменения
        if (activeElement === this.emailInput) {
            this.emailInput.focus();
        } else if (activeElement === this.phoneInput) {
            this.phoneInput.focus();
        }
    }

    set email(data: string) {
        this.emailInput.value = data;
        this.updateButtonState();
    }

    set phone(data: string) {
        this.phoneInput.value = data;
        this.updateButtonState();
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