/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { colors, styles } from './styles';
import { type Message } from './types';
import { useLlmInference } from 'react-native-llm-mediapipe';

const samplePrompts = [
  "Explain the difference between 'affect' and 'effect' and use both words correctly in a complex sentence.",
  'If all Roses are flowers and some flowers fade quickly, can it be concluded that some roses fade quickly? Explain your answer.',
  'A shop sells apples for $2 each and bananas for $1 each. If I buy 3 apples and 2 bananas, how much change will I get from a $10 bill?',
  "Describe the process of photosynthesis and explain why it's crucial for life on Earth.",
  'Who was the president of the United States during World War I, and what were the major contributions of his administration during that period?',
  'Discuss the significance of Diwali in Indian culture and how it is celebrated across different regions of India.',
  'Should self-driving cars be programmed to prioritize the lives of pedestrians over the occupants of the car in the event of an unavoidable accident? Discuss the ethical considerations.',
  'Imagine a world where water is more valuable than gold. Describe a day in the life of a trader dealing in water.',
  'Given that you learned about a new scientific discovery that overturns the previously understood mechanism of muscle growth, explain how this might impact current fitness training regimens.',
  'What are the potential benefits and risks of using AI in recruiting and hiring processes, and how can companies mitigate the risks?',
];

let samplePromptIndex = 0;

function App(): React.JSX.Element {
  const textInputRef = React.useRef<TextInput>(null);
  const [prompt, setPrompt] = React.useState('');
  const messagesScrollViewRef = React.useRef<ScrollView>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [partialResponse, setPartialResponse] = React.useState<Message>();

  const llmInference = useLlmInference({
    storageType: 'asset',
    modelName: 'gemma-2b-it-cpu-int4.bin',
  });

  const onSendPrompt = React.useCallback(async () => {
    if (prompt.length === 0) {
      return;
    }
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setPartialResponse({ role: 'assistant', content: '' });
    setPrompt('');
    const response = await llmInference.generateResponse(
      prompt,
      (partial) => {
        setPartialResponse((prev) => ({
          role: 'assistant',
          content: (prev?.content ?? '') + partial,
        }));
      },
      (error) => {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          { role: 'error', content: `${error}` },
        ]);
        setPartialResponse(undefined);
      }
    );
    setPartialResponse(undefined);
    setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
  }, [llmInference, prompt]);

  const onSamplePrompt = React.useCallback(() => {
    setPrompt(samplePrompts[samplePromptIndex++ % samplePrompts.length] ?? '');
    textInputRef.current?.focus();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardRoot}
      >
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          style={styles.promptInnerContainer}
        >
          <ScrollView
            ref={messagesScrollViewRef}
            style={styles.messagesScrollView}
            contentContainerStyle={styles.messagesContainer}
            // onContentSizeChange={() =>
            //   messagesScrollViewRef.current?.scrollToEnd()
            // }
          >
            {messages.map((m, index) => (
              <MessageView message={m} key={index} />
            ))}
            {partialResponse && <MessageView message={partialResponse} />}
          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={styles.promptRow}>
          <Pressable
            onPress={onSamplePrompt}
            // disabled={prompt.length === 0 || partialResponse !== undefined}
            style={styles.samplePromptButton}
          >
            <Text style={styles.samplePromptButtonText}>⚡️</Text>
          </Pressable>
          <TextInput
            ref={textInputRef}
            selectTextOnFocus={true}
            onChangeText={setPrompt}
            value={prompt}
            placeholder={'prompt...'}
            placeholderTextColor={colors.light}
            multiline={true}
            style={styles.promptInput}
          />
          <Pressable
            onPress={onSendPrompt}
            // disabled={prompt.length === 0 || partialResponse !== undefined}
            style={styles.sendButton}
          >
            {partialResponse !== undefined ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const MessageView: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <View style={styles.message}>
      <Text style={styles.messageText}>{message.content}</Text>
    </View>
  );
};

export default App;
