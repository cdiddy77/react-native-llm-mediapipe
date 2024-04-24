// Copyright 2024 The MediaPipe Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Foundation
import MediaPipeTasksGenAI
import React

protocol LlmInferenceModelDelegate: AnyObject {
  func logging(_ model: LlmInferenceModel, message: String)
  func onPartialResponse(_ model: LlmInferenceModel, requestId: Int, response: String)
  func onErrorResponse(_ model: LlmInferenceModel, requestId: Int, error: String)
}

final class LlmInferenceModel {

  weak var delegate: LlmInferenceModelDelegate?

  private lazy var inference: LlmInference! = {
    let llmOptions = LlmInference.Options(modelPath: self.modelPath)
    llmOptions.maxTokens = self.maxTokens
    llmOptions.topk = self.topK
    llmOptions.temperature = self.temperature
    llmOptions.randomSeed = self.randomSeed
    return LlmInference(options: llmOptions)
  }()

  var handle: Int
  private var modelPath: String
  private var maxTokens: Int
  private var topK: Int
  private var temperature: Float
  private var randomSeed: Int

  init(
    handle: Int,
    modelPath: String,
    maxTokens: Int,
    topK: Int,
    temperature: Float,
    randomSeed: Int
  ) throws {
    self.handle = handle
    self.modelPath = modelPath
    self.maxTokens = maxTokens
    self.topK = topK
    self.temperature = temperature
    self.randomSeed = randomSeed
  }

  func generateResponse(
    prompt: String,
    requestId: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    var result = ""
    do {
      try self.inference.generateResponseAsync(
        inputText: prompt,
        progress: { partialResponse, error in
          if let error = error {
            self.delegate?.onErrorResponse(
              self, requestId: requestId, error: "Error generating response: \(error)")
            // should we reject or resolve?
            reject("GENERATE_RESPONSE_ERROR", "Error generating response: \(error)", error)
          } else if let partialResponse = partialResponse {
            self.delegate?.onPartialResponse(self, requestId: requestId, response: partialResponse)
            result += partialResponse
          }
        },
        completion: {
          resolve(result)
        })
    } catch {
      reject("INIT_GENERATE_RESPONSE_ERROR", "Failed to call generate response: \(error)", error)
    }
  }

}
