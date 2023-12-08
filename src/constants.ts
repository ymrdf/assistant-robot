import type { IModelSceneConfig, IModelConfig } from "./type";
export const TARGET_FPS = 60;

export const MODEL_CONFIG: IModelConfig = {
  position: [0, 0, 0],
  rotation: [0, Math.PI, 0],
  helloActionName: "hello",
  idleActionName: "idle",
  helloContent: "Hi, you can talk to me!",
};

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

export const VIDEO_SIZE = {
  big: { width: 640, height: 480 },
  small: { width: 360, height: 270 },
};

export const ASSISTANT_MODEL_CONTAINER_CLASS =
  "assistant-robot-model-container";
export const ASSISTANT_TIP_CONTAINER = "assistant_tip_container";

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

export const tips = {
  openCamera: `To interactive with the assistant, we'd like to access your device's camera.Take it easy, your pictures and information won't be sent anywhere or be stored.`,
  alreadyOpenCamera: "the camera have be opened",
};

export enum EMenuKey {
  openCamera = "openCamera",
  hello = "hello",
}

export const ROBOT_OPERATION_INPUT_CLASS = "assistant-robot-input";
export const ROBOT_OPERATION_BTN_CLASS = "assistant-robot-btn";
export const OPERATION_CONTAINER_CLASS = "operation_container";
export const MENU_BTN_CLASS = "menu_btn";
export const MENU_LIST_CLASS = "menu_list";

export const ROBOT_OPERATION_BOX_HEAD = '<div class="assistant-robot-chartbox';

export const ROBOT_OPERATION_BOX_BODY = `">
<style>
  .assistant-robot-chartbox{
    width: 100%;
    height: 32px;
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    align-items: center;
    border-radius: 54px;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.12),
    0 5px 12px 4px rgba(0, 0, 0, 0.09);
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
    color: #dedede;
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
    <li data-id="${EMenuKey.openCamera}">Open the Camera</li>
`;

export const ROBOT_OPERATION_BOX_TAIL = `</ul>
</span>
<input class="${ROBOT_OPERATION_INPUT_CLASS}" type="text" />
<button class="${ROBOT_OPERATION_BTN_CLASS}">ask</button>
</div>`;

export enum ELanguageModelStatus {
  loading = 1,
  ready = 2,
  error = 3,
}

export const ONE_LETTER_READ_TIME = 50;

export const READ_WAIT_TIME = 2000;

export enum EUserDetectorStatus {
  init = "init",
  ready = "ready",
  openCameraRejected = "openCameraRejected",
  userMediaUnavailable = "userMediaUnavailable",
  faceDetectorCreateError = "faceDetectorCreateError",
  error = "error",
}

export const USER_DETECTOR_STATUS_CHANGE_EVENT = "userDetectorStatusChange";

export enum EAssistantEvent {
  languageModelLoaded = "languageModelLoaded",
  userDetectorStatusChange = USER_DETECTOR_STATUS_CHANGE_EVENT,
  menuClick = "menuClick",
  ask = "ask",
  say = "say",
}
