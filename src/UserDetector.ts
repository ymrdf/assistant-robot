import * as mpFaceDetection from "@mediapipe/face_detection";
import * as faceDetection from "@tensorflow-models/face-detection";
import type { FaceDetector } from "@tensorflow-models/face-detection";
import { VIDEO_SIZE, TARGET_FPS } from "./constants";
import { isMobile } from "./utils";
import { IUserDetectorConfig } from "./type";

export class UserDetector {
  video;
  detector: FaceDetector | undefined;
  videoWidth;
  videoHeight;
  options: IUserDetectorConfig;

  constructor(options: IUserDetectorConfig = {}) {
    this.options = options;
    this.video = document.createElement("video");
    this.videoWidth = isMobile()
      ? VIDEO_SIZE.small.width
      : VIDEO_SIZE.big.width;
    this.videoHeight = isMobile()
      ? VIDEO_SIZE.small.height
      : VIDEO_SIZE.big.height;

    this.init();
  }

  init() {
    this.initVideo();
    this.createDetector();
  }

  async initVideo() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        "Browser API navigator.mediaDevices.getUserMedia not available"
      );
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

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

    this.video.srcObject = stream;

    await new Promise((resolve) => {
      this.video.onloadedmetadata = () => {
        resolve(this.video);
      };
    });

    this.video.play();
  }

  async createDetector() {
    console.log("--->", mpFaceDetection.VERSION);
    this.detector = await faceDetection.createDetector(
      faceDetection.SupportedModels.MediaPipeFaceDetector,
      {
        runtime: "mediapipe",
        modelType: "short",
        maxFaces: 1,
        solutionPath: this.options.solutionPath
          ? this.options.solutionPath
          : `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@${mpFaceDetection.VERSION}`, //`http://localhost:5173/face_detection`,
        // solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@${mpFaceDetection.VERSION}`,
      }
    );
  }

  async getFaces() {
    if (!this.video.paused && this.detector) {
      return await this.detector.estimateFaces(this.video, {
        flipHorizontal: false,
      });
    } else {
      return [];
    }
  }

  async getFace() {
    const faces = await this.getFaces();
    return faces[0];
  }

  async getFacePostion() {
    const face = await this.getFace();
    if (face) {
      const box = face.box;
      return [(box.xMin + box.xMax) / 2, (box.yMin + box.yMax) / 2];
    } else {
      return [];
    }
  }

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
}
