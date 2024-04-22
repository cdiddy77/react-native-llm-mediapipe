//
//  LlmInferenceModule.swift
//  rnllm
//
//  Created by Charles Parker on 4/20/24.
//

import Foundation
import React

@objc(LlmInferenceModule)
class LlmInferenceModule: RCTEventEmitter {
  private var nextHandle = 1
  var modelMap = [Int: LlmInferenceModel]()

  override func supportedEvents() -> [String]! {
    return ["logging", "onPartialResponse", "onErrorResponse"]
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc(createModel:withMaxTokens:withTopK:withTemperature:withRandomSeed:resolver:rejecter:)
  func createModel(
    _ modelName: String,
    maxTokens: Int,
    topK: Int,
    temperature: NSNumber,
    randomSeed: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    os_log("createModel IS CALLED")
    // Example implementation
    // Pretend we're creating a model and assigning it an integer handle
    let modelHandle = nextHandle
    nextHandle += 1

    do {
      let model = try LlmInferenceModel(
        handle: modelHandle,
        modelName: modelName,
        maxTokens: maxTokens,
        topK: topK,
        temperature: temperature.floatValue,
        randomSeed: randomSeed
      )
      model.delegate = self
      modelMap[modelHandle] = model
      resolve(modelHandle)
    } catch let error as NSError {
      // If an error is thrown, reject the promise
      // You can customize the error code and message as needed
      reject(error.domain, "An error occurred: \(error.localizedDescription)", error)
    }
  }

  @objc(releaseModel:resolver:rejecter:)
  func releaseModel(
    _ handle: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    if let entry = modelMap.removeValue(forKey: handle) {
      resolve(true)
    } else {
      reject("INVALID_HANDLE", "No model found for handle \(handle)", nil)
    }
  }

  @objc(
    generateResponse:
    withRequestId:
    withPrompt:
    resolver:
    rejecter:
  )
  func generateResponse(
    _ handle: Int,
    requestId: Int,
    prompt: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    os_log("generateResponse IS CALLED")
    if let entry = modelMap[handle] {
      entry.generateResponse(
        prompt: prompt,
        requestId: requestId,
        resolve: resolve,
        reject: reject
      )
    } else {
      reject( "INVALID_HANDLE", "No model found for handle \(handle)",nil)
    }
  }

  private func sendLoggingEvent(handle: Int, message: String) {
    self.sendEvent(withName: "logging", body: ["handle": handle, "message": message])
  }
  private func sendPartialResponseEvent(handle: Int, requestId: Int, response: String) {
    self.sendEvent(
      withName: "onPartialResponse",
      body: ["handle": handle, "requestId": requestId, "response": response])
  }
  private func sendErrorResponseEvent(handle: Int, requestId: Int, error: String) {
    self.sendEvent(
      withName: "onErrorResponse", body: ["handle": handle, "requestId": requestId, "error": error])
  }
}

extension LlmInferenceModule: LlmInferenceModelDelegate {
  func logging(_ model: LlmInferenceModel, message: String) {
    self.sendLoggingEvent(handle: model.handle, message: message)
  }
  func onPartialResponse(_ model: LlmInferenceModel, requestId: Int, response: String) {
    self.sendPartialResponseEvent(handle: model.handle, requestId: requestId, response: response)
  }
  func onErrorResponse(_ model: LlmInferenceModel, requestId: Int, error: String) {
    self.sendErrorResponseEvent(handle: model.handle, requestId: requestId, error: error)
  }
}
