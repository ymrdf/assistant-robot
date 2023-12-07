import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["src/index.ts", "src/LanguageModel.ts"],
      name: "AssistantRobot",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "three/addons/loaders/GLTFLoader.js",
        "three",
        "@mediapipe/face_detection",
        "@tensorflow-models/face-detection",
        "@tensorflow-models/qna",
        /@tensorflow\//,
      ],
    },
  },
});
