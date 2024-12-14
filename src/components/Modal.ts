import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

/**
 * Базовый класс модального окна
 */
export class ModalBase<T> extends Component<T> {
  protected modal: HTMLElement;
  protected events: IEvents;
  protected _content: HTMLElement | null;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    // Инициализация содержимого и кнопки закрытия
    this._content = ensureElement('.modal__content', container) as HTMLElement | null;
    const closeButtonElement = ensureElement('.modal__close', this.container) as HTMLButtonElement | null;

    // Обработчик закрытия по клику на кнопку
    if (closeButtonElement) {
      closeButtonElement.addEventListener("click", this.close.bind(this));
    }

    // Закрытие по клику вне модального окна
    this.container.addEventListener("mousedown", (evt: MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });

    // Привязка обработчика для закрытия на `Escape`
    this.handleEscUp = this.handleEscUp.bind(this);
  }

  // Открытие модального окна
  open() {
    this.container.classList.add("modal_active");  // Добавляем класс, чтобы показать модалку
    document.addEventListener("keyup", this.handleEscUp);  // Слушаем клавишу Escape для закрытия
  }

  // Закрытие модального окна
  close() {
    this.container.classList.remove("modal_active");  // Убираем класс, чтобы скрыть модалку
    if (this._content) {
      this._content.innerHTML = "";  // Очистка содержимого модального окна
    }
    document.removeEventListener("keyup", this.handleEscUp);  // Убираем слушатель клавиши Escape
  }

  // Закрытие модального окна по клавише Escape
  handleEscUp(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.close();
    }
  }
}
