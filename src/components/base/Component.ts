import { CDN_URL } from "../../utils/constants";

/**
 * Базовый компонент
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}

    // Переключить класс у элемента
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Блокировать или активировать элемент
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Скрыть
     protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Показать
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Установить изображение в элемент
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = `${CDN_URL}${src}`;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Рендеринг корневого DOM-элемента
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}