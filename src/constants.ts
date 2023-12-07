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

export const ROBOT_CHAT_INPUT_CLASS = "assistant-robot-input";
export const ROBOT_CHAT_BTN_CLASS = "assistant-robot-btn";

export const ROBOT_CHAT_BOX_HEAD = '<div class="assistant-robot-chartbox';

export const ROBOT_CHAT_BOX_BODY = `">
<style>
  .assistant-robot-chartbox{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .assistant-robot-input{
    flex: 1;
    min-width: 200px;
    background: rgba(0,0,0,0);
    border: 1px solid #aaaaaa;
  }
  .assistant-robot-btn{
    flex: 0 0 auto;
  }
</style>
<input class="${ROBOT_CHAT_INPUT_CLASS}" type="text" />
<button class="${ROBOT_CHAT_BTN_CLASS}">ask</button>
</div>`;

export enum ELanguageModelStatus {
  loading = 1,
  ready = 2,
  error = 3,
}

export const ONE_LETTER_READ_TIME = 50;

export const READ_WAIT_TIME = 2000;
