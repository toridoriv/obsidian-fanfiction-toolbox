#!/usr/bin/env node
import fs from "node:fs";

import { LargeLanguageModel, LargeLanguageModelJSON } from "../../source/providers/ai.js";
import { GoogleAiProvider } from "../../source/providers/google.js";

const googleProvider = new GoogleAiProvider({
  query: {
    key: String(process.env.GEMINI_API_KEY),
  },
});

/**
 * @type {LargeLanguageModelJSON[]}
 */
const storedModels = JSON.parse(fs.readFileSync("./static/models.json", "utf-8"));

const modelsV1 = (await googleProvider.listModels("v1")).models.map(
  (m) =>
    new LargeLanguageModel({
      provider: googleProvider,
      name: m.displayName,
      id: m.name,
      version: m.version,
      description: m.description,
      inputTokenLimit: m.inputTokenLimit,
      outputTokenLimit: m.outputTokenLimit,
      supportedOperations: m.supportedGenerationMethods,
      temperature: m.temperature,
      apiVersion: "v1",
    }),
);
const modelsV1Beta = (await googleProvider.listModels("v1beta")).models.map(
  (m) =>
    new LargeLanguageModel({
      provider: googleProvider,
      name: m.displayName,
      id: m.name,
      version: m.version,
      description: m.description,
      inputTokenLimit: m.inputTokenLimit,
      outputTokenLimit: m.outputTokenLimit,
      supportedOperations: m.supportedGenerationMethods,
      temperature: m.temperature,
      apiVersion: "v1beta",
    }),
);

const models = modelsV1.concat(modelsV1Beta);
/**
 * @type {(LargeLanguageModel | LargeLanguageModelJSON)[]}
 */
const newResult = [];

for (const storedModel of storedModels) {
  if (storedModel.provider !== googleProvider.static.name) {
    newResult.push(storedModel);
    continue;
  }
}

for (const model of models) {
  if (model.id.includes("/aqa")) {
    // eslint-disable-next-line no-unused-vars
    const { name, provider, ...rest } = model.toJSON();

    const patchedModel = new LargeLanguageModel({
      ...rest,
      provider: googleProvider,
      name: "Attributed Question Answering",
    });

    newResult.push(patchedModel);

    continue;
  }

  newResult.push(model);
}

fs.writeFileSync("./static/models.json", JSON.stringify(newResult, null, 2));
