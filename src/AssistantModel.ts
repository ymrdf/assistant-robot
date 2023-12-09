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

export class AssistantModel {
  clock = new Clock();
  container;
  tip: HTMLElement;
  scene: Scene = new Scene();
  renderer: WebGL1Renderer | undefined;
  model: Object3D | undefined;
  camera: PerspectiveCamera | undefined;

  mixer: AnimationMixer | undefined;
  clips: AnimationClip[] | undefined;

  timer: number | undefined;

  options: TRobotModelConfig;

  idleAction: AnimationAction | undefined;

  constructor(container: Element, options: TRobotModelConfig) {
    this.options = options;
    this.container = container;
    this.tip = container.querySelector("." + ASSISTANT_TIP_CONTAINER)!;
    this.hideTip();
    this.init(options);
  }

  init(options: TRobotModelConfig = {}) {
    const {
      backgroundColor,
      backgroundAlpha,
      modelUrl = defaultModel,
    } = options;

    if (backgroundColor) {
      this.scene.background = new Color(backgroundColor);
    }

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

  haltIdleAction(durationInSeconds: number) {
    this.idleAction?.stop();
    console.log();
    if (durationInSeconds !== Infinity) {
      setTimeout(() => {
        this.idleAction?.play();
      }, durationInSeconds);
    }
  }

  hello() {
    this.play(
      this.options.modelConfig?.helloActionName || MODEL_CONFIG.helloActionName
    );
  }

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
    console.log("action2", action, action.time);

    console.log("action", action.time);
    const repetTime = loop ? action.repetitions : 1;
    this.haltIdleAction(
      ((action.getClip().duration * repetTime) / action.timeScale) * 1000
    );
    action.reset();
    action.play();
  }

  hideTip() {
    this.tip.style.display = "none";
  }

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

    const showTime = text.length * ONE_LETTER_READ_TIME + READ_WAIT_TIME;

    this.timer = setTimeout(() => {
      this.hideTip();
      this.timer = undefined;
    }, showTime);
  }

  animate() {
    const mixerUpdateDelta = this.clock.getDelta();
    this.mixer?.update(mixerUpdateDelta);
    requestAnimationFrame(() => this.animate());
    this.renderer?.render(this.scene, this.camera!);
  }

  rotate(x = 0, y = 0) {
    if (this.model) {
      this.model.rotation.y = MODEL_CONFIG.rotation[1] + y;
      this.model.rotation.x = MODEL_CONFIG.rotation[0] + x;
    }
  }
}
