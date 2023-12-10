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
import { IOperationBoxConfig } from "./type";

/**
 * the manager to manage the operation of assistant robot.
 * include the operation box's render.
 * include the operation's implementation.
 */
export class OperationManager {
  btnDom: HTMLButtonElement | undefined;
  inputDom: HTMLInputElement | undefined;
  menuBtnDom: HTMLElement | undefined;
  menuDom: HTMLElement | undefined;
  // ask function
  onAsk;
  // menu click callback
  onMenuClick;
  constructor(
    container: Element,
    onAsk: (question: string) => void,
    onMenuClick: (key: string) => void,
    options: IOperationBoxConfig = {}
  ) {
    this.onAsk = onAsk;
    this.onMenuClick = onMenuClick;
    if (!options.hide) {
      this.initOperationBox(container, options);
      this.addEventListener();
    }
  }

  // render operation box
  initOperationBox(container: Element, options: IOperationBoxConfig = {}) {
    let htmlStr;
    if (options.perationBoxClassName) {
      htmlStr =
        ROBOT_OPERATION_BOX_HEAD +
        " " +
        options.perationBoxClassName +
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
              `<li data-id="${item.key}" data-disabled="${item.disabled}">${item.text}</li>`
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

  // set event listeners
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
      const element = event.target as HTMLElement;
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
