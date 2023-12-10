import type { IModelSceneConfig, IModelConfig } from "./type";
// Target fps
export const TARGET_FPS = 60;

// Default configs of the 3d model of the robot
export const MODEL_CONFIG: IModelConfig = {
  position: [0, 0, 0],
  rotation: [0, Math.PI, 0],
  helloActionName: "hello",
  idleActionName: "idle",
  helloContent: "Hi, you can talk to me!",
};
// Default configs for the scene of the assistant robot's 3d model.
export const MODEL_SCENE_CONFIG: IModelSceneConfig = {
  backgroundColor: 0x000000,
  backgroundAlpha: 0,
  camera: {
    fov: 50,
    near: 0.1,
    far: 10,
    position: [0, 0, 2],
    lookAt: [0, 0, 0],
  },
  ambientLight: {
    color: 0xffffff,
    intensity: 0.5,
  },
  directionalLight: {
    color: 0xffffff,
    intensity: 2,
    position: [10, 10, 0],
  },
};

// video size's for the camera
export const VIDEO_SIZE = {
  big: { width: 640, height: 480 },
  small: { width: 360, height: 270 },
};

// the follow constants are html of this component
export const ASSISTANT_MODEL_CONTAINER_CLASS =
  "assistant-robot-model-container";
export const ASSISTANT_TIP_CONTAINER = "assistant-robot-tip-container";

export const CONTAINER_HEAD = `<div class="assistant-robot-container `;

export const CONTAINER_BODY = `">
  <style>
    .assistant-robot-container{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .${ASSISTANT_MODEL_CONTAINER_CLASS}{
      flex: 1;
      position:relative;
      width:100%;
    }
    .${ASSISTANT_TIP_CONTAINER}{
      position: absolute;
      top: 2px;
      left: 50%;
      min-width: 100px;
      border: 1px solid #aaaaaa;
      border-radius: 6px;
      background: #fff;
      transform: translate(-50%);
      padding: 12px 20px;
      text-align: center;
      animation: fadeInOut 0.4s ease-in-out;
    }
    @keyframes fadeInOut {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .${ASSISTANT_TIP_CONTAINER}::after{
      content: '';
      display: block;
      position: absolute;
      bottom: -6px;
      left: 50%;
      width: 8px;
      height: 8px;
      transform: rotate(45deg);
      border-bottom: 1px solid #aaaaaa;
      border-right: 1px solid #aaaaaa;
      background: #fff;
    }
  </style>
  <div class="${ASSISTANT_MODEL_CONTAINER_CLASS}">
    <div class="${ASSISTANT_TIP_CONTAINER}">HI!</div>

  </div>
<div>
`;

// the tips to inform user
export const tips = {
  openCamera: `To interactive with the assistant, we'd like to access your device's camera.Take it easy, your pictures and information won't be sent anywhere or be stored.`,
  alreadyOpenCamera: "the camera have be opened",
};

// default operation menu item's keys
export enum EMenuKey {
  openCamera = "openCamera",
  hello = "hello",
}

// the follow constants are html of the operation part
export const ROBOT_OPERATION_INPUT_CLASS = "assistant-robot-input";
export const ROBOT_OPERATION_BTN_CLASS = "assistant-robot-btn";
export const OPERATION_CONTAINER_CLASS = "assistant-robot-operation-container";
export const MENU_BTN_CLASS = "assistant-robot-menu-btn";
export const MENU_LIST_CLASS = "assistant-robot-menu-list";

export const ROBOT_OPERATION_BOX_HEAD =
  '<div class="assistant-robot-operationbox';

export const ROBOT_OPERATION_BOX_BODY = `">
<style>
  .assistant-robot-operationbox{
    box-sizing: border-box;
    width: 100%;
    height: 52px;
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    align-items: center;
    border-radius: 54px;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.12),
    0 5px 12px 4px rgba(0, 0, 0, 0.09);
    background-color: #fff;
    padding: 10px 12px;
  }
  .assistant-robot-input{
    flex: 1;
    min-width: 200px;
    background: rgba(0,0,0,0);
    border: 1px solid #dedede;
    height: 28px;
    margin-right: 6px;
    outline:none;
    color: #666666;
  }
  .assistant-robot-btn{
    flex: 0 0 auto;
    height: 24px;
  }

  .${OPERATION_CONTAINER_CLASS}{
    position: relative;
    height: 24px;
  }
  .${MENU_BTN_CLASS}{
    color: #aaaaaa;
    width:24px;
    height: 24px;
    cursor: pointer;
  }

  .${MENU_LIST_CLASS} {
    display: none;
    position: absolute;
    top: 30px;
    left: 0px;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 5px;
    animation: fadeInOut 0.4s ease-in-out;
    list-style: none;
  }

  .${MENU_LIST_CLASS} li{
    line-height: 32px;
    text-wrap: nowrap;
    border-bottom: 1px solid #dedede;
    cursor: pointer;
  }

  .${MENU_LIST_CLASS} li:last-child{
    border-bottom: none;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
</style>
<span class="${OPERATION_CONTAINER_CLASS}">
  <svg
    t="1702017878997"
    class="${MENU_BTN_CLASS}"
    viewBox="0 0 1024 1024"
    version="1.1"
    p-id="1322"
    width="32"
    height="32"
    >
    <path
      d="M512 512m-116.949333 0a116.949333 116.949333 0 1 0 233.898666 0 116.949333 116.949333 0 1 0-233.898666 0Z"
      fill="currentColor"
      p-id="1323"
    ></path>
    <path
      d="M512 159.616m-116.949333 0a116.949333 116.949333 0 1 0 233.898666 0 116.949333 116.949333 0 1 0-233.898666 0Z"
      fill="currentColor"
      p-id="1324"
    ></path>
    <path
      d="M512 864.384m-116.949333 0a116.949333 116.949333 0 1 0 233.898666 0 116.949333 116.949333 0 1 0-233.898666 0Z"
      fill="currentColor"
      p-id="1325"
    ></path>
  </svg>
  <ul class="${MENU_LIST_CLASS}">
    <li data-id="${EMenuKey.openCamera}">eye contact</li>
`;

export const ROBOT_OPERATION_BOX_TAIL = `</ul>
</span>
<input class="${ROBOT_OPERATION_INPUT_CLASS}" type="text" />
<button class="${ROBOT_OPERATION_BTN_CLASS}">ask</button>
</div>`;

// the status of the language model
export enum ELanguageModelStatus {
  loading = 1,
  ready = 2,
  error = 3,
}

// the time for user to read one letter
export const ONE_LETTER_READ_TIME = 50;

// the wait time for the tip to hide after the user read what the robot speak.
export const READ_WAIT_TIME = 2000;

// user dectect module's status.
export enum EUserDetectorStatus {
  // init
  init = "init",
  // ready to detect
  ready = "ready",

  // user rejected to open the camera
  openCameraRejected = "openCameraRejected",
  // user's brower can not get media
  userMediaUnavailable = "userMediaUnavailable",
  // the face detect model loading error
  faceDetectorCreateError = "faceDetectorCreateError",
  // the face detect module have error
  error = "error",
}

export const USER_DETECTOR_STATUS_CHANGE_EVENT = "userDetectorStatusChange";

// the events which assistant robot can emit.
export enum EAssistantEvent {
  // language model loading completed
  languageModelLoaded = "languageModelLoaded",
  // user dectect module's status changed
  userDetectorStatusChange = USER_DETECTOR_STATUS_CHANGE_EVENT,
  // operation menu be clicked
  menuClick = "menuClick",
  // user asked something
  ask = "ask",
  // the robot said something
  say = "say",
}
