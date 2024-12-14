import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

/**
 * Базовый класс модального окна
 * 
 * @template T Тип данных, ассоциируемый с модальным окном.
 */
export class ModalBase<T> extends Component<T> {
  // Основной контейнер модального окна
  protected modal: HTMLElement;
  // Объект для управления событиями
  protected events: IEvents;
  // Контейнер для динамического содержимого модального окна
  protected _content: HTMLElement | null;

  /**
   * Конструктор модального окна.
   * @param {HTMLElement} container Корневой контейнер модального окна.
   * @param {IEvents} events Объект событий, передаваемый для связи с внешними обработчиками.
   */
  constructor(container: HTMLElement, events: IEvents) {
    super(container); // Вызов конструктора базового класса
    this.events = events;

    // Поиск содержимого модального окна и кнопки закрытия
    this._content = ensureElement('.modal__content', container) as HTMLElement | null;
    const closeButtonElement = ensureElement('.modal__close', this.container) as HTMLButtonElement | null;

    // Установка обработчика на кнопку закрытия модального окна
    if (closeButtonElement) {
      closeButtonElement.addEventListener("click", this.close.bind(this));
    }

    // Закрытие модального окна при клике вне его содержимого
    this.container.addEventListener("mousedown", (evt: MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });

    // Привязка метода закрытия по клавише `Escape`
    this.handleEscUp = this.handleEscUp.bind(this);
  }

  /**
   * Открытие модального окна.
   * Добавляет CSS-класс для отображения окна и устанавливает обработчик нажатия клавиши Escape.
   */
  open() {
    this.container.classList.add("modal_active");  // Добавляем класс, чтобы показать модалку
    document.addEventListener("keyup", this.handleEscUp);  // Слушаем клавишу Escape для закрытия
  }

  /**
   * Закрытие модального окна.
   * Удаляет CSS-класс, очищает содержимое окна и снимает обработчик клавиши Escape.
   */
  close() {
    this.container.classList.remove("modal_active");  // Убираем класс, чтобы скрыть модалку
    if (this._content) {
      this._content.innerHTML = "";  // Очистка содержимого модального окна
    }
    document.removeEventListener("keyup", this.handleEscUp);  // Убираем слушатель клавиши Escape
  }

  /**
   * Обработчик события `keyup` для закрытия модального окна по клавише Escape.
   * @param {KeyboardEvent} evt Событие клавиатуры.
   */
  handleEscUp(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.close();
    }
  }
}
