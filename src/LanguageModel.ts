import * as qna from "@tensorflow-models/qna";
import type { QuestionAndAnswer } from "@tensorflow-models/qna";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { ELanguageModelStatus } from "./constants";
import { findHighestScoreItem } from "./utils.ts";
import type { TCallback, ILanguageModelOptions } from "./type";

export abstract class LanguageModel {
  status = ELanguageModelStatus.loading;
  onLoadList: TCallback[] = [];

  loaded() {
    this.status = ELanguageModelStatus.ready;
    this.onLoadList.forEach((fn) => fn());
  }

  onLoad(fn: TCallback) {
    this.onLoadList.push(fn);
  }

  removeLoadCb(fn: TCallback) {
    this.onLoadList = this.onLoadList.filter((f) => f != fn);
  }

  abstract findAnswers(question: string): Promise<string>;

  constructor() {}
}

export class MobileBertModel extends LanguageModel {
  passage: string;
  modelUrl: string;
  model: QuestionAndAnswer | undefined;

  constructor({ passage, modelUrl }: ILanguageModelOptions) {
    super();
    this.passage = passage;
    this.modelUrl = modelUrl;
    this.init();
  }

  async init() {
    this.status = ELanguageModelStatus.loading;
    try {
      const config = this.modelUrl ? { modelUrl: this.modelUrl } : undefined;
      this.model = await qna.load(config);
      this.loaded();
    } catch (e) {
      console.warn(e);
      this.status = ELanguageModelStatus.error;
    }
  }

  async findAnswers(question: string) {
    if (this.model) {
      const answers = await this.model.findAnswers(question, this.passage);
      const answer = findHighestScoreItem(answers);
      return !answer ? "" : answer.text;
    }
    return "";
  }
}
