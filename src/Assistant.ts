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
import { parseHTML, EventListener, replaceChildren } from "./utils";
import type { LanguageModel } from "./LanguageModel";
import type { IAssistantRobotConfig, IActionConfig } from "./type";

/**
 * the main class of the assistant robot.
 * After the class is instantiated, a fill funtion assistant robot will be show on the page.
 */
export class Assistant<T extends LanguageModel> extends EventListener {
  // assistant robot's 3d model manager
  assistantModel;
  // user face detect module
  userDetector;
  // operations for assistant robot
  operationManager;
  // language model, to answer user's question
  languageModel;
  // the assistant's config
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

    replaceChildren(el, container);

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
      this.operationManager = new OperationManager(
        container,
        this.ask,
        this.onMenuClick,
        options.operationBox
      );
    }
  }

  // After language model load, to hello the user
  handleLanguageModelLoad = () => {
    this.emit(EAssistantEvent.languageModelLoaded);
    this.assistantSay(
      this.options.robotModel?.modelConfig?.helloContent ||
        MODEL_CONFIG.helloContent
    );
    this.assistantModel.hello();
  };

  // emit event when user detector module's status change
  handleUserDetectorStatusChange = (status: EUserDetectorStatus) => {
    this.emit(EAssistantEvent.userDetectorStatusChange, status);
  };

  onMenuClick = (key: string) => {
    // if key is "open camera", init user detect module
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

  /**
   * ask the assistant robot a question
   * @param question question to ask
   */
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

  /**
   * make the robot say something
   * @param text what the robot should say
   */
  assistantSay(text: string) {
    this.emit(EAssistantEvent.say);
    this.assistantModel.say(text);
  }

  /**
   * make the robot play a action
   * @param name name of the action
   * @param config config of the action
   */
  assistantPlay(name: string, config?: IActionConfig) {
    this.assistantModel.play(name, config);
  }

  //make the 3d model of the robot to look at user
  async lookAtUser() {
    const faceAngle = await this.userDetector.getFaceAngle();
    if (faceAngle.length > 1) {
      this.assistantModel.rotate(...faceAngle);
    }
    requestAnimationFrame(() => this.lookAtUser());
  }
}
