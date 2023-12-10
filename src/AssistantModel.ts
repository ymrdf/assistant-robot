import {
  PerspectiveCamera,
  Scene,
  Color,
  AmbientLight,
  DirectionalLight,
  WebGL1Renderer,
  Object3D,
  AnimationMixer,
  AnimationClip,
  LoopOnce,
  LoopRepeat,
  AnimationAction,
  Clock,
} from "three";
// @ts-expect-error there's some problem about this
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import {
  MODEL_SCENE_CONFIG,
  MODEL_CONFIG,
  ASSISTANT_TIP_CONTAINER,
  ONE_LETTER_READ_TIME,
  READ_WAIT_TIME,
} from "./constants";
import defaultModel from "./assets/potato.glb?url";
import type { TRobotModelConfig, IModelConfig, IActionConfig } from "./type";

/**
 * assistant robot's 3d model manager.
 * include the inition of the scene and the 3d model.
 * include the methods to make the 3d model play an action or speek something
 */
export class AssistantModel {
  // clock for keeping track of time
  clock = new Clock();
  // 3d scene's container
  container;
  // tip element to contain what the robot speak
  tip: HTMLElement;
  // the 3d scene
  scene: Scene = new Scene();
  // the 3d renderer
  renderer: WebGL1Renderer | undefined;
  // the 3d model of the robot
  model: Object3D | undefined;
  // the camera of the scene
  camera: PerspectiveCamera | undefined;

  // mixer to control the 3d model
  mixer: AnimationMixer | undefined;
  // animation clips of the 3d model
  clips: AnimationClip[] | undefined;

  // timeout to close the tip
  timer: number | undefined;

  // configs for this class
  options: TRobotModelConfig;

  // idle action
  idleAction: AnimationAction | undefined;

  constructor(container: Element, options: TRobotModelConfig) {
    this.options = options;
    this.container = container;
    this.tip = container.querySelector("." + ASSISTANT_TIP_CONTAINER)!;
    this.hideTip();
    this.init(options);
  }

  /**
   * init the 3d scene an 3d model for the robot
   * @param options configs
   */
  init(options: TRobotModelConfig = {}) {
    const {
      backgroundColor,
      backgroundAlpha,
      modelUrl = defaultModel,
    } = options;

    if (backgroundColor) {
      this.scene.background = new Color(backgroundColor);
    }

    // init camera
    this.camera = new PerspectiveCamera(
      MODEL_SCENE_CONFIG.camera.fov,
      this.container.clientWidth / this.container.clientHeight,
      MODEL_SCENE_CONFIG.camera.near,
      MODEL_SCENE_CONFIG.camera.far
    );
    const cameraPosition = options.camera?.position
      ? options.camera?.position
      : MODEL_SCENE_CONFIG.camera.position;
    this.camera?.position.set(...cameraPosition);
    const cameraLookAt = options.camera?.lookAt
      ? options.camera?.lookAt
      : MODEL_SCENE_CONFIG.camera.lookAt;
    this.camera?.lookAt(...cameraLookAt);

    // init light
    const ambientLightConfig = options.ambientLight
      ? options.ambientLight
      : MODEL_SCENE_CONFIG.ambientLight;
    const light = new AmbientLight(
      ambientLightConfig.color,
      ambientLightConfig.intensity
    );
    this.scene.add(light);

    const directionalLightConfig = options.directionalLight
      ? options.directionalLight
      : MODEL_SCENE_CONFIG.directionalLight;
    const directionalLight = new DirectionalLight(
      directionalLightConfig.color,
      directionalLightConfig.intensity
    );
    directionalLight.position.set(...directionalLightConfig.position);
    this.scene.add(directionalLight);

    // render
    this.renderer = new WebGL1Renderer();
    this.renderer.setClearColor(
      backgroundColor !== undefined
        ? backgroundColor
        : MODEL_SCENE_CONFIG.backgroundColor,
      backgroundColor !== undefined
        ? backgroundAlpha
        : MODEL_SCENE_CONFIG.backgroundAlpha
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);

    this.loadModel(modelUrl, options.modelConfig);
  }

