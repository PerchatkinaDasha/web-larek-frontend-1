import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ModalBase } from "./Modal";
import { ModalWindow } from "../types";

export class Modal extends ModalBase<ModalWindow> implements ModalWindow {
    protected contentContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.contentContainer = ensureElement('.modal__content', this.container);
        this.closeButton = ensureElement('.modal__close', this.container) as HTMLButtonElement;
        this.closeButton.addEventListener('click', () => this.events.emit('closeModal:click'));
    }

    set modalContent(data: HTMLElement) {
        this.contentContainer.replaceChildren(data);
    }
}
