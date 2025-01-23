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
  private selectedPayment: boolean = false; // Для отслеживания выбора способа оплаты

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.formElement = this.container as HTMLFormElement;
    this.addressInput = ensureElement('.form__input', this.container) as HTMLInputElement;
    this.paymentOnlineButton = ensureElement('button[name="card"]', this.container) as HTMLButtonElement;
    this.paymentReceiptButton = ensureElement('button[name="cash"]', this.container) as HTMLButtonElement;
    this.nextButton = ensureElement('.order__button', this.container) as HTMLButtonElement;
    this.errorMessage = ensureElement('.form__errors', this.container) as HTMLElement;

    // Добавляем обработчик ввода в адресное поле
    this.addressInput.addEventListener('input', () => {
      const addressValue = this.addressInput.value.trim();
      this.events.emit('inputAddress:change', { value: addressValue });
      this.updateButtonState(); // Обновляем состояние кнопки
      this.updateErrorMessage(addressValue); // Обновляем сообщение об ошибке
    });

    this.paymentOnlineButton.addEventListener('click', () => {
      this.selectedPayment = true;
      this.events.emit('payment:click', { paymentOrder: 'Онлайн' });
      this.updateButtonState(); // Обновляем состояние кнопки
    });

    this.paymentReceiptButton.addEventListener('click', () => {
      this.selectedPayment = true;
      this.events.emit('payment:click', { paymentOrder: 'При получении' });
      this.updateButtonState(); // Обновляем состояние кнопки
    });

    this.formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.events.emit('settingsNext:click');
    });
  }

  set address(data: string) {
    this.addressInput.value = data;
    this.updateButtonState(); // Проверяем кнопку при установке значения
    this.updateErrorMessage(data); // Обновляем сообщение об ошибке
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
    this.selectedPayment = !!data; // Обновляем состояние выбора способа оплаты
    this.updateButtonState();
  }

  set error(data: string) {
    this.errorMessage.textContent = data;
  }

  set valid(isValid: boolean) {
    this.updateButtonState(); // Проверяем кнопку с учетом текущей валидации
  }

  // Метод для обновления состояния кнопки "Далее"
  private updateButtonState() {
    const addressValue = this.addressInput.value.trim();
    const isAddressValid = addressValue.length > 0; // Можно добавить более строгую проверку для адреса
    if (isAddressValid && this.selectedPayment) {
      this.nextButton.removeAttribute('disabled');
    } else {
      this.nextButton.setAttribute('disabled', '');
    }
  }

  // Метод для обновления сообщения об ошибке
  private updateErrorMessage(address: string) {
    if (address.trim().length === 0) {
      this.errorMessage.textContent = "Введите адрес доставки"; // Показать ошибку, если адрес не введен
    } else {
      this.errorMessage.textContent = ""; // Если адрес введен, скрыть ошибку
    }
  }
}