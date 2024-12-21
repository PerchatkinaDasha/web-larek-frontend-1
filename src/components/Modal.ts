import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

/**
 * Базовый класс модального окна
 *
 * @template T Тип данных, ассоциируемый с модальным окном.
 */
export class Modal<T> extends Component<T> {
  // Основной контейнер модального окна
  protected modal: HTMLElement;
  // Объект для управления событиями
  protected events: IEvents;
  // Контейнер для динамического содержимого модального окна
  protected contentContainer: HTMLElement;
  // Кнопка закрытия модального окна
  protected closeButton: HTMLButtonElement;

  /**
   * Конструктор модального окна.
   * @param {HTMLElement} container Корневой контейнер модального окна.
   * @param {IEvents} events Объект событий, передаваемый для связи с внешними обработчиками.
   */
  constructor(container: HTMLElement, events: IEvents) {
    super(container); // Вызов конструктора базового класса
    this.events = events;

    // Поиск содержимого модального окна и кнопки закрытия
    this.contentContainer = ensureElement('.modal__content', container);
    this.closeButton = ensureElement('.modal__close', container) as HTMLButtonElement;

    // Установка обработчика на кнопку закрытия модального окна
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close(true));
    }

    // Закрытие модального окна при клике вне его содержимого
    this.container.addEventListener("mousedown", (evt: MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        this.close(true); // Передаем true, чтобы обновить счётчик
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
    this.container.classList.add("modal_active"); // Добавляем класс, чтобы показать модалку
    document.addEventListener("keyup", this.handleEscUp); // Слушаем клавишу Escape для закрытия
  }

  /**
   * Закрытие модального окна.
   * Удаляет CSS-класс, очищает содержимое окна и снимает обработчик клавиши Escape.
   * @param {boolean} [updateCounter=false] Флаг, указывающий на необходимость обновления счётчика.
   */
  close(updateCounter = false) {
    this.container.classList.remove("modal_active"); // Убираем класс, чтобы скрыть модалку
    if (this.contentContainer) {
      this.contentContainer.innerHTML = ""; // Очистка содержимого модального окна
    }
    document.removeEventListener("keyup", this.handleEscUp); // Убираем слушатель клавиши Escape

    // Обновление счётчика товаров, если это требуется
    if (updateCounter) {
      this.events.emit('modal:closed'); // Генерируем событие закрытия модалки
    }
  }

  /**
   * Обработчик события `keyup` для закрытия модального окна по клавише Escape.
   * @param {KeyboardEvent} evt Событие клавиатуры.
   */
  handleEscUp(evt: KeyboardEvent) {
    if (evt.key === "Escape") {
      this.close(true); // Обновляем счётчик при закрытии через Escape
    }
  }

  /**
   * Устанавливает новый контент в модальное окно.
   * @param {HTMLElement} content Новый контент для модального окна.
   */
  set modalContent(content: HTMLElement) {
    this.contentContainer.innerHTML = ""; // Очищаем старое содержимое
    this.contentContainer.appendChild(content); // Добавляем новый контент
  }
}
