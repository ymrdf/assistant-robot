import {
  ROBOT_CHAT_BOX_HEAD,
  ROBOT_CHAT_BOX_BODY,
  ROBOT_CHAT_BTN_CLASS,
  ROBOT_CHAT_INPUT_CLASS,
} from "./constants";
import { parseHTML } from "./utils";
import { IChatBoxConfig } from "./type";

export class QuestionManager {
  btnDom: HTMLButtonElement | undefined;
  inputDom: HTMLInputElement | undefined;
  onAsk;
  constructor(
    container: Element,
    onAsk: (question: string) => void,
    options: IChatBoxConfig = {}
  ) {
    this.onAsk = onAsk;
    if (!options.hide) {
      this.initChatBox(container, options);
      this.addEventListener();
    }
  }

  initChatBox(container: Element, options: IChatBoxConfig = {}) {
    let htmlStr;
    if (options.chatBoxClassName) {
      htmlStr =
        ROBOT_CHAT_BOX_HEAD +
        " " +
        options.chatBoxClassName +
        ROBOT_CHAT_BOX_BODY;
    } else {
      htmlStr = ROBOT_CHAT_BOX_HEAD + ROBOT_CHAT_BOX_BODY;
    }
    const chatBoxDom = parseHTML(htmlStr)!;

    container.appendChild(chatBoxDom);

    this.btnDom = chatBoxDom.querySelector(
      "." + ROBOT_CHAT_BTN_CLASS
    ) as HTMLButtonElement;
    this.inputDom = chatBoxDom.querySelector(
      "." + ROBOT_CHAT_INPUT_CLASS
    ) as HTMLInputElement;
    this.btnDom.disabled = true;
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
  }
}
