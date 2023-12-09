import { AssistantModel } from "./AssistantModel";
import { UserDetector } from "./UserDetector";
import { OperationManager } from "./OperationManager";
import {
  ELanguageModelStatus,
  ASSISTANT_MODEL_CONTAINER_CLASS,
  CONTAINER_HEAD,
  CONTAINER_BODY,
  MODEL_CONFIG,
  EAssistantEvent,
  USER_DETECTOR_STATUS_CHANGE_EVENT,
  EUserDetectorStatus,
  EMenuKey,
  tips,
} from "./constants";
import { parseHTML, EventListener } from "./utils";
import type { LanguageModel } from "./LanguageModel";
import type { IAssistantRobotConfig, IActionConfig } from "./type";

export class Assistant<T extends LanguageModel> extends EventListener {
  assistantModel;
  userDetector;
  questionManager;
  languageModel;
  options: IAssistantRobotConfig<T>;
  constructor(el: Element, options: IAssistantRobotConfig<T>) {
    super();
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
    this.userDetector.addEventListener(
      USER_DETECTOR_STATUS_CHANGE_EVENT,
      this.handleUserDetectorStatusChange
    );

    this.assistantModel = new AssistantModel(
      assistantModelContainer,
      options.robotModel
    );
    this.lookAtUser();
    this.languageModel = new options.languageModel.Model(options.languageModel);
    this.languageModel.onLoad(this.handleLanguageModelLoad);
    if (this.languageModel) {
      this.questionManager = new OperationManager(
        container,
        this.ask,
        this.onMenuClick,
        options.operationBox
      );
    }
  }

  handleLanguageModelLoad = () => {
    this.emit(EAssistantEvent.languageModelLoaded);
    this.assistantSay(
      this.options.robotModel?.modelConfig?.helloContent ||
        MODEL_CONFIG.helloContent
    );
    this.assistantModel.hello();
  };

  handleUserDetectorStatusChange = (status: EUserDetectorStatus) => {
    this.emit(EAssistantEvent.userDetectorStatusChange, status);
  };

  onMenuClick = (key: string) => {
    if (EMenuKey.openCamera === key) {
      if (this.userDetector.status === EUserDetectorStatus.ready) {
        this.assistantSay(tips.alreadyOpenCamera);
      } else {
        this.assistantSay(tips.openCamera);
        setTimeout(() => {
          this.userDetector.initVideo();
        }, 4000);
      }
    } else {
      this.emit(EAssistantEvent.menuClick, key);
    }
  };

  ask = async (question: string) => {
    this.emit(EAssistantEvent.ask, question);
    if (
      this.languageModel &&
      this.languageModel.status === ELanguageModelStatus.ready
    ) {
      try {
        const answer = await this.languageModel.findAnswers(question);
        if (answer) {
          this.assistantSay(answer);
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  assistantSay(text: string) {
    this.emit(EAssistantEvent.say);
    this.assistantModel.say(text);
  }

  assistantPlay(name: string, config?: IActionConfig) {
    this.assistantModel.play(name, config);
  }

  async lookAtUser() {
    const faceAngle = await this.userDetector.getFaceAngle();
    if (faceAngle.length > 1) {
      this.assistantModel.rotate(...faceAngle);
    }
    requestAnimationFrame(() => this.lookAtUser());
  }
}
