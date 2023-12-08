import {
  ROBOT_OPERATION_BOX_HEAD,
  ROBOT_OPERATION_BOX_BODY,
  ROBOT_OPERATION_BOX_TAIL,
  ROBOT_OPERATION_BTN_CLASS,
  ROBOT_OPERATION_INPUT_CLASS,
  MENU_BTN_CLASS,
  MENU_LIST_CLASS,
} from "./constants";
import { parseHTML } from "./utils";
import { IOperationBoxBoxConfig } from "./type";

export class OperationManager {
  btnDom: HTMLButtonElement | undefined;
  inputDom: HTMLInputElement | undefined;
  menuBtnDom: HTMLElement | undefined;
  menuDom: HTMLElement | undefined;
  onAsk;
  onMenuClick;
  constructor(
    container: Element,
    onAsk: (question: string) => void,
    onMenuClick: (key: string) => void,
    options: IOperationBoxBoxConfig = {}
  ) {
    this.onAsk = onAsk;
    this.onMenuClick = onMenuClick;
    if (!options.hide) {
      this.initChatBox(container, options);
      this.addEventListener();
    }
  }

  initChatBox(container: Element, options: IOperationBoxBoxConfig = {}) {
    let htmlStr;
    if (options.chatBoxClassName) {
      htmlStr =
        ROBOT_OPERATION_BOX_HEAD +
        " " +
        options.chatBoxClassName +
        ROBOT_OPERATION_BOX_BODY;
    } else {
      htmlStr = ROBOT_OPERATION_BOX_HEAD + ROBOT_OPERATION_BOX_BODY;
    }

    if (options.operationList) {
      htmlStr =
        htmlStr +
        options.operationList
          .map(
            (item) =>
              `<li data-id="${item.key}" data-disable="${item.disable}">${item.text}</li>`
          )
          .join("");
    }

    htmlStr = htmlStr + ROBOT_OPERATION_BOX_TAIL;

    const chatBoxDom = parseHTML(htmlStr)!;

    container.appendChild(chatBoxDom);

    this.btnDom = chatBoxDom.querySelector(
      "." + ROBOT_OPERATION_BTN_CLASS
    ) as HTMLButtonElement;
    this.inputDom = chatBoxDom.querySelector(
      "." + ROBOT_OPERATION_INPUT_CLASS
    ) as HTMLInputElement;
    this.btnDom.disabled = true;
    this.menuBtnDom = chatBoxDom.querySelector(
      "." + MENU_BTN_CLASS
    ) as HTMLElement;
    this.menuDom = chatBoxDom.querySelector(
      "." + MENU_LIST_CLASS
    ) as HTMLElement;
  }

  addEventListener() {
    this.btnDom?.addEventListener("click", () => {
      if (this.inputDom?.value) {
        this.onAsk?.(this.inputDom.value);
      }
    });

    this.inputDom?.addEventListener("input", () => {
      if (this.btnDom) {
        this.btnDom.disabled = !this.inputDom?.value;
      }
    });

    this.menuBtnDom?.addEventListener("click", () => {
      const menu = this.menuDom;
      if (menu) {
        menu.style.display =
          menu.style.display === "none" || menu.style.display === ""
            ? "block"
            : "none";
      }
    });

    this.menuDom?.addEventListener("click", (event: MouseEvent) => {
      var element = event.target as HTMLElement;
      if (element.tagName === "LI") {
        // Access the value of the data-id attribute
        const clickedItemId = element.getAttribute("data-id");
        if (clickedItemId) {
          this.onMenuClick(clickedItemId);
        }

        this.menuDom!.style.display = "none";
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !this.menuBtnDom?.contains(event.target as Node) &&
        !this.menuDom?.contains(event.target as Node)
      ) {
        if (this.menuDom) {
          this.menuDom.style.display = "none";
        }
      }
    });
  }
}
