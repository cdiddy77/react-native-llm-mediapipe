//
//  LlmInferenceModule.m
//  rnllm
//
//  Created by Charles Parker on 4/20/24.
//

#import <Foundation/Foundation.h>
#include <objc/NSObjCRuntime.h>
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(LlmInferenceModule, RCTEventEmitter)

RCT_EXTERN_METHOD(createModel:(nonnull NSString*)modelPath
                  withMaxTokens:(NSInteger)maxTokens
                  withTopK:(NSInteger)topK
                  withTemperature:(nonnull NSNumber*)temperature
                  withRandomSeed:(NSInteger)randomSeed
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createModelFromAsset:(nonnull NSString*)modelName
                  withMaxTokens:(NSInteger)maxTokens
                  withTopK:(NSInteger)topK
                  withTemperature:(nonnull NSNumber*)temperature
                  withRandomSeed:(NSInteger)randomSeed
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(releaseModel:(NSInteger)handle
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateResponse:(NSInteger)handle
                  withRequestId:(NSInteger)requestId
                  withPrompt:(nonnull NSString*)prompt
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
