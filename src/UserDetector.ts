import * as mpFaceDetection from "@mediapipe/face_detection";
import * as faceDetection from "@tensorflow-models/face-detection";
import type { FaceDetector } from "@tensorflow-models/face-detection";
import { VIDEO_SIZE, TARGET_FPS, EUserDetectorStatus } from "./constants";
import { isMobile, EventListener } from "./utils";
import { IUserDetectorConfig } from "./type";

/**
 * user detect module.open the camera to detect the user's face.
 */
export class UserDetector extends EventListener {
  // video tag dom
  video;
  // face detector
  detector: FaceDetector | undefined;
  // the width of camera and video
  videoWidth;
  // the height of camera and video
  videoHeight;
  // configs for this module
  options: IUserDetectorConfig;
  // status of this module
  status: EUserDetectorStatus = EUserDetectorStatus.init;

  constructor(options: IUserDetectorConfig = {}) {
    super();
    this.options = options;
    this.video = document.createElement("video");
    this.videoWidth = isMobile()
      ? VIDEO_SIZE.small.width
      : VIDEO_SIZE.big.width;
    this.videoHeight = isMobile()
      ? VIDEO_SIZE.small.height
      : VIDEO_SIZE.big.height;

    if (navigator.permissions) {
      navigator.permissions
        // @ts-expect-error chrome support the camera permission
        .query({ name: "camera" })
        .then((permissionObj) => {
          if (permissionObj.state === "granted") {
            this.init();
          } else {
            this.createDetector();
          }
        })
        .catch(() => {
          this.createDetector();
        });
    } else {
      this.createDetector();
    }
  }

  init() {
    Promise.all([this.initVideo(), this.createDetector()]).then(() => {
      if (!this.video.paused && this.detector) {
        this.setStatus(EUserDetectorStatus.ready);
      }
    });
  }

  // open the camera
  async initVideo() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn(
        "Browser API navigator.mediaDevices.getUserMedia not available"
      );
      this.setStatus(EUserDetectorStatus.userMediaUnavailable);
      return;
    }

    const videoConfig = {
      audio: false,
      video: {
        facingMode: "user",
        width: this.videoWidth,
        height: this.videoHeight,
        frameRate: {
          ideal: TARGET_FPS,
        },
      },
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

      this.video.srcObject = stream;

      await new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          resolve(this.video);
        };
      });

      this.video.play();
      this.setStatus(EUserDetectorStatus.ready);
    } catch (error: any) {
      console.warn(error);
      if (error.name === "NotAllowedError") {
        this.setStatus(EUserDetectorStatus.openCameraRejected);
      } else {
        this.setStatus(EUserDetectorStatus.openCameraRejected);
        console.error("Error:", error);
      }
    }
  }

  // create the face detector
  async createDetector() {
    try {
      this.detector = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceDetector,
        {
          runtime: "mediapipe",
          modelType: "short",
          maxFaces: 1,
          solutionPath: this.options.solutionPath
            ? this.options.solutionPath
            : `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@${mpFaceDetection.VERSION}`,
        }
      );

      return;
    } catch (e) {
      console.warn(e);
      this.setStatus(EUserDetectorStatus.faceDetectorCreateError);
    }
  }

  // get faces from the video tag
  async getFaces() {
    if (!this.video.paused && this.detector) {
      return await this.detector.estimateFaces(this.video, {
        flipHorizontal: false,
      });
    } else {
      return [];
    }
  }

  // get face from the video tag
  async getFace() {
    const faces = await this.getFaces();
    return faces[0];
  }

  // get face's position in the video
  async getFacePostion() {
    const face = await this.getFace();
    if (face) {
      const box = face.box;
      return [(box.xMin + box.xMax) / 2, (box.yMin + box.yMax) / 2];
    } else {
      return [];
    }
  }

  // get the angle to look at the face
  async getFaceAngle() {
    const facePosition = await this.getFacePostion();
    if (facePosition.length > 1) {
      const [x, y] = facePosition;
      return [
        y / this.videoHeight / 2,
        Math.PI / 12 - ((x / this.videoWidth) * Math.PI) / 6,
      ];
    } else {
      return [];
    }
  }

  setStatus(v: EUserDetectorStatus) {
    this.status = v;
    this.emit("statusChange", this.status);
  }
}
