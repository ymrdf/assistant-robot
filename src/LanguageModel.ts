import * as qna from "@tensorflow-models/qna";
import type { QuestionAndAnswer } from "@tensorflow-models/qna";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { ELanguageModelStatus } from "./constants";
import { findHighestScoreItem } from "./utils.ts";
import type { TCallback, ILanguageModelOptions } from "./type";

/**
 * the abstract class to use a language model.
 * The language model manager should to extend this class to used in the assistant.
 */
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

/**
 * The default language model implementation to used in assistant robot.
 * It used mobile bert(https://openreview.net/forum?id=SJxjVaNKwB).
 * It is faster and smaller, but it's not very good.
 */
export class MobileBertModel extends LanguageModel {
  // The content to extract answers from.
  passage: string;
  // specifies custom url of the model. This is useful for area/countries that don't have access to the model hosted on GCP.
  modelUrl: string;
  // the real language model
  model: QuestionAndAnswer | undefined;

  constructor({ passage, modelUrl }: ILanguageModelOptions) {
    super();
    this.passage = passage;
    this.modelUrl = modelUrl;
    this.init();
  }

  // to load real language model
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

  /**
   * ask model question
   * @param question question to ask
   * @returns answer of the question
   */
  async findAnswers(question: string) {
    if (this.model) {
      const answers = await this.model.findAnswers(question, this.passage);
      const answer = findHighestScoreItem(answers);
      return !answer ? "" : answer.text;
    }
    return "";
  }
}
