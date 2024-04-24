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
