import { LanguageModel } from "./LanguageModel";

export interface ILanguageModelOptions {
  [prop: string]: any;
}

interface ILanguageModelSubclass<T extends LanguageModel> {
  new (options: ILanguageModelOptions): T;
}

export interface ILanguageModelConfig<T extends LanguageModel>
  extends ILanguageModelOptions {
  Model: ILanguageModelSubclass<T>;
}

export interface IOperation {
  key: string;
  text: string;
  disable: boolean;
}

export interface IOperationBoxBoxConfig {
  hide?: boolean;
  chatBoxClassName?: string;
  operationList?: IOperation[];
}

export interface IModelConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  // model's hello action's name
  helloActionName: string;
  idleActionName: string;
  helloContent: string;
}

export interface IModelSceneConfig {
  backgroundColor: number;
  backgroundAlpha: number;
  camera: {
    fov: number;
    near: number;
    far: number;
    position: [number, number, number];
    lookAt: [number, number, number];
  };
  ambientLight: {
    color: number;
    intensity: number;
  };
  directionalLight: {
    color: number;
    intensity: number;
    position: [number, number, number];
  };
}

export type TRobotModelConfig = Partial<IModelSceneConfig> & {
  modelConfig?: Partial<IModelConfig>;
  modelUrl?: string;
};

export interface IUserDetectorConfig {
  solutionPath?: string;
}

export interface IAssistantRobotConfig<T extends LanguageModel> {
  className: string;
  languageModel: ILanguageModelConfig<T>;
  operationBox: IOperationBoxBoxConfig;
  robotModel: TRobotModelConfig;
  userDetector: IUserDetectorConfig;
}

export type TCallback = () => void;

export type TEventListenFunc = (...args: any[]) => void;
