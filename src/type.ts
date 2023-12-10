import { LanguageModel } from "./LanguageModel";

// The config of LanguageModel class, various from model class to model class
export interface ILanguageModelOptions {
  [prop: string]: any;
}

// user defined language model class
interface ILanguageModelSubclass<T extends LanguageModel> {
  new (options: ILanguageModelOptions): T;
}

// The config of assistant robot's language model
export interface ILanguageModelConfig<T extends LanguageModel>
  extends ILanguageModelOptions {
  Model: ILanguageModelSubclass<T>;
}

// User defined operation menu item
export interface IOperation {
  // key, to mark which item was clicked
  key: string;
  // text which be showed on the menu
  text: string;
  /**
   * To mark that is this item disabled,
   * we just add a `data-disabled` attribute to the menu item,
   * user should implement the funtion
   */
  disabled: boolean;
}

// operation box's config.
export interface IOperationBoxConfig {
  // If the operation bar should be hidden.
  hide?: boolean;
  // Add a class name to the operation bar's container tag.So that user can override styles with CSS.
  perationBoxClassName?: string;
  // Items to add to the operation menu.
  operationList?: IOperation[];
}

// Configs for the 3d model of the assistant robot.
export interface IModelConfig {
  // model's position
  position: [number, number, number];
  // model's rotation
  rotation: [number, number, number];
  // model's hello action's name
  helloActionName: string;
  // model's idle action's name
  idleActionName: string;
  // what the assistant robot should say,when it was loaded.
  helloContent: string;
}

/**
 * Configs for the scene of the assistant robot's 3d model.
 * To see all default value's, look at MODEL_SCENE_CONFIG
 */
export interface IModelSceneConfig {
  // background color of the scene
  backgroundColor: number;
  // background's alpha,from 0 to 1.
  backgroundAlpha: number;
  // config of the camera in the scene
  camera: {
    // Camera frustum vertical field of view.
    fov: number;
    // Camera frustum near plane.
    near: number;
    // Camera frustum far plane
    far: number;
    // Camera's position in the scene
    position: [number, number, number];
    // A point which the camera face
    lookAt: [number, number, number];
  };

  /**
   * config of the ambient light in the scene.
   * the light globally illuminates all objects in the scene equally.
   */
  ambientLight: {
    // Numeric value of the RGB component of the color.
    color: number;
    // Numeric value of the light's strength/intensity. Expects a `Float`.
    intensity: number;
  };
  /**
   * config of the directional light in the scene.
   *  A light that gets emitted in a specific direction
   */
  directionalLight: {
    // Numeric value of the RGB component of the color.
    color: number;
    // Numeric value of the light's strength/intensity. Expects a `Float`.
    intensity: number;
    // the position of the light
    position: [number, number, number];
  };
}

/**
 * config for the 3d render part.
 */
export type TRobotModelConfig = Partial<IModelSceneConfig> & {
  modelConfig?: Partial<IModelConfig>;
  // 3d model of the robot's address, which was expected to be a glb/gltf file.
  modelUrl?: string;
};

// use detect modul's config
export interface IUserDetectorConfig {
  /**
   * The path to where the files of the face detect model are located.
   * If your user can not get the public one, the files can be download from there:https://github.com/ymrdf/assistant-robot/tree/main/example/public/face_detection
   */
  solutionPath?: string;
}

// All configs of assistant-robot.
export interface IAssistantRobotConfig<T extends LanguageModel> {
  // Add a class name to the container.So that user can override styles with CSS.
  className: string;
  // Configs for assistant robot's language model
  languageModel: ILanguageModelConfig<T>;
  // Configs for assistant robot's operation part
  operationBox: IOperationBoxConfig;
  // Configs for the robot's 3d model, and it's render
  robotModel: TRobotModelConfig;
  // Configs for the userDetect module.
  userDetector: IUserDetectorConfig;
}

export type TCallback = () => void;

// Callback function for the events
export type TEventListenFunc = (...args: any[]) => void;

//config for the 3d model's action
export interface IActionConfig {
  // If loop, default false
  loop?: boolean;
  // The degree of influence of this action (in the interval [0, 1]). Values between 0 (no impact) and 1 (full impact) can be used to blend between several actions. Default is 1.
  weight?: number;
  // Scaling factor for the time. A value of 0 causes the animation to pause. Negative values cause the animation to play backwards. Default is 1.
  timeScale?: number;
  // The number of repetitions of the action, default 1;
  repetitions?: number;
}
