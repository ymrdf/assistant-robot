import { AssistantModel } from "./AssistantModel";
import { UserDetector } from "./UserDetector";
import { QuestionManager } from "./QuestionManager";
import {
  ELanguageModelStatus,
  ASSISTANT_MODEL_CONTAINER_CLASS,
  CONTAINER_HEAD,
  CONTAINER_BODY,
  MODEL_CONFIG,
} from "./constants";
import { parseHTML } from "./utils";
import type { LanguageModel } from "./LanguageModel";
import type { IAssistantRobotConfig } from "./type";

export class Assistant<T extends LanguageModel> {
  assistantModel;
  userDetector;
  questionManager;
  languageModel;
  options: IAssistantRobotConfig<T>;
  constructor(el: Element, options: IAssistantRobotConfig<T>) {
    this.options = options;
    if (!el || !el.appendChild) {
      throw new Error(
        "ILLEGAL DOM:Container need to be a html element dom, but now it is:" +
          el.toString()
      );
    }
    const container = parseHTML(
      CONTAINER_HEAD + (options.className || "") + CONTAINER_BODY
    )!;

    el.appendChild(container);

    const assistantModelContainer = container.querySelector(
      "." + ASSISTANT_MODEL_CONTAINER_CLASS
    )!;

    this.userDetector = new UserDetector(options.userDetector);

    this.assistantModel = new AssistantModel(
      assistantModelContainer,
      options.robotModel
    );
    this.lookAtUser();
    this.languageModel = new options.languageModel.Model(options.languageModel);
    this.languageModel.onLoad(this.handleLanguageModelLoad);
    if (this.languageModel) {
      this.questionManager = new QuestionManager(
        container,
        this.ask,
        options.chatBox
      );
    }
  }

  handleLanguageModelLoad = () => {
    this.assistantModel.say(
      this.options.robotModel?.modelConfig?.helloContent ||
        MODEL_CONFIG.helloContent
    );
    this.assistantModel.hello();
  };

  ask = async (question: string) => {
    if (
      this.languageModel &&
      this.languageModel.status === ELanguageModelStatus.ready
    ) {
      try {
        const answer = await this.languageModel.findAnswers(question);
        if (answer) {
          this.assistantModel.say(answer);
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  async lookAtUser() {
    const faceAngle = await this.userDetector.getFaceAngle();
    if (faceAngle.length > 1) {
      this.assistantModel.rotate(...faceAngle);
    }
    requestAnimationFrame(() => this.lookAtUser());
  }
}