  /**
   * to load the 3d model
   * @param modelUrl  the url to load 3d model, default to use MR Potato
   * @param param1 the config for the 3d model
   */
  loadModel(
    modelUrl: string,
    { position, rotation }: Partial<IModelConfig> = {}
  ) {
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf: any) => {
        const model = gltf.scene;
        model.position.set(...(position || MODEL_CONFIG.position));
        model.rotation.set(...(rotation || MODEL_CONFIG.rotation));
        this.model = model;
        this.mixer = new AnimationMixer(model);
        this.clips = gltf.animations;
        this.scene.add(model);
        this.startIdleAction();
        this.animate();
      },
      () => {},
      (errorMessage: any) => {
        console.warn(errorMessage);
      }
    );
  }

  // Make 3d model to play idle action
  startIdleAction() {
    if (!this.clips || !this.mixer) return;
    const clip = AnimationClip.findByName(
      this.clips,
      this.options.modelConfig?.idleActionName || MODEL_CONFIG.idleActionName
    );
    const action = this.mixer.clipAction(clip);
    this.idleAction = action;
    action.enabled = true;
    action.setLoop(LoopRepeat, Infinity);
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(1);
    action.play();
  }

  /**
   * halt idle action
   * @param duration how long time to halt
   */
  haltIdleAction(duration: number) {
    this.idleAction?.stop();
    if (duration !== Infinity) {
      setTimeout(() => {
        this.idleAction?.play();
      }, duration);
    }
  }

  // the 3d model to play hello action
  hello() {
    this.play(
      this.options.modelConfig?.helloActionName || MODEL_CONFIG.helloActionName
    );
  }

  /**
   * make the robot play a action
   * @param name name of the action
   * @param config config of the action
   */
  play(
    name: string,
    {
      loop = false,
      weight = 1,
      timeScale = 1,
      repetitions = Infinity,
    }: IActionConfig = {}
  ) {
    if (!this.clips || !this.mixer) return;

    const clip = AnimationClip.findByName(this.clips, name);
    if (!clip) return;
    const action = this.mixer.clipAction(clip);

    action.enabled = true;
    action.setLoop(loop ? LoopRepeat : LoopOnce, repetitions);
    action.setEffectiveTimeScale(2 || timeScale);
    action.setEffectiveWeight(weight);
    const repetTime = loop ? action.repetitions : 1; // default repet 1 time
    // halt idle action before play new action
    this.haltIdleAction(
      ((action.getClip().duration * repetTime) / action.timeScale) * 1000 // the time to halt.
    );
    action.reset();
    action.play();
  }

  // hide tip
  hideTip() {
    this.tip.style.display = "none";
  }

  /**
   * make the robot say something
   * @param text what the robot should say
   */
  say(text: string) {
    if (!text || typeof text !== "string") return;
    const newText = document.createTextNode(text);
    // Append the new text node to the container
    this.tip.replaceChildren(newText);
    if (this.tip.style.display === "none") {
      this.tip.style.display = "block";
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }

    // the time to show the text
    const showTime = text.length * ONE_LETTER_READ_TIME + READ_WAIT_TIME;

    // close the tip
    this.timer = setTimeout(() => {
      this.hideTip();
      this.timer = undefined;
    }, showTime);
  }

  // animate the robot
  animate() {
    const mixerUpdateDelta = this.clock.getDelta();
    this.mixer?.update(mixerUpdateDelta);
    requestAnimationFrame(() => this.animate());
    this.renderer?.render(this.scene, this.camera!);
  }

  /**
   * make the robot rotate
   * @param x the rotate angle on x axis
   * @param y the rotate angle on y axis
   */
  rotate(x = 0, y = 0) {
    if (this.model) {
      this.model.rotation.y = MODEL_CONFIG.rotation[1] + y;
      this.model.rotation.x = MODEL_CONFIG.rotation[0] + x;
    }
  }
}
