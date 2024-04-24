package com.llmmediapipe

import android.content.Context
import com.facebook.react.bridge.Promise
import com.google.mediapipe.tasks.genai.llminference.LlmInference
import java.io.File
import java.io.FileOutputStream

class LlmInferenceModel(
        private var context: Context,
        private val modelPath: String,
        val maxTokens: Int,
        val topK: Int,
        val temperature: Float,
        val randomSeed: Int,
        val inferenceListener: InferenceListener? = null,
) {
    private var llmInference: LlmInference

    private val modelExists: Boolean
        get() = modelPath != null && File(modelPath).exists()

    // so we cannot have concurrent requests
    private var requestId: Int = 0
    private var requestResult: String = ""
    private var requestPromise: Promise? = null

    init {
        val options =
                LlmInference.LlmInferenceOptions.builder()
                        .setModelPath(modelPath)
                        .setMaxTokens(maxTokens)
                        .setTopK(topK)
                        .setTemperature(temperature)
                        .setRandomSeed(randomSeed)
                        .setResultListener { partialResult, done ->
                            inferenceListener?.onResults(this, requestId, partialResult)
                            requestResult += partialResult
                            if (done) {
                                requestPromise?.resolve(requestResult)
                            }
                        }
                        .setErrorListener { ex ->
                            inferenceListener?.onError(this, requestId, ex.message ?: "")
                        }
                        .build()

        llmInference = LlmInference.createFromOptions(context, options)
    }

    fun generateResponseAsync(requestId: Int, prompt: String, promise: Promise) {
        this.requestId = requestId
        this.requestResult = ""
        this.requestPromise = promise
        llmInference.generateResponseAsync(prompt)
    }
}

interface InferenceListener {
    fun logging(model: LlmInferenceModel, message: String)
    fun onError(model: LlmInferenceModel, requestId: Int, error: String)
    fun onResults(model: LlmInferenceModel, requestId: Int, response: String)
}
